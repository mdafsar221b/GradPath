export interface ImportantLink {
  name: string;
  link: string;
  icon?: string; // Optional icon name from lucide-react
}

export const ImportantLinksData: ImportantLink[] = [
  {
    name: "DDU University Portal",
    link: "https://www.ddugorakhpuruniversity.in/",
    icon: "University",
  },
  {
    name: "Result Check",
    link: "https://www.ddugorakhpuruniversity.in/student/results/",
    icon: "ClipboardCheck",
  },
  {
    name: "Academic Calendar",
    link: "https://www.ddugorakhpuruniversity.in/academics/calendar/",
    icon: "CalendarCheck",
  },
  {
    name: "Online Courses (NPTEL)",
    link: "https://nptel.ac.in/",
    icon: "Video",
  },
  {
    name: "GitHub Student Developer Pack",
    link: "https://education.github.com/pack",
    icon: "Github",
  },
  {
    name: "Microsoft Learn",
    link: "https://learn.microsoft.com/en-us/",
    icon: "BrainCircuit",
  },
];