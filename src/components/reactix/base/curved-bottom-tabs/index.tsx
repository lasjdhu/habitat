import React, { memo, useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  makeMutable,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Stop,
} from "react-native-svg";
import { colors } from "@/lib/config/colors";
import type {
  BackgroundCurveProps,
  CurvedBottomTabsProps,
  FloatingButtonComponentProps,
  StyleConfig,
  Tab,
  CurvedTabBarNavigationProps,
} from "./types";
import {
  calculateTabPosition,
  processGradient,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from "./helper";
import { AppText } from "@/components/atoms";

interface BottomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  insets?: any;
}

const FloatingButtonComponent: React.FC<FloatingButtonComponentProps> =
  memo<FloatingButtonComponentProps>(
    ({
      icon,
      buttonGradient,
      scale,
      shadow,
      badge,
      badgeColor,
      badgeTextColor,
    }: FloatingButtonComponentProps) => {
      const buttonSize: number = VIEWPORT_HEIGHT * scale;

      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            ...shadow,
          }}
        >
          <Svg width={buttonSize} height={buttonSize}>
            <Defs>
              <SvgGradient
                id="floatingButtonGradient"
                x1="0%"
                y1="25%"
                x2="80%"
                y2="100%"
              >
                <Stop offset="0%" stopColor={buttonGradient[0]} />
                <Stop offset="100%" stopColor={buttonGradient[1]} />
              </SvgGradient>
            </Defs>
            <Circle
              cx={buttonSize / 2}
              cy={buttonSize / 2}
              r={buttonSize / 2.2}
              fill="url(#floatingButtonGradient)"
            />
          </Svg>
          <View
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              width: buttonSize,
              height: buttonSize,
            }}
          >
            {icon}
          </View>
          {badge !== undefined && badge > 0 && (
            <View
              style={{
                position: "absolute",
                top: -5,
                right: -10,
                backgroundColor: badgeColor,
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 4,
              }}
            >
              <AppText
                style={{
                  color: badgeTextColor,
                  fontSize: 10,
                  fontFamily: "PlusJakartaSans_600SemiBold",
                }}
              >
                {badge > 99 ? "99+" : badge.toString()}
              </AppText>
            </View>
          )}
        </View>
      );
    },
  );
FloatingButtonComponent.displayName = "FloatingButtonComponent";

const BackgroundCurve: React.FC<BackgroundCurveProps> =
  memo<BackgroundCurveProps>(
    ({ position, barGradient, height }: BackgroundCurveProps) => {
      const screenWidth = Math.ceil(VIEWPORT_WIDTH * 100);
      const totalWidth = screenWidth * 3;
      const centerOffset = screenWidth;
      const origWidth = 394;
      const origHeight = 86;

      const curveWidth = screenWidth;
      const leftEdge = (133 / origWidth) * curveWidth;
      const rightEdge = (258 / origWidth) * curveWidth;
      const center = (197 / origWidth) * curveWidth;
      const notchHeight = (43.5 / origHeight) * height;
      const leftControl1 = (159.724 / origWidth) * curveWidth;
      const leftControl2 = (172.684 / origWidth) * curveWidth;
      const rightControl1 = (220.932 / origWidth) * curveWidth;
      const rightControl2 = (235.992 / origWidth) * curveWidth;

      const path = `
    M0 0
    L${centerOffset} 0
    C${centerOffset} 0 ${centerOffset + leftEdge * 0.8} 0 ${
      centerOffset + leftEdge
    } 0
    C${centerOffset + leftControl1} 0 ${
      centerOffset + leftControl2
    } ${notchHeight} ${centerOffset + center} ${notchHeight}
    C${centerOffset + rightControl1} ${notchHeight * 0.99} ${
      centerOffset + rightControl2
    } 0 ${centerOffset + rightEdge} 0
    C${centerOffset + rightEdge + (curveWidth - rightEdge) * 0.1} 0 ${
      centerOffset + curveWidth
    } 0 ${centerOffset + curveWidth} 0
    L${totalWidth} 0
    V${height}
    H0
    V0
    Z
  `;

      const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
        transform: [{ translateX: position.value }],
      }));

      return (
        <View style={{ overflow: "hidden", width: screenWidth }}>
          <Animated.View style={animatedStyle}>
            <Svg
              width={totalWidth}
              height={height}
              preserveAspectRatio="none"
              viewBox={`0 -1 ${totalWidth} ${height + 1}`}
              fill="none"
            >
              <Path d={path} fill="url(#curveGradient)" />
              <Defs>
                <SvgGradient
                  id="curveGradient"
                  x1={0}
                  y1={height * 0.8}
                  x2={totalWidth}
                  y2={height * 0.8}
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop offset={0.0576923} stopColor={barGradient[0]} />
                  <Stop offset={0.903846} stopColor={barGradient[1]} />
                </SvgGradient>
              </Defs>
            </Svg>
          </Animated.View>
        </View>
      );
    },
  );
