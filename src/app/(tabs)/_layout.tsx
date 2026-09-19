import { colors } from "@/lib/config/colors";
import { CurvedBottomTabs } from "@/components/reactix/base/curved-bottom-tabs";
import { Earth, User } from "lucide-react-native";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <CurvedBottomTabs
          {...props}
          barGradient={[colors.primary, colors.secondary]}
          buttonGradient={[colors.primary, colors.secondary]}
          activeColor={colors.white}
          inactiveColor={colors.white}
          labelColor={colors.white}
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "World",
          tabBarIcon: ({ color }) => <Earth color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}
