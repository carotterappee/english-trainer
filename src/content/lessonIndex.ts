import type { Goal } from "@/lib/profile";
import { travel01 } from "./lessons/travel01";
import { everyday01 } from "./lessons/everyday01";

export const lessonsByGoal: Record<Goal, any[]> = {
  everyday: [everyday01],
  travel: [travel01],
  work: [travel01],   // provisoire
  exams: [travel01],  // provisoire
};

export function pickLesson(goal: Goal) {
  const arr = lessonsByGoal[goal] ?? [travel01];
  return arr[0]; // première leçon du thème
}
