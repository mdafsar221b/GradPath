"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, CheckCircle2, Circle, Clock, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AssignmentType = "Assignment" | "Tutorial" | "Lab File";
type AssignmentStatus = "Pending" | "In Progress" | "Completed";
type AssignmentPriority = "Low" | "Medium" | "High";

interface Assignment {
    id: string;
    title: string;
    subject: string;
    type: AssignmentType;
    deadline: string;
    status: AssignmentStatus;
    priority: AssignmentPriority;
}

export default function AssignmentTracker() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<AssignmentStatus | "All">("All");
    const [filterType, setFilterType] = useState<AssignmentType | "All">("All");

    const [formData, setFormData] = useState<Omit<Assignment, "id">>({
        title: "",
        subject: "",
        type: "Assignment",
        deadline: "",
        status: "Pending",
        priority: "Medium",
    });

    useEffect(() => {
        const saved = localStorage.getItem("gradpath_assignments");
        if (saved) {
            setAssignments(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("gradpath_assignments", JSON.stringify(assignments));
    }, [assignments]);

    const addAssignment = () => {
        if (!formData.title || !formData.subject || !formData.deadline) return;

        const newAssignment: Assignment = {
            ...formData,
            id: Date.now().toString(),
        };

        setAssignments([...assignments, newAssignment]);
        resetForm();
    };

    const updateAssignment = () => {
        if (!editingId) return;

        setAssignments(
            assignments.map((a) => (a.id === editingId ? { ...formData, id: a.id } : a))
        );
        resetForm();
    };

    const deleteAssignment = (id: string) => {
        setAssignments(assignments.filter((a) => a.id !== id));
    };

    const startEdit = (assignment: Assignment) => {
        setFormData({
            title: assignment.title,
            subject: assignment.subject,
            type: assignment.type,
            deadline: assignment.deadline,
            status: assignment.status,
            priority: assignment.priority,
        });
        setEditingId(assignment.id);
        setIsAdding(true);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            subject: "",
            type: "Assignment",
            deadline: "",
            status: "Pending",
            priority: "Medium",
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const getFilteredAssignments = () => {
        return assignments.filter((a) => {
            const statusMatch = filterStatus === "All" || a.status === filterStatus;
            const typeMatch = filterType === "All" || a.type === filterType;
            return statusMatch && typeMatch;
        });
    };

    const isOverdue = (deadline: string) => {
        return new Date(deadline) < new Date() && formData.status !== "Completed";
    };

    const getStatusIcon = (status: AssignmentStatus) => {
        switch (status) {
            case "Completed":
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case "In Progress":
                return <Clock className="w-4 h-4 text-blue-500" />;
            default:
                return <Circle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getPriorityColor = (priority: AssignmentPriority) => {
        switch (priority) {
            case "High":
                return "bg-red-500";
            case "Medium":
                return "bg-yellow-500";
            default:
                return "bg-green-500";
        }
    };

    const filteredAssignments = getFilteredAssignments();

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as AssignmentStatus | "All")}
                        className="px-3 py-2 border rounded-lg text-sm"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as AssignmentType | "All")}
                        className="px-3 py-2 border rounded-lg text-sm"
                    >
                        <option value="All">All Types</option>
                        <option value="Assignment">Assignment</option>
                        <option value="Tutorial">Tutorial</option>
                        <option value="Lab File">Lab File</option>
                    </select>
                </div>

                <Button onClick={() => setIsAdding(!isAdding)}>
                    <Plus className="w-4 h-4 mr-2" /> Add New
                </Button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">{editingId ? "Edit" : "Add"} Assignment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Title</label>
                                        <Input
                                            placeholder="Assignment title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject</label>
                                        <Input
                                            placeholder="Subject name"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as AssignmentType })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        >
                                            <option value="Assignment">Assignment</option>
                                            <option value="Tutorial">Tutorial</option>
                                            <option value="Lab File">Lab File</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Deadline</label>
                                        <Input
                                            type="date"
                                            value={formData.deadline}
                                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as AssignmentStatus })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Priority</label>
                                        <select
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as AssignmentPriority })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={editingId ? updateAssignment : addAssignment}>
                                        {editingId ? "Update" : "Add"} Assignment
                                    </Button>
                                    <Button variant="outline" onClick={resetForm}>
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                <AnimatePresence>
                    {filteredAssignments.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                No assignments found. Add one to get started!
                            </CardContent>
                        </Card>
                    ) : (
                        filteredAssignments.map((assignment) => (
                            <motion.div
                                key={assignment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <Card className={isOverdue(assignment.deadline) ? "border-red-500" : ""}>
                                    <CardContent className="py-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(assignment.status)}
                                                    <h3 className="font-semibold text-lg">{assignment.title}</h3>
                                                    {isOverdue(assignment.deadline) && (
                                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline">{assignment.subject}</Badge>
                                                    <Badge variant="secondary">{assignment.type}</Badge>
                                                    <Badge className={getPriorityColor(assignment.priority)}>
                                                        {assignment.priority}
                                                    </Badge>
                                                    <Badge variant={assignment.status === "Completed" ? "default" : "outline"}>
                                                        {assignment.status}
                                                    </Badge>
                                                </div>

                                                <p className="text-sm text-muted-foreground">
                                                    Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => startEdit(assignment)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deleteAssignment(assignment.id)}
                                                    className="text-destructive hover:text-destructive/90"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