BackgroundCurve.displayName = "BackgroundCurve";

interface CurvedTabItemProps {
  tab: Tab;
  isActive: boolean;
  labelColor: string;
  badgeColor: string;
  badgeTextColor: string;
  buttonScale: number;
  buttonGradient: readonly [string, string];
  shadow: NonNullable<CurvedBottomTabsProps["shadow"]>;
  animationValue: SharedValue<number>;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}

const CurvedTabItem = memo(
  ({
    tab,
    isActive,
    labelColor,
    badgeColor,
    badgeTextColor,
    buttonScale,
    buttonGradient,
    shadow,
    animationValue,
    onPress,
    styles,
  }: CurvedTabItemProps) => {
    const animatedTabStyle = useAnimatedStyle<ViewStyle>(() => ({
      transform: [{ translateY: animationValue.value }],
    }));

    return (
      <Animated.View style={[styles.tabWrapper, animatedTabStyle]}>
        <TouchableOpacity
          onPress={onPress}
          style={styles.tabTouchable}
          activeOpacity={0.9}
        >
          {isActive ? (
            <FloatingButtonComponent
              icon={tab.icon}
              buttonGradient={buttonGradient}
              scale={buttonScale}
              shadow={shadow}
              badge={tab.badge}
              badgeColor={badgeColor}
              badgeTextColor={badgeTextColor}
            />
          ) : (
            <>
              <View style={styles.iconWrapper}>
                {tab.icon}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <View
                    style={[
                      styles.badgeContainer,
                      { backgroundColor: badgeColor },
                    ]}
                  >
                    <AppText
                      style={[styles.badgeLabel, { color: badgeTextColor }]}
                    >
                      {tab.badge > 99 ? "99+" : tab.badge.toString()}
                    </AppText>
                  </View>
                )}
              </View>
              <AppText style={[styles.tabLabel, { color: labelColor }]}>
                {tab.title}
              </AppText>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  },
);
CurvedTabItem.displayName = "CurvedTabItem";

const CurvedBottomTabsCore: React.FC<CurvedBottomTabsProps> =
  memo<CurvedBottomTabsProps>(
    ({
      tabs,
      currentIndex,
      onPress,
      barGradient = [colors.surface, colors.surface],
      buttonGradient = [colors.primary, colors.secondary],
      barHeight = 9,
      buttonScale = 6,
      inactiveColor = colors.textMuted,
      labelColor = colors.textMuted,
      badgeColor = colors.danger,
      badgeTextColor = colors.white,
      textSize = 12,
      fontFamily,
      hideWhenKeyboardShown = false,
      animation = { damping: 12, stiffness: 120, mass: 0.5 },
      shadow = {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 8,
      },
    }: CurvedBottomTabsProps) => {
      const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

      const curvePosition = useSharedValue<number>(0);
      const tabCount = tabs.length;
      const floatingAnimations = useMemo(
        () => Array.from({ length: tabCount }, () => makeMutable<number>(0)),
        [tabCount],
      );

      const processedBarGradient = processGradient<string[]>(barGradient);
      const processedButtonGradient = processGradient<string[]>(buttonGradient);

      useEffect(() => {
        if (!hideWhenKeyboardShown) return;

        const showListener = Keyboard.addListener("keyboardDidShow", () => {
          setKeyboardVisible(true);
        });
        const hideListener = Keyboard.addListener("keyboardDidHide", () => {
          setKeyboardVisible(false);
        });

        return () => {
          showListener.remove();
          hideListener.remove();
        };
      }, [hideWhenKeyboardShown]);

      useEffect(() => {
        const targetPosition = calculateTabPosition<number, number>(
          currentIndex,
          tabs.length,
        );

        curvePosition.value = withSpring<number>(targetPosition, {
          damping: animation.damping,
          stiffness: animation.stiffness,
          mass: animation.mass,
        });

        floatingAnimations.forEach(
          (anim: SharedValue<number>, index: number) => {
            anim.value = withSpring<number>(
              index === currentIndex ? -VIEWPORT_HEIGHT * 4.2 : 0,
              {
                damping: 10,
                stiffness: 100,
                mass: 0.5,
              },
            );
          },
        );
      }, [
        animation.damping,
        animation.mass,
        animation.stiffness,
        currentIndex,
        curvePosition,
        floatingAnimations,
        tabs.length,
      ]);

      const styles = createStyles<StyleConfig>({
        barHeight,
        textSize,
        fontFamily,
        inactiveColor,
        labelColor,
        badgeColor,
        badgeTextColor,
      });

      if (hideWhenKeyboardShown && keyboardVisible) {
        return null;
      }

      return (
        <View style={styles.wrapper}>
          <View style={styles.backgroundContainer}>
            <BackgroundCurve
              position={curvePosition}
              barGradient={processedBarGradient}
              height={Math.ceil(VIEWPORT_HEIGHT * barHeight)}
            />
          </View>

          {tabs.map((tab, index) => {
            return (
              <CurvedTabItem
                key={tab.id}
                tab={tab}
                isActive={currentIndex === index}
                labelColor={labelColor}
                badgeColor={badgeColor}
                badgeTextColor={badgeTextColor}
                buttonScale={buttonScale}
                buttonGradient={processedButtonGradient}
                shadow={shadow}
                animationValue={floatingAnimations[index]}
                onPress={() => {
                  onPress(index, tab);
                }}
                styles={styles}
              />
            );
          })}
        </View>
      );
    },
  );
CurvedBottomTabsCore.displayName = "CurvedBottomTabsCore";

const createStyles = <T extends StyleConfig>({
  barHeight,
  textSize,
  fontFamily,
  ...props
}: T) =>
  StyleSheet.create({
    wrapper: {
      position: "absolute",
      bottom: 0,
      alignSelf: "center",
      backgroundColor: "transparent",
      justifyContent: "space-between",
      height: Math.ceil(VIEWPORT_HEIGHT * barHeight),
      flexDirection: "row",
      width: "100%",
    },
    backgroundContainer: {
      position: "absolute",
      bottom: 0,
      zIndex: 20,
      width: "100%",
    },
    tabWrapper: {
      flex: 1,
      zIndex: 30,
    },
    tabTouchable: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      paddingBottom: Platform.OS === "ios" ? VIEWPORT_HEIGHT * 0.98 : 0,
    },
    tabLabel: {
      fontSize: textSize,
      fontFamily,
      textAlign: "center",
      marginTop: 5,
    },
    iconWrapper: {
      marginTop: 5,
      position: "relative",
    },
    badgeContainer: {
      position: "absolute",
      top: -5,
      right: -10,
      backgroundColor: colors.danger,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 4,
    },
    badgeLabel: {
      color: colors.white,
      fontSize: 10,
      fontFamily: "PlusJakartaSans_600SemiBold",
    },
  });

