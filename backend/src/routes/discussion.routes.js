const express = require('express');
const router = express.Router();
const DiscussionThread = require('../models/discussionThread.model');
const DiscussionPost = require('../models/discussionPost.model');
const Subject = require('../models/subject.model');
const Unit = require('../models/unit.model');
const Resource = require('../models/resource.model');
const { protect } = require('../middleware/auth.middleware');

const CONTEXT_TYPES = ['global', 'subject', 'unit', 'pyq-resource', 'model-paper-subject'];

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeBody = (value) => (typeof value === 'string' ? value.trim() : '');

const validateContextType = (contextType) => {
  if (!CONTEXT_TYPES.includes(contextType)) {
    throw createHttpError(400, 'A valid contextType is required');
  }
};

const serializeAuthor = (author, authorSnapshot) => ({
  _id: String(author?._id || authorSnapshot?.clientUserId || ''),
  name: author?.name || authorSnapshot?.name || 'Unknown user',
  role: author?.role || authorSnapshot?.role || 'student',
  semester: author?.semester ?? authorSnapshot?.semester ?? null,
});

const getViewer = (req) => ({
  userId: String(req.user?._id || req.authUserId || ''),
  role: req.user?.role || 'student',
});

const getPostAuthorKey = (post) => String(post.authorId?._id || post.authorId || post.authorSnapshot?.clientUserId || '');

const isAuthor = (post, viewer) => Boolean(viewer?.userId) && getPostAuthorKey(post) === String(viewer.userId);

const canDeletePost = (post, viewer) => !post.isDeleted && (isAuthor(post, viewer) || viewer.role === 'admin');

const canEditPost = (post, viewer) => !post.isDeleted && isAuthor(post, viewer);

const buildAuthorSnapshot = (req) => {
  const fallbackSnapshot = req.body.authorSnapshot || {};
  const normalizedSemester = Number.isFinite(Number(fallbackSnapshot.semester))
    ? Number(fallbackSnapshot.semester)
    : null;

  return {
    clientUserId: String(req.user?._id || req.authUserId || fallbackSnapshot.clientUserId || ''),
    name: req.user?.name || normalizeBody(fallbackSnapshot.name),
    role: req.user?.role || (fallbackSnapshot.role === 'admin' ? 'admin' : 'student'),
    semester: req.user?.semester ?? normalizedSemester,
  };
};

const serializeReply = (post, viewer) => ({
  _id: String(post._id),
  body: post.isDeleted ? '' : post.body,
  parentId: post.parentId ? String(post.parentId) : null,
  createdAt: post.createdAt,
  editedAt: post.editedAt,
  isDeleted: post.isDeleted,
  author: serializeAuthor(post.authorId, post.authorSnapshot),
  canEdit: canEditPost(post, viewer),
  canDelete: canDeletePost(post, viewer),
});

const serializePost = (post, viewer, replies) => ({
  _id: String(post._id),
  body: post.isDeleted ? '' : post.body,
  parentId: null,
  createdAt: post.createdAt,
  editedAt: post.editedAt,
  isDeleted: post.isDeleted,
  author: serializeAuthor(post.authorId, post.authorSnapshot),
  canEdit: canEditPost(post, viewer),
  canDelete: canDeletePost(post, viewer),
  replies,
});

const buildPlaceholderThread = (resolvedContext) => ({
  _id: null,
  contextType: resolvedContext.contextType,
  contextKey: resolvedContext.contextKey,
  subjectId: resolvedContext.subjectId ? String(resolvedContext.subjectId) : null,
  unitId: resolvedContext.unitId ? String(resolvedContext.unitId) : null,
  resourceId: resolvedContext.resourceId ? String(resolvedContext.resourceId) : null,
  postCount: 0,
  lastActivityAt: null,
});

