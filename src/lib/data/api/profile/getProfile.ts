import { getDb } from "@/lib/data/db";

export async function getProfile() {
  const db = await getDb();

  return await db.getFirstAsync("SELECT * FROM profile LIMIT 1");
}