export const CurvedBottomTabs: React.FC<
  BottomTabBarProps & CurvedTabBarNavigationProps
> &
  React.FunctionComponent<BottomTabBarProps & CurvedTabBarNavigationProps> =
  memo(
    ({
      state,
      descriptors,
      navigation,
      barGradient = [colors.surface, colors.surface],
      buttonGradient = [colors.primary, colors.secondary],
      activeColor = colors.white,
      inactiveColor = colors.textMuted,
      labelColor = colors.textMuted,
    }) => {
      const tabs: Tab[] = state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isActive = state.index === index;

        return {
          id: route.key,
          title:
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name,
          icon: options?.tabBarIcon
            ? options.tabBarIcon({
                focused: isActive,
                color: isActive ? activeColor : inactiveColor,
                size: 24,
              })
            : null,
          badge:
            typeof options.tabBarBadge === "number"
              ? options.tabBarBadge
              : undefined,
        };
      });

      const handlePress = (index: number, tab: Tab): void => {
        const route = state.routes[index];

        const event = navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });

        if (state.index !== index && !event.defaultPrevented) {
          navigation.navigate(route.name, route.params);
        }
      };

      return (
        <CurvedBottomTabsCore
          tabs={tabs}
          currentIndex={state.index}
          onPress={handlePress}
          barGradient={barGradient}
          buttonGradient={buttonGradient}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
          labelColor={labelColor}
        />
      );
    },
  );
CurvedBottomTabs.displayName = "CurvedBottomTabs";
