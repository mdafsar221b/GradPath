'use client';

export type StudentDashboardSection =
  | 'overview'
  | 'planner'
  | 'progress'
  | 'deadlines'
  | 'tools';

interface StudentDashboardTabsProps {
  activeSection: StudentDashboardSection;
  onSectionChange: (section: StudentDashboardSection) => void;
}

const sectionItems: { id: StudentDashboardSection; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'planner', label: 'Study Plan' },
  { id: 'progress', label: 'Progress' },
  { id: 'deadlines', label: 'Deadlines' },
  { id: 'tools', label: 'Tools' },
];

export const StudentDashboardSidebar = ({
  activeSection,
  onSectionChange,
}: StudentDashboardTabsProps) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-white p-2">
        {sectionItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
