import React, { createContext, useContext, useState, useCallback } from "react";
import { getCheckins, getHabits, getProfile } from "@/lib/data/api";
import { Habit } from "@/lib/types";

export interface Profile {
  id: number;
  created_at: string;
}

interface AppContextType {
  profile: Profile | null;
  habits: Habit[];
  checkins: Record<number, Record<string, number>>;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  setProfile: (profile: Profile | null) => void;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setCheckins: React.Dispatch<
    React.SetStateAction<Record<number, Record<string, number>>>
  >;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<
    Record<number, Record<string, number>>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const p = (await getProfile()) as Profile | null;
      setProfile(p);

      const allHabits = await getHabits();
      setHabits(allHabits);

      const allCheckins = await getCheckins();
      const checkinMap: Record<number, Record<string, number>> = {};
      allCheckins.forEach((row) => {
        if (!checkinMap[row.habit_id]) {
          checkinMap[row.habit_id] = {};
        }
        checkinMap[row.habit_id][row.checkin_date] = 1;
      });
      setCheckins(checkinMap);
    } catch (error) {
      console.error("Failed to load app data in AppProvider", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        profile,
        habits,
        checkins,
        isLoading,
        refreshData,
        setProfile,
        setHabits,
        setCheckins,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
