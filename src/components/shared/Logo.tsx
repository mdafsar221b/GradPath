import { BookOpen } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-xl text-primary">
      <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
        <BookOpen size={20} strokeWidth={2.5} />
      </div>
      <span>GradPath</span>
    </div>
  );
}
