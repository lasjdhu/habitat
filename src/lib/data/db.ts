import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "habitat";
const SCHEMA_SQL = `
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS profile (
    id            INTEGER PRIMARY KEY,
    name          TEXT NOT NULL CHECK(length(name) < 256),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS habit_type (
    id            INTEGER PRIMARY KEY,
    name          TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS habit (
    id            INTEGER PRIMARY KEY,
    profile_id    INTEGER NOT NULL,
    name          TEXT NOT NULL CHECK(length(name) < 256),
    type          INTEGER NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (profile_id)
      REFERENCES profile(id)
      ON DELETE CASCADE,

    FOREIGN KEY (type)
      REFERENCES habit_type(id)
  );

  CREATE TABLE IF NOT EXISTS habit_checkin (
    habit_id      INTEGER NOT NULL,
    checkin_date  DATE NOT NULL,

    PRIMARY KEY (habit_id, checkin_date),

    FOREIGN KEY (habit_id)
      REFERENCES habit(id)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS building (
    id            INTEGER PRIMARY KEY,
    habit_id      INTEGER NOT NULL UNIQUE,
    tier          INTEGER NOT NULL DEFAULT 1,
    grid_x        INTEGER NOT NULL,
    grid_y        INTEGER NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (habit_id)
      REFERENCES habit(id)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS xp_event (
    id            INTEGER PRIMARY KEY,
    profile_id    INTEGER NOT NULL,
    amount        INTEGER NOT NULL,
    source        TEXT NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (profile_id)
      REFERENCES profile(id)
      ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_habit_profile
    ON habit(profile_id);

  CREATE INDEX IF NOT EXISTS idx_habit_checkin_habit
    ON habit_checkin(habit_id);

  CREATE INDEX IF NOT EXISTS idx_xp_event_profile
    ON xp_event(profile_id);
`;
const SEED_SQL = `
  INSERT OR IGNORE INTO habit_type (id, name)
  VALUES
    (1, 'Health'),
    (2, 'Intelligence'),
    (3, 'Craft'),
    (4, 'Soul'),
    (5, 'Social');
`;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
let initializationPromise: Promise<void> | null = null;

async function createSchema(db: SQLite.SQLiteDatabase) {
  await db.execAsync(SCHEMA_SQL);
  await db.execAsync(SEED_SQL);
}

async function dropAllTables(db: SQLite.SQLiteDatabase) {
  await db.execAsync("PRAGMA foreign_keys = OFF;");
  await db.execAsync("DROP TABLE IF EXISTS xp_event;");
  await db.execAsync("DROP TABLE IF EXISTS building;");
  await db.execAsync("DROP TABLE IF EXISTS habit_checkin;");
  await db.execAsync("DROP TABLE IF EXISTS habit;");
  await db.execAsync("DROP TABLE IF EXISTS habit_type;");
  await db.execAsync("DROP TABLE IF EXISTS profile;");
  await db.execAsync("PRAGMA foreign_keys = ON;");
}

export function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return dbPromise;
}

export async function initializeDatabase() {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      const db = await getDb();

      await createSchema(db);
    })();
  }

  await initializationPromise;
}

export async function deleteAllData() {
  initializationPromise = null;
  const db = await getDb();

  await db.execAsync("PRAGMA wal_checkpoint(TRUNCATE);");
  await dropAllTables(db);
  await db.execAsync("VACUUM;");
  await createSchema(db);
}
