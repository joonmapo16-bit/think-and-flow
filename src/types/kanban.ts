export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  subtasks: Subtask[];
  labels: string[];
  createdAt: string;
  order: number;
}

export interface Column {
  id: string;
  title: string;
  color: string;
}

export type BoardData = {
  columns: Column[];
  tasks: Task[];
};

export const DEFAULT_COLUMNS: Column[] = [
  { id: "todo", title: "To Do", color: "hsl(24, 95%, 53%)" },
  { id: "in-progress", title: "In Progress", color: "hsl(262, 83%, 58%)" },
  { id: "done", title: "Done", color: "hsl(142, 71%, 45%)" },
];

export const SAMPLE_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Visual concept",
    description: "We form the main visual idea from the position of animation",
    columnId: "todo",
    priority: "high",
    labels: ["MOTION DESIGN"],
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    subtasks: [
      { id: "s1", title: "Create moodboard", completed: true },
      { id: "s2", title: "Sketch wireframes", completed: true },
      { id: "s3", title: "Define color palette", completed: false },
    ],
    createdAt: new Date().toISOString(),
    order: 0,
  },
  {
    id: "task-2",
    title: "Component library",
    description: "Build reusable UI component system for the design team",
    columnId: "in-progress",
    priority: "medium",
    labels: ["UI/UX DESIGN"],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    subtasks: [
      { id: "s4", title: "Button variants", completed: true },
      { id: "s5", title: "Input fields", completed: true },
      { id: "s6", title: "Modal system", completed: false },
      { id: "s7", title: "Navigation", completed: false },
      { id: "s8", title: "Cards", completed: false },
      { id: "s9", title: "Tables", completed: false },
    ],
    createdAt: new Date().toISOString(),
    order: 0,
  },
  {
    id: "task-3",
    title: "Structure of business processes",
    description: "Document describes all external factors influencing the product",
    columnId: "done",
    priority: "low",
    labels: ["RESEARCH"],
    subtasks: [],
    createdAt: new Date().toISOString(),
    order: 0,
  },
  {
    id: "task-4",
    title: "UX Audit",
    description: "Complete audit of current user experience flows",
    columnId: "todo",
    priority: "high",
    labels: ["RESEARCH"],
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    subtasks: [
      { id: "s10", title: "Heuristic evaluation", completed: true },
      { id: "s11", title: "User interviews", completed: true },
      { id: "s12", title: "Competitive analysis", completed: true },
      { id: "s13", title: "Report findings", completed: false },
      { id: "s14", title: "Prioritize issues", completed: false },
      { id: "s15", title: "Create roadmap", completed: false },
      { id: "s16", title: "Present to stakeholders", completed: false },
    ],
    createdAt: new Date().toISOString(),
    order: 1,
  },
  {
    id: "task-5",
    title: "Online payment module",
    description: "Integrate payment gateway and test checkout flow",
    columnId: "in-progress",
    priority: "high",
    labels: ["DEVELOPMENT"],
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    subtasks: [
      { id: "s17", title: "API integration", completed: true },
      { id: "s18", title: "Frontend form", completed: false },
      { id: "s19", title: "Error handling", completed: false },
    ],
    createdAt: new Date().toISOString(),
    order: 1,
  },
];
