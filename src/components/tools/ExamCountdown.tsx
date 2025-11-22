"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Clock, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ExamType = "Mid-term" | "End-term" | "Quiz" | "Practical";

interface Exam {
    id: string;
    subject: string;
    examType: ExamType;
    dateTime: string;
}

interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function ExamCountdown() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const [formData, setFormData] = useState<Omit<Exam, "id">>({
        subject: "",
        examType: "Mid-term",
        dateTime: "",
    });

    useEffect(() => {
        const saved = localStorage.getItem("gradpath_exams");
        if (saved) {
            setExams(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("gradpath_exams", JSON.stringify(exams));
    }, [exams]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const addExam = () => {
        if (!formData.subject || !formData.dateTime) return;

        const newExam: Exam = {
            ...formData,
            id: Date.now().toString(),
        };

        setExams([...exams, newExam]);
        resetForm();
    };

    const updateExam = () => {
        if (!editingId) return;

        setExams(
            exams.map((e) => (e.id === editingId ? { ...formData, id: e.id } : e))
        );
        resetForm();
    };

    const deleteExam = (id: string) => {
        setExams(exams.filter((e) => e.id !== id));
    };

    const startEdit = (exam: Exam) => {
        setFormData({
            subject: exam.subject,
            examType: exam.examType,
            dateTime: exam.dateTime,
        });
        setEditingId(exam.id);
        setIsAdding(true);
    };

    const resetForm = () => {
        setFormData({
            subject: "",
            examType: "Mid-term",
            dateTime: "",
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const calculateTimeRemaining = (examDateTime: string): TimeRemaining | null => {
        const examDate = new Date(examDateTime);
        const diff = examDate.getTime() - currentTime.getTime();

        if (diff < 0) return null;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    };

    const sortedExams = [...exams].sort((a, b) =>
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );

    const upcomingExams = sortedExams.filter(
        (exam) => new Date(exam.dateTime) > currentTime
    );

    const getExamTypeColor = (type: ExamType) => {
        switch (type) {
            case "End-term":
                return "bg-red-500";
            case "Mid-term":
                return "bg-orange-500";
            case "Practical":
                return "bg-blue-500";
            default:
                return "bg-green-500";
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-end">
                <Button onClick={() => setIsAdding(!isAdding)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Exam
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
                                <CardTitle className="text-lg">{editingId ? "Edit" : "Add"} Exam</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject</label>
                                        <Input
                                            placeholder="Subject name"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Exam Type</label>
                                        <select
                                            value={formData.examType}
                                            onChange={(e) => setFormData({ ...formData, examType: e.target.value as ExamType })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        >
                                            <option value="Mid-term">Mid-term</option>
                                            <option value="End-term">End-term</option>
                                            <option value="Quiz">Quiz</option>
                                            <option value="Practical">Practical</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Date & Time</label>
                                        <Input
                                            type="datetime-local"
                                            value={formData.dateTime}
                                            onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={editingId ? updateExam : addExam}>
                                        {editingId ? "Update" : "Add"} Exam
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

            <div className="grid md:grid-cols-2 gap-6">
                <AnimatePresence>
                    {upcomingExams.length === 0 ? (
                        <Card className="md:col-span-2">
                            <CardContent className="py-12 text-center text-muted-foreground">
                                No upcoming exams. Add one to start tracking!
                            </CardContent>
                        </Card>
                    ) : (
                        upcomingExams.map((exam) => {
                            const timeRemaining = calculateTimeRemaining(exam.dateTime);
                            if (!timeRemaining) return null;

                            return (
                                <motion.div
                                    key={exam.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <Card className="relative overflow-hidden">
                                        <div className={`absolute top-0 left-0 right-0 h-1 ${getExamTypeColor(exam.examType)}`} />
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-xl">{exam.subject}</CardTitle>
                                                    <div className="flex gap-2">
                                                        <Badge className={getExamTypeColor(exam.examType)}>
                                                            {exam.examType}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => startEdit(exam)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => deleteExam(exam.id)}
                                                        className="text-destructive hover:text-destructive/90"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(exam.dateTime).toLocaleString()}
                                            </div>

                                            <div className="grid grid-cols-4 gap-2">
                                                <div className="text-center p-3 bg-primary/5 rounded-lg">
                                                    <div className="text-2xl font-bold text-primary">{timeRemaining.days}</div>
                                                    <div className="text-xs text-muted-foreground">Days</div>
                                                </div>
                                                <div className="text-center p-3 bg-primary/5 rounded-lg">
                                                    <div className="text-2xl font-bold text-primary">{timeRemaining.hours}</div>
                                                    <div className="text-xs text-muted-foreground">Hours</div>
                                                </div>
                                                <div className="text-center p-3 bg-primary/5 rounded-lg">
                                                    <div className="text-2xl font-bold text-primary">{timeRemaining.minutes}</div>
                                                    <div className="text-xs text-muted-foreground">Mins</div>
                                                </div>
                                                <div className="text-center p-3 bg-primary/5 rounded-lg">
                                                    <div className="text-2xl font-bold text-primary">{timeRemaining.seconds}</div>
                                                    <div className="text-xs text-muted-foreground">Secs</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
