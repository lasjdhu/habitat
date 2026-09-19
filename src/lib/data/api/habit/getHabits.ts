import { getDb } from "@/lib/data/db";
import { Habit } from "@/lib/types";

export async function getHabits(): Promise<Habit[]> {
  const db = await getDb();
  return await db.getAllAsync<Habit>("SELECT * FROM habit");
}
