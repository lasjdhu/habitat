import { getDb } from "@/lib/data/db";

export async function deleteHabit(habitId: number): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM habit WHERE id = ?", [habitId]);
}
