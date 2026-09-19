import { getDb } from "@/lib/data/db";

export async function getCheckins(): Promise<
  { habit_id: number; checkin_date: string }[]
> {
  const db = await getDb();
  return await db.getAllAsync<{ habit_id: number; checkin_date: string }>(
    "SELECT habit_id, checkin_date FROM habit_checkin",
  );
}