const resolveContext = async ({ contextType, subjectId, unitId, resourceId }) => {
  validateContextType(contextType);

  if (contextType === 'global') {
    return {
      contextType,
      contextKey: 'global:community',
      subjectId: null,
      unitId: null,
      resourceId: null,
    };
  }

  if (contextType === 'subject') {
    if (!subjectId) throw createHttpError(400, 'subjectId is required for subject discussions');
    const subject = await Subject.findById(subjectId).select('_id');
    if (!subject) throw createHttpError(404, 'Subject not found');
    return {
      contextType,
      contextKey: `subject:${subject._id}`,
      subjectId: subject._id,
      unitId: null,
      resourceId: null,
    };
  }

  if (contextType === 'unit') {
    if (!unitId) throw createHttpError(400, 'unitId is required for unit discussions');
    const unit = await Unit.findById(unitId).select('_id subjectId');
    if (!unit) throw createHttpError(404, 'Unit not found');
    return {
      contextType,
      contextKey: `unit:${unit._id}`,
      subjectId: unit.subjectId,
      unitId: unit._id,
      resourceId: null,
    };
  }

  if (contextType === 'pyq-resource') {
    if (!resourceId) throw createHttpError(400, 'resourceId is required for PYQ discussions');
    const resource = await Resource.findById(resourceId).select('_id subjectId category');
    if (!resource) throw createHttpError(404, 'PYQ resource not found');
    if (resource.category !== 'pyq') throw createHttpError(400, 'Discussion is only available for PYQ resources');
    return {
      contextType,
      contextKey: `pyq-resource:${resource._id}`,
      subjectId: resource.subjectId,
      unitId: null,
      resourceId: resource._id,
    };
  }

  if (!subjectId) throw createHttpError(400, 'subjectId is required for model paper discussions');
  const subject = await Subject.findById(subjectId).select('_id');
  if (!subject) throw createHttpError(404, 'Subject not found');

  return {
    contextType,
    contextKey: `model-paper-subject:${subject._id}`,
    subjectId: subject._id,
    unitId: null,
    resourceId: null,
  };
};

const ensureThread = async (resolvedContext, userId) => (
  DiscussionThread.findOneAndUpdate(
    { contextKey: resolvedContext.contextKey },
    {
      $setOnInsert: {
        contextType: resolvedContext.contextType,
        contextKey: resolvedContext.contextKey,
        subjectId: resolvedContext.subjectId || null,
        unitId: resolvedContext.unitId || null,
        resourceId: resolvedContext.resourceId || null,
        createdBy: userId,
        lastActivityAt: new Date(),
      },
    },
    { new: true, upsert: true }
  )
);

const buildThreadView = async (thread, viewer) => {
  const topLevelPosts = await DiscussionPost.find({
    threadId: thread._id,
    parentId: null,
  })
    .populate('authorId', 'name role semester')
    .sort({ createdAt: -1 });

  const topLevelIds = topLevelPosts.map((post) => post._id);
  const replyPosts = topLevelIds.length > 0
    ? await DiscussionPost.find({
      threadId: thread._id,
      parentId: { $in: topLevelIds },
    })
      .populate('authorId', 'name role semester')
      .sort({ createdAt: 1 })
    : [];

  const repliesByParent = new Map();
  replyPosts.forEach((reply) => {
    if (reply.isDeleted) return;
    const parentKey = String(reply.parentId);
    if (!repliesByParent.has(parentKey)) {
      repliesByParent.set(parentKey, []);
    }
    repliesByParent.get(parentKey).push(serializeReply(reply, viewer));
  });

  const posts = topLevelPosts.reduce((acc, post) => {
    const replies = repliesByParent.get(String(post._id)) || [];
    if (post.isDeleted && replies.length === 0) {
      return acc;
    }

    acc.push(serializePost(post, viewer, replies));
    return acc;
  }, []);

  const visibleReplyCount = replyPosts.filter((reply) => !reply.isDeleted).length;

  return {
    thread: {
      _id: String(thread._id),
      contextType: thread.contextType,
      contextKey: thread.contextKey,
      subjectId: thread.subjectId ? String(thread.subjectId) : null,
      unitId: thread.unitId ? String(thread.unitId) : null,
      resourceId: thread.resourceId ? String(thread.resourceId) : null,
      postCount: posts.length + visibleReplyCount,
      lastActivityAt: thread.lastActivityAt || null,
    },
    posts,
  };
};

