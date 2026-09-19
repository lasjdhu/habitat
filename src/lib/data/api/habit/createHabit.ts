import { getDb } from "@/lib/data/db";

export async function createHabit(
  profileId: number,
  name: string,
  categoryId: number,
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    "INSERT INTO habit (profile_id, name, type) VALUES (?, ?, ?)",
    [profileId, name, categoryId],
  );
}
