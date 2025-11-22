"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StudySession {
    id: string;
    subject: string;
    topic: string;
    day: string;
    timeSlot: string;
    duration: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = [
    "06:00 - 08:00",
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00",
    "20:00 - 22:00",
];

export default function StudyPlanner() {
    const [sessions, setSessions] = useState<StudySession[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    const [formData, setFormData] = useState<Omit<StudySession, "id">>({
        subject: "",
        topic: "",
        day: "Monday",
        timeSlot: "08:00 - 10:00",
        duration: "2 hours",
    });

    useEffect(() => {
        const saved = localStorage.getItem("gradpath_study_plan");
        if (saved) {
            setSessions(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("gradpath_study_plan", JSON.stringify(sessions));
    }, [sessions]);

    const addSession = () => {
        if (!formData.subject || !formData.topic) return;

        const newSession: StudySession = {
            ...formData,
            id: Date.now().toString(),
        };

        setSessions([...sessions, newSession]);
        resetForm();
    };

    const deleteSession = (id: string) => {
        setSessions(sessions.filter((s) => s.id !== id));
    };

    const resetForm = () => {
        setFormData({
            subject: "",
            topic: "",
            day: "Monday",
            timeSlot: "08:00 - 10:00",
            duration: "2 hours",
        });
        setIsAdding(false);
    };

    const getSessionsForDay = (day: string) => {
        return sessions.filter((s) => s.day === day);
    };

    const getSubjectColor = (subject: string) => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-orange-500",
            "bg-pink-500",
            "bg-teal-500",
        ];
        const index = subject.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-end">
                <Button onClick={() => setIsAdding(!isAdding)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Study Session
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
                                <CardTitle className="text-lg">Add Study Session</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject</label>
                                        <Input
                                            placeholder="e.g. Mathematics"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Topic</label>
                                        <Input
                                            placeholder="e.g. Calculus"
                                            value={formData.topic}
                                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Day</label>
                                        <select
                                            value={formData.day}
                                            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        >
                                            {DAYS.map((day) => (
                                                <option key={day} value={day}>
                                                    {day}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Time Slot</label>
                                        <select
                                            value={formData.timeSlot}
                                            onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        >
                                            {TIME_SLOTS.map((slot) => (
                                                <option key={slot} value={slot}>
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Duration</label>
                                        <Input
                                            placeholder="e.g. 2 hours"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={addSession}>Add Session</Button>
                                    <Button variant="outline" onClick={resetForm}>
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {DAYS.map((day) => {
                    const daySessions = getSessionsForDay(day);
                    return (
                        <Card key={day}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">{day}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {daySessions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">No sessions</p>
                                ) : (
                                    daySessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className={`${getSubjectColor(session.subject)} text-white p-3 rounded-lg relative group`}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteSession(session.id)}
                                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/20"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                            <div className="flex items-start gap-2 mb-1">
                                                <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm truncate">{session.subject}</p>
                                                    <p className="text-xs opacity-90 truncate">{session.topic}</p>
                                                </div>
                                            </div>
                                            <p className="text-xs opacity-75 mt-2">{session.timeSlot}</p>
                                            <p className="text-xs opacity-75">{session.duration}</p>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
