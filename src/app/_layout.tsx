import { Stack, usePathname, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useEffect, useState } from "react";
import { initializeDatabase } from "@/lib/data/db";
import {
  PlusJakartaSans_200ExtraLight,
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/lib/config/colors";
import { fonts } from "@/lib/config/constants";
import { AppProvider, useApp } from "@/lib/store";

void SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, refreshData, isLoading: isAppDataLoading } = useApp();
  const [databaseReady, setDatabaseReady] = useState(false);
  const [isMinLoadingTimeComplete, setIsMinLoadingTimeComplete] =
    useState(false);
  const [fontLoaded, error] = useFonts({
    PlusJakartaSans_200ExtraLight,
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await initializeDatabase();
      } catch (error) {
        console.error("Failed to initialize the database.", error);
      } finally {
        if (!cancelled) {
          setDatabaseReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const startupReady = databaseReady && (fontLoaded || !!error);

  useEffect(() => {
    if (!startupReady) {
      return;
    }
    void refreshData();
  }, [startupReady, refreshData]);

  useEffect(() => {
    if (!startupReady) {
      return;
    }

    const timer = setTimeout(() => {
      setIsMinLoadingTimeComplete(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [startupReady]);

  useEffect(() => {
    if (
      !startupReady ||
      isAppDataLoading ||
      !isMinLoadingTimeComplete ||
      pathname !== "/"
    ) {
      return;
    }

    if (profile) {
      router.replace("/(tabs)");
    } else {
      router.replace("/onboarding");
    }
  }, [
    pathname,
    startupReady,
    isAppDataLoading,
    isMinLoadingTimeComplete,
    profile,
    router,
  ]);

  useEffect(() => {
    if (!startupReady) {
      return;
    }

    void SplashScreen.hideAsync();
  }, [pathname, startupReady]);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, []);

  if (!startupReady) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: true,
            headerTitleStyle: {
              fontFamily: fonts.semiBold,
            },
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <SafeAreaProvider>
          <RootLayoutContent />
        </SafeAreaProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
