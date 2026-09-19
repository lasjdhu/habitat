import { colors } from "@/lib/config/colors";
import { fonts } from "@/lib/config/constants";
import { Text, StyleSheet, type TextStyle, type StyleProp } from "react-native";

interface AppTextProps {
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  type?: "heading" | "subheading" | "body" | "caption";
  style?: StyleProp<TextStyle>;
}

export function AppText({
  children,
  size = "medium",
  type = "body",
  style,
}: AppTextProps) {
  const sizeStyles =
    size === "small" ? styles.small : size === "large" ? styles.large : null;
  const typeStyles =
    type === "heading"
      ? styles.heading
      : type === "subheading"
        ? styles.subheading
        : type === "caption"
          ? styles.caption
          : null;

  return (
    <Text style={[styles.text, sizeStyles, typeStyles, style]}>{children}</Text>
  );
}
const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  heading: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  subheading: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  caption: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
  large: {
    fontSize: 18,
    lineHeight: 26,
  },
});
