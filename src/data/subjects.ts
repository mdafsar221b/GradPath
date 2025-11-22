
export interface ResourceItem {
  _id?: string;
  title: string;
  link: string;
  type: 'notes' | 'pyq' | 'youtube' | 'other' | 'link';
  year?: number;
  description?: string;
}

export interface Subject {
  name: string;
  code: string;
  PYQ: string;
  notes: string;
  resources?: ResourceItem[];
}

export interface YouTubeResource {
  title: string;
  channel: string;
  thumbnail: string;
  link: string;
}

export const semOneSub: Subject[] = [
  {
    name: " IT Tools and Applications ",
    code: "BCA-101",
    PYQ: "",
    notes: "https://drive.google.com/uc?export=download&id=1g-C61jiKTa73DxTZ7ZJnRMVtJULLeHKj",
  },
  {
    name: " Principles of Mathematics ",
    code: "BCA-102",
    PYQ: "",
    notes: "",
  },
  {
    name: "Functional English",
    code: "BCA-103",
    PYQ: "/assets/Resources/Semester1/English PYQ.pdf",
    notes: "",
  },
  {
    name: "Introduction to Computer Programming in ‘C’",
    code: "BCA-104",
    PYQ: "",
    notes: "https://drive.google.com/uc?export=download&id=1GBR5b6qbMwNZHdcEr2KaqPi-P1WFSHvC",
  },
];

export const semTwoSub: Subject[] = [
  {
    name: "Discrete Mathematics ",
    code: "BCA-201",
    PYQ: "/assets/Resources/Semester2/BCA_201_2022_merged.pdf",
    notes: "",
  },
  {
    name: " Accounting and Financial Management ",
    code: "BCA-202",
    PYQ: "/assets/Resources/Semester2/BCA 202 2022_merged.pdf",
    notes: "/assets/Resources/Semester2/financial management.pdf",
  },
  {
    name: " Digital Circuit and Logic Design",
    code: "BCA-203",
    PYQ: "/assets/Resources/Semester2/BCA_203_2022_merged.pdf",
    notes: "/assets/Resources/Semester2/DCLD notes.pdf.pdf",
  },
  {
    name: " Introductions to Object Oriented Programming & C++ ",
    code: "BCA-204",
    PYQ: "/assets/Resources/Semester2/BCA_204_2022_merged.pdf",
    notes:
      "https://drive.google.com/file/d/1NXtNY5zQXIUMLcBan-_MpuGN_gnZKTMh/view",
  },
];

export const semThreeSub: Subject[] = [
  {
    name: "Operating System",
    code: "BCA-301",
    PYQ: "/assets/Resources/Semester3/Operating System PYQ.pdf",
    notes: "/assets/Resources/Semester3/Handwritten-OS-notes.pdf",
  },
  {
    name: " Computer Oriented Mathematics",
    code: "BCA-302",
    PYQ: "/assets/Resources/Semester3/COM PYQ.pdf",
    notes: "",
  },
  {
    name: "Data Structure",
    code: "BCA-303",
    PYQ: "/assets/Resources/Semester3/DS PYQ.pdf",
    notes: "/assets/Resources/Semester3/DSA_Notes.pdf",
  },
  {
    name: " Computer Organization and Architecture ",
    code: "BCA-304",
    PYQ: "/assets/Resources/Semester3/COA PYQ.pdf",
    notes: "",
  },
];

export const semFourSub: Subject[] = [
  {
    name: "DBMS",
    code: "BCA-401",
    PYQ: "/assets/Resources/Semester4/BCA_401_2022-23_merged.pdf",
    notes: "https://drive.google.com/uc?export=download&id=1GBR5b6qbMwNZHdcEr2KaqPi-P1WFSHvC",
  },
  {
    name: " Operation Research",
    code: "BCA-402",
    PYQ: "/assets/Resources/Semester4/BCA_402_2022-23_merged.pdf",
    notes: "",
  },
  {
    name: " COMPUTER GRAPHICS",
    code: "BCA-403",
    PYQ: "/assets/Resources/Semester4/BCA_403_2022-23_merged.pdf",
    notes: "https://drive.com/uc?export=download&id=1GBR5b6qbMwNZHdcEr2KaqPi-P1WFSHvC",
  },
  {
    name: "Software Engineering ",
    code: "BCA-404",
    PYQ: "/assets/Resources/Semester4/BCA_404_2022-23_merged.pdf",
    notes:
      "https://drive.google.com/uc?export=download&id=1jdCtWM0GWKmeP7dEC872WVjOhw6Ro8V7",
  },
];

export const semFiveSub: Subject[] = [
  {
    name: " Internet and JAVA Programming ",
    code: "BCA-501",
    PYQ: "",
    notes: "",
  },
  {
    name: " ORACLE and PL/SQL",
    code: "BCA-502",
    PYQ: "",
    notes: "",
  },
  {
    name: "COMPUTER NETWORKS",
    code: "BCA-503",
    PYQ: "",
    notes: "https://shorturl.at/1EIUf",
  },
  {
    name: "Software Project Management",
    code: "BCA-504",
    PYQ: "",
    notes: "",
  },
];

export const semSixSub: Subject[] = [
  {
    name: " Advance Networks and Network Security ",
    code: "BCA-601",
    PYQ: "",
    notes: "",
  },
  {
    name: " Web Development Tools and Techniques ",
    code: "BCA-602",
    PYQ: "",
    notes: "",
  },
];

export const allSemesters = [
  semOneSub,
  semTwoSub,
  semThreeSub,
  semFourSub,
  semFiveSub,
  semSixSub
];