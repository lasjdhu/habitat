import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { colors, materials } from "@/lib/config/colors";
import { AppText } from "@/components/atoms";
import { createProfile } from "@/lib/data/api";
import { useApp } from "@/lib/store";
import { Button } from "@/components/reactix/base/button";
import { Title } from "@/components/reactix/base/title";
import AnimatedInput from "@/components/reactix/base/animated-input-bar";
import {
  RadialIntro,
  type OrbitItem,
} from "@/components/reactix/organisms/radial-intro";
import { HeartPulse, Brain, Hammer, Flower2, Users } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const orbitItems: OrbitItem[] = [
  {
    id: 1,
    name: "Mindfulness",
    content: <Flower2 color={colors.white} size={28} />,
    backgroundColor: materials.dew,
    borderColor: materials.dew,
  },
  {
    id: 2,
    name: "Health",
    content: <HeartPulse color={colors.white} size={24} />,
    backgroundColor: materials.copper,
    borderColor: materials.copper,
  },
  {
    id: 3,
    name: "Intelligence",
    content: <Brain color={colors.white} size={24} />,
    backgroundColor: materials.ink,
    borderColor: materials.ink,
  },
  {
    id: 4,
    name: "Craft",
    content: <Hammer color={colors.white} size={24} />,
    backgroundColor: materials.parts,
    borderColor: materials.parts,
  },
  {
    id: 5,
    name: "Social",
    content: <Users color={colors.white} size={24} />,
    backgroundColor: materials.gold,
    borderColor: materials.gold,
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const { refreshData } = useApp();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const trimmedName = name.trim();

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidHide", () => {
      inputRef.current?.blur();
    });
    return () => subscription.remove();
  }, []);

  async function handleStart() {
    if (!trimmedName || isSaving) {
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      await createProfile(trimmedName);
      await refreshData();
      router.replace("/");
    } catch {
      setError("Could not set up your city. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={Keyboard.dismiss}
            style={styles.pressableContainer}
          >
            <RadialIntro
              orbitItems={orbitItems}
              expanded={!isInputFocused}
              imageSize={width / 5}
              spinDuration={12}
              stageSize={width - 8}
              style={styles.heroMark}
            />

            <View style={styles.copyBlock}>
              <Title
                level="h1"
                align="center"
                style={styles.heading}
                color={colors.text}
              >
                Build your city
              </Title>

              <AppText style={styles.subheading}>
                Track your habits, earn matartials and grow your base
              </AppText>
            </View>

            <View style={styles.formCard}>
              <AnimatedInput
                ref={inputRef}
                autoCapitalize="words"
                autoCorrect={false}
                animationInterval={2600}
                blurIntensityRange={[0, 1.5, 3]}
                blurProgressRange={[0, 0.25, 1]}
                characterDelayIncrement={24}
                containerStyle={styles.inputContainer}
                editable={!isSaving}
                inputStyle={styles.input}
                inputWrapperStyle={styles.inputWrapper}
                onChangeText={setName}
                onSubmitEditing={handleStart}
                placeholderStyle={styles.placeholderText}
                placeholders={["Enter your name", "Name your city founder"]}
                returnKeyType="done"
                value={name}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />

              {error ? (
                <AppText style={styles.errorText}>{error}</AppText>
              ) : null}

              <Button
                onPress={handleStart}
                disabled={!trimmedName || isSaving}
                isLoading={isSaving}
                loadingText="Starting..."
                loadingTextColor={colors.white}
                loadingTextBackgroundColor={colors.primary}
                backgroundColor={colors.primary}
                width={Math.min(width - 88, 360)}
                style={styles.button}
              >
                <AppText style={styles.buttonText}>Start</AppText>
              </Button>
            </View>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pressableContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  heroMark: {
    alignSelf: "center",
  },
  copyBlock: {
    alignItems: "center",
    marginBottom: 28,
  },
  heading: {
    marginBottom: 10,
  },
  subheading: {
    maxWidth: 256,
    textAlign: "center",
    color: colors.textMuted,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  inputContainer: {
    width: "100%",
    marginVertical: 0,
  },
  inputWrapper: {
    backgroundColor: colors.background,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    color: colors.text,
  },
  placeholderText: {
    color: colors.textMuted,
  },
  errorText: {
    color: colors.danger,
  },
  button: {
    marginTop: 4,
  },
  buttonText: {
    color: colors.white,
  },
});
