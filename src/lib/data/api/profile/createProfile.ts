import { getDb } from "@/lib/data/db";

export async function createProfile(name: string) {
  const db = await getDb();
  const trimmedName = name.trim();
  const existingProfile = await db.getFirstAsync<{ id: number }>(
    "SELECT id FROM profile LIMIT 1",
  );

  if (existingProfile) {
    return await db.runAsync(
      "UPDATE profile SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      trimmedName,
      existingProfile.id,
    );
  }

  return await db.runAsync(
    "INSERT INTO profile (name) VALUES (?)",
    trimmedName,
  );
}
