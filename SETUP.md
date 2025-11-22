# 🔧 Environment Setup Guide

## Step 1: Create `.env.local` File

Create a file named `.env.local` in the root of your project with the following content:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGlzdGluY3QtcmVpbmRlZXItNzAuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_NGcNouqrstv9I6i5ezSpiSZUwTMY33RYD7mCq5vVqC
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# MongoDB
MONGODB_URI=mongodb+srv://mdafsar221b:x7b9tityzx@cinepath-cluster.tpblges.mongodb.net/gradpath?appName=cinepath-cluster

# Admin Email (users with this email get admin access)
ADMIN_EMAIL=mdafsar221b@gmail.com
```

> **Important**: Replace `ADMIN_EMAIL` with your actual admin email address.

## Step 2: Restart Development Server

After creating the `.env.local` file, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then start it again
npm run dev
```

## Step 3: Test Authentication

1. Go to `http://localhost:3000`
2. Click on the user button in the header (should show "Sign In")
3. Create an account using your admin email
4. After signing in, you should see the Admin link in the header

## Step 4: Access Admin Panel

1. Click "Admin" in the header
2. You should see the admin dashboard
3. Try adding a test resource

## 🚀 How to Add Resources

### Upload to Google Drive

1. Upload your file (PDF, notes, etc.) to Google Drive
2. Right-click the file → **Share**
3. Click **Get link**
4. Set permission to **"Anyone with the link can view"**
5. Copy the shareable link

### Add to GradPath

1. Go to Admin Panel → Resources → Add Resource
2. Fill in the form:
   - **Semester**: Select 1-6
   - **Subject Code**: e.g., "CS101"
   - **Subject Name**: e.g., "Data Structures"
   - **Resource Type**: Notes/PYQ/Syllabus/Book
   - **Title**: Descriptive title
   - **Google Drive Link**: Paste the link you copied
   - **File Type**: PDF/DOCX/PPTX/Video
3. Click "Add Resource"

## 📝 Notes

- The `.env.local` file is gitignored for security
- Never commit your `.env.local` file to GitHub
- Make sure MongoDB connection string is correct
- Admin access is granted only to the email specified in `ADMIN_EMAIL`

## 🔍 Troubleshooting

### "Unauthorized" Error
- Make sure you're signed in with the admin email
- Check that `ADMIN_EMAIL` in `.env.local` matches your Clerk account email

### MongoDB Connection Error
- Verify your MongoDB connection string
- Make sure your IP is whitelisted in MongoDB Atlas
- Check if the database name is correct

### Clerk Authentication Not Working
- Verify Clerk API keys are correct
- Make sure you've restarted the dev server after adding env variables
