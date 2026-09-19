import type { ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

interface Tab {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: number;
}

interface AnimationConfig {
  readonly damping: number;
  readonly stiffness: number;
  readonly mass?: number;
}

type ShadowStyle = Pick<
  ViewStyle,
  | "shadowColor"
  | "shadowOffset"
  | "shadowOpacity"
  | "shadowRadius"
  | "elevation"
>;

interface CurvedBottomTabsProps {
  tabs: Tab[];
  currentIndex: number;
  onPress: (index: number, tab: Tab) => void;

  readonly barGradient?: string[];
  readonly buttonGradient?: string[];
  readonly barHeight?: number;
  readonly buttonScale?: number;
  readonly activeColor?: string;
  readonly inactiveColor?: string;
  readonly labelColor?: string;
  readonly badgeColor?: string;
  readonly badgeTextColor?: string;
  readonly textSize?: number;
  readonly fontFamily?: string;
  readonly hideWhenKeyboardShown?: boolean;
  readonly animation?: AnimationConfig;
  readonly shadow?: ShadowStyle;
}

interface FloatingButtonComponentProps {
  icon: React.ReactNode;
  readonly buttonGradient: readonly [string, string];
  scale: number;
  shadow: ShadowStyle;
  badge?: number;
  badgeColor: string;
  badgeTextColor: string;
}

interface BackgroundCurveProps {
  position: SharedValue<number>;
  barGradient: readonly [string, string];
  height: number;
}

interface StyleConfig {
  barHeight: number;
  textSize: number;
  readonly fontFamily?: string;
  readonly inactiveColor: string;
  readonly labelColor: string;
  readonly badgeColor: string;
  readonly badgeTextColor: string;
}

type GradientTuple = readonly [string, string];

interface NavigationState {
  index: number;
  routes: {
    key: string;
    name: string;
    params?: object;
  }[];
}

interface NavigationDescriptor {
  options: {
    tabBarLabel?: string | ((props: any) => React.ReactNode);
    title?: string;
    tabBarIcon?: (props: {
      focused: boolean;
      color: string;
      size: number;
    }) => React.ReactNode;
    tabBarBadge?: string | number;
  };
}
interface CurvedTabBarNavigationProps {
  barGradient?: string[];
  buttonGradient?: string[];
  activeColor?: string;
  inactiveColor?: string;
  labelColor?: string;
}

export type {
  Tab,
  AnimationConfig,
  ShadowStyle,
  CurvedBottomTabsProps,
  FloatingButtonComponentProps,
  BackgroundCurveProps,
  StyleConfig,
  GradientTuple,
  NavigationState,
  NavigationDescriptor,
  CurvedTabBarNavigationProps,
};
