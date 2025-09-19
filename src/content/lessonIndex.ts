import type { Goal } from "@/lib/profile";
import { travel01 } from "./lessons/travel01";
import { everyday01 } from "./lessons/everyday01";

export type Lesson = {
  id: string;
  title: string;
  passage: string;
  mcq: { q: string; choices: string[]; answer: number };
  cloze: { text: string; answers: string[] };
  shortAnswer: { q: string; keywords: string[] };
};

export const lessonsByGoal: Record<Goal, Lesson[]> = {
  everyday: [everyday01],
  travel: [travel01],
  work: [travel01],
  exams: [travel01],
};

export function pickLesson(goal: Goal): Lesson {
  const arr = lessonsByGoal[goal] ?? [everyday01];
  return arr[0];
}
