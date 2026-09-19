import React, { useState, useEffect, memo, useRef, forwardRef } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TextStyle,
  StyleProp,
  Pressable,
} from "react-native";
import type { TextInput as TextInputType } from "react-native";
import Animated, {
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { ICharacter, IAnimatedInput } from "./types";

const Character: React.FC<ICharacter> & React.FunctionComponent<ICharacter> = ({
  char,
  index,
  enterDuration,
  exitDuration,
  delayIncrement,
  style,
}: ICharacter) => {
  const animationDelay = index * delayIncrement;

  const enteringAnimation = () => {
    "worklet";

    return {
      initialValues: {
        opacity: 0,
        transform: [{ translateY: 20 }, { scale: 0.5 }],
      },
      animations: {
        opacity: withDelay<number>(
          animationDelay,
          withTiming<number>(1, { duration: enterDuration }),
        ),
        transform: [
          {
            translateY: withDelay<number>(
              animationDelay,
              withSpring<number>(0, {
                damping: 15,
                stiffness: 150,
                mass: 0.9,
              }),
            ),
          },
          {
            scale: withDelay<number>(
              animationDelay,
              withSpring<number>(1, {
                damping: 15,
                stiffness: 150,
                mass: 0.9,
              }),
            ),
          },
        ],
      },
    };
  };

  const exitingAnimation = () => {
    "worklet";

    return {
      initialValues: {
        opacity: 1,
        transform: [{ translateY: 0 }, { scale: 1 }],
      },
      animations: {
        opacity: withDelay(
          animationDelay,
          withTiming(0, { duration: exitDuration }),
        ),
        transform: [
          {
            translateY: withDelay<number>(
              animationDelay,
              withTiming<number>(-5, { duration: exitDuration }),
            ),
          },
          {
            scale: withDelay<number>(
              animationDelay,
              withTiming<number>(0.5, { duration: exitDuration }),
            ),
          },
        ],
      },
    };
  };

  return (
    <Animated.Text
      entering={enteringAnimation}
      exiting={exitingAnimation}
      style={style}
    >
      {char}
    </Animated.Text>
  );
};

const StaggeredPlaceholder: React.FC<{
  text: string;
  enterDuration: number;
  exitDuration: number;
  delayIncrement: number;
  style?: StyleProp<TextStyle>;
}> = ({ text, enterDuration, exitDuration, delayIncrement, style }) => {
  const characters = Array.from(text);

  return (
    <Animated.View style={styles.placeholderWrapper}>
      {characters.map((char, index) => (
        <Character
          key={`${char}-${index}-${text}`}
          char={char}
          index={index}
          enterDuration={enterDuration}
          exitDuration={exitDuration}
          delayIncrement={delayIncrement}
          style={style as TextStyle}
        />
      ))}
    </Animated.View>
  );
};

const AnimatedInput = forwardRef<TextInputType, IAnimatedInput>(
  (
    {
      placeholders,
      animationInterval = 3000,
      value,
      onChangeText,
      onFocus,
      onBlur,
      containerStyle = {
        width: "100%",
      },
      inputWrapperStyle,
      inputStyle,
      placeholderStyle,
      characterEnterDuration = 300,
      characterExitDuration = 200,
      characterDelayIncrement = 30,
      blurAnimationDuration,
      blurIntensityRange,
      blurProgressRange,
      ...props
    }: IAnimatedInput,
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>(value || "");
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
      if (isFocused || inputValue) return;
      const timeout = setTimeout<[]>(() => {
        setCurrentIndex((prev) => (prev + 1) % placeholders.length);
      }, animationInterval);

      return () => clearTimeout(timeout);
    }, [
      currentIndex,
      isFocused,
      inputValue,
      placeholders.length,
      animationInterval,
    ]);

    const handleChangeText = (text: string) => {
      setInputValue(text);
      onChangeText?.(text);
    };

    return (
      <View style={[styles.wrapper, containerStyle]}>
        <Pressable
          style={[styles.inputWrapper, inputWrapperStyle]}
          onPress={() => inputRef.current?.focus()}
        >
          {!isFocused && !inputValue && (
            <StaggeredPlaceholder
              text={placeholders[currentIndex]}
              enterDuration={characterEnterDuration}
              exitDuration={characterExitDuration}
              delayIncrement={characterDelayIncrement}
              style={[styles.character, placeholderStyle]}
            />
          )}
          <TextInput
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            style={[styles.input, inputStyle]}
            value={inputValue}
            onChangeText={handleChangeText}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            placeholderTextColor="transparent"
            {...props}
          />
        </Pressable>
      </View>
    );
  },
);
AnimatedInput.displayName = "AnimatedInput";

export default memo(AnimatedInput);

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  inputWrapper: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    position: "relative",
    minHeight: 48,
    justifyContent: "center",
  },
  placeholderWrapper: {
    position: "absolute",
    left: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    pointerEvents: "none",
  },
  character: {
    fontSize: 16,
    color: "#71717a",
    fontFamily: "PlusJakartaSans_400Regular",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fafafa",
    paddingVertical: 0,
    fontFamily: "PlusJakartaSans_400Regular",
  },
});