router.get('/context', protect, async (req, res) => {
  try {
    const viewer = getViewer(req);
    const resolvedContext = await resolveContext({
      contextType: req.query.contextType?.toString(),
      subjectId: req.query.subjectId?.toString(),
      unitId: req.query.unitId?.toString(),
      resourceId: req.query.resourceId?.toString(),
    });

    const thread = await DiscussionThread.findOne({ contextKey: resolvedContext.contextKey });
    if (!thread) {
      return res.json({
        thread: buildPlaceholderThread(resolvedContext),
        posts: [],
      });
    }

    const payload = await buildThreadView(thread, viewer);
    res.json(payload);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post('/context/posts', protect, async (req, res) => {
  try {
    const viewer = getViewer(req);
    const body = normalizeBody(req.body.body);
    if (!body) {
      throw createHttpError(400, 'Post body is required');
    }
    if (body.length > 1000) {
      throw createHttpError(400, 'Post body must be 1000 characters or less');
    }
    if (!viewer.userId) {
      throw createHttpError(401, 'Not authorized, please log in again');
    }

    const authorSnapshot = buildAuthorSnapshot(req);
    if (!authorSnapshot.name) {
      throw createHttpError(400, 'Author details are missing. Please log in again.');
    }

    const resolvedContext = await resolveContext({
      contextType: req.body.contextType,
      subjectId: req.body.subjectId,
      unitId: req.body.unitId,
      resourceId: req.body.resourceId,
    });

    let thread = null;
    const parentId = req.body.parentId?.toString() || null;

    if (parentId) {
      thread = await DiscussionThread.findOne({ contextKey: resolvedContext.contextKey });
      if (!thread) {
        throw createHttpError(404, 'Discussion thread not found for this context');
      }

      const parentPost = await DiscussionPost.findById(parentId);
      if (!parentPost || String(parentPost.threadId) !== String(thread._id)) {
        throw createHttpError(404, 'Parent post not found');
      }
      if (parentPost.parentId) {
        throw createHttpError(400, 'Only one reply level is allowed');
      }
      if (parentPost.isDeleted) {
        throw createHttpError(400, 'Replies to deleted posts are not allowed');
      }
    } else {
      thread = await ensureThread(resolvedContext, viewer.userId);
    }

    const post = await DiscussionPost.create({
      threadId: thread._id,
      authorId: viewer.userId,
      authorSnapshot,
      body,
      parentId: parentId || null,
    });

    await DiscussionThread.findByIdAndUpdate(thread._id, { $set: { lastActivityAt: post.createdAt } });

    const createdPost = await DiscussionPost.findById(post._id).populate('authorId', 'name role semester');
    res.status(201).json({
      post: serializeReply(createdPost, viewer),
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.patch('/posts/:id', protect, async (req, res) => {
  try {
    const viewer = getViewer(req);
    const body = normalizeBody(req.body.body);
    if (!body) {
      throw createHttpError(400, 'Post body is required');
    }
    if (body.length > 1000) {
      throw createHttpError(400, 'Post body must be 1000 characters or less');
    }

    const post = await DiscussionPost.findById(req.params.id).populate('authorId', 'name role semester');
    if (!post) {
      throw createHttpError(404, 'Discussion post not found');
    }
    if (post.isDeleted) {
      throw createHttpError(400, 'Deleted posts cannot be edited');
    }
    if (!isAuthor(post, viewer)) {
      throw createHttpError(403, 'You can only edit your own posts');
    }

    post.body = body;
    post.editedAt = new Date();
    await post.save();

    res.json({
      post: serializeReply(post, viewer),
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.delete('/posts/:id', protect, async (req, res) => {
  try {
    const viewer = getViewer(req);
    const post = await DiscussionPost.findById(req.params.id);
    if (!post) {
      throw createHttpError(404, 'Discussion post not found');
    }
    if (!canDeletePost(post, viewer)) {
      throw createHttpError(403, 'You are not allowed to delete this post');
    }
    if (post.isDeleted) {
      return res.json({ message: 'Discussion post removed' });
    }

    post.isDeleted = true;
    post.deletedAt = new Date();
    await post.save();
    await DiscussionThread.findByIdAndUpdate(post.threadId, { $set: { lastActivityAt: new Date() } });

    res.json({ message: 'Discussion post removed' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

module.exports = router;
