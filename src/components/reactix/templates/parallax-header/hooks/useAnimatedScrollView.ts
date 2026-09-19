import { useMemo } from "react";
import { Animated } from "react-native";

export const useAnimateScrollView = (
  imageHeight: number,
  disableScale?: boolean,
  customScroll?: Animated.Value,
) => {
  const scroll = useMemo(
    () => customScroll || new Animated.Value(0),
    [customScroll],
  );

  const scale = useMemo(
    () =>
      scroll.interpolate({
        inputRange: [-imageHeight, 0, imageHeight],
        outputRange: [2.5, 1, 1],
        extrapolate: "clamp",
      }),
    [scroll, imageHeight],
  );

  const translateYDown = useMemo(
    () =>
      scroll.interpolate({
        inputRange: [-imageHeight, 0, imageHeight],
        outputRange: [-imageHeight * 0.6, 0, imageHeight * 0.5],
        extrapolate: "clamp",
      }),
    [scroll, imageHeight],
  );

  const translateYUp = useMemo(
    () =>
      scroll.interpolate({
        inputRange: [-imageHeight, 0, imageHeight],
        outputRange: [imageHeight * 0.3, 0, 0],
        extrapolate: "clamp",
      }),
    [scroll, imageHeight],
  );

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scroll } } }], {
        useNativeDriver: true,
      }),
    [scroll],
  );

  return [
    scroll,
    onScroll,
    disableScale ? 1 : scale,
    translateYDown,
    translateYUp,
  ] as const;
};
