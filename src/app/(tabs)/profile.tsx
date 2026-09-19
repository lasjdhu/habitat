import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
  Animated,
  ScrollView,
} from "react-native";
import { ChipGroup } from "@/components/reactix/molecules/animated-chip/Chip";
import { HabitComponent } from "@/components/molecules";
import { AnimatedScrollView } from "@/components/reactix/templates/parallax-header/components/AnimatedScrollView";
import { colors, materials } from "@/lib/config/colors";
import {
  Settings,
  HeartPulse,
  Brain,
  Hammer,
  Flower2,
  Users,
} from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/lib/store";
import { AvatarScene } from "@/components/organisms";

const CATEGORIES = [
  {
    id: 1,
    keyPath: "health",
    name: "Health",
    color: materials.copper,
    activeTextColor: colors.white,
  },
  {
    id: 2,
    keyPath: "intelligence",
    name: "Intel",
    color: materials.ink,
    activeTextColor: colors.white,
  },
  {
    id: 3,
    keyPath: "craft",
    name: "Craft",
    color: materials.parts,
    activeTextColor: colors.white,
  },
  {
    id: 4,
    keyPath: "soul",
    name: "Soul",
    color: materials.dew,
    activeTextColor: colors.white,
  },
  {
    id: 5,
    keyPath: "social",
    name: "Social",
    color: materials.gold,
    activeTextColor: colors.text,
  },
];

export default function ProfileScreen() {
  const [activeIdx, setActiveIndex] = useState(0);
  const { profile, habits, checkins, isLoading } = useApp();

  const scroll = useMemo(() => new Animated.Value(0), []);

  const borderRadius = useMemo(
    () =>
      scroll.interpolate({
        inputRange: [0, 200],
        outputRange: [48, 0],
        extrapolate: "clamp",
      }),
    [scroll],
  );

  const headerOverlayOpacity = useMemo(
    () =>
      scroll.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0],
        extrapolate: "clamp",
      }),
    [scroll],
  );

  const headerOverlayTranslateY = useMemo(
    () =>
      scroll.interpolate({
        inputRange: [0, 200],
        outputRange: [0, -200],
        extrapolate: "clamp",
      }),
    [scroll],
  );

  const chips = useMemo(
    () => [
      {
        label: "Health",
        icon: () => (
          <HeartPulse
            color={activeIdx === 0 ? colors.white : materials.copper}
            size={20}
          />
        ),
        activeColor: materials.copper,
        labelColor: colors.white,
        inActiveBackgroundColor: colors.background,
      },
      {
        label: "Brain",
        icon: () => (
          <Brain
            color={activeIdx === 1 ? colors.white : materials.ink}
            size={20}
          />
        ),
        activeColor: materials.ink,
        labelColor: colors.white,
        inActiveBackgroundColor: colors.background,
      },
      {
        label: "Craft",
        icon: () => (
          <Hammer
            color={activeIdx === 2 ? colors.white : materials.parts}
            size={20}
          />
        ),
        activeColor: materials.parts,
        labelColor: colors.white,
        inActiveBackgroundColor: colors.background,
      },
      {
        label: "Soul",
        icon: () => (
          <Flower2
            color={activeIdx === 3 ? colors.white : materials.dew}
            size={20}
          />
        ),
        activeColor: materials.dew,
        labelColor: colors.white,
        inActiveBackgroundColor: colors.background,
      },
      {
        label: "Social",
        icon: () => (
          <Users
            color={activeIdx === 4 ? colors.white : materials.gold}
            size={20}
          />
        ),
        activeColor: materials.gold,
        labelColor: colors.white,
        inActiveBackgroundColor: colors.background,
      },
    ],
    [activeIdx],
  );

  const handleTabChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const regYear = useMemo(() => {
    if (profile?.created_at) {
      const regDate = new Date(profile.created_at.replace(" ", "T"));
      if (!isNaN(regDate.getTime())) {
        return regDate.getFullYear();
      }
    }
    return new Date().getFullYear();
  }, [profile]);

  const activeCategory = CATEGORIES[activeIdx];

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <AnimatedScrollView
          scroll={scroll}
          headerMaxHeight={200}
          topBarHeight={0}
          renderHeaderComponent={() => (
            <View
              style={{
                flex: 1,
                width: "100%",
                height: 200,
              }}
            >
              <AvatarScene />
            </View>
          )}
          stickyHeaderIndices={[1]}
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: colors.background,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              backgroundColor: colors.surface,
              borderRadius,
              paddingVertical: 12,
              shadowColor: colors.text,
              shadowOffset: { width: 0, height: -6 },
              shadowOpacity: 0.03,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12 }}
            >
              <ChipGroup
                chips={chips}
                selectedIndex={activeIdx}
                onChange={handleTabChange}
              />
            </ScrollView>
          </Animated.View>
          <View style={styles.contentScrollContent}>
            {CATEGORIES.map((category) => (
              <View
                key={category.id}
                style={{
                  display: category.id === activeCategory.id ? "flex" : "none",
                }}
              >
                <HabitComponent
                  categoryId={category.id}
                  color={category.color}
                  habits={habits}
                  checkins={checkins}
                  regYear={regYear}
                />
              </View>
            ))}
          </View>
        </AnimatedScrollView>
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.headerOverlay,
            {
              opacity: headerOverlayOpacity,
              transform: [{ translateY: headerOverlayTranslateY }],
            },
          ]}
        >
          <Pressable
            onPress={() => router.push("/settings")}
            style={styles.settingsButton}
          >
            <Settings color={colors.text} size={22} />
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: 200,
    zIndex: 20,
  },
  settingsButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  tabbarContainerStyle: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  contentScroll: {
    flex: 1,
  },
  contentScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
});
