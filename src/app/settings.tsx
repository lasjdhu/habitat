import { useState } from "react";
import { Alert, StyleSheet, useWindowDimensions, View } from "react-native";
import { Button } from "@/components/reactix/base/button";
import { AppText } from "@/components/atoms";
import { colors } from "@/lib/config/colors";
import { deleteAllData } from "@/lib/data/db";
import { useApp } from "@/lib/store";
import { router } from "expo-router";

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const { setProfile, setHabits, setCheckins } = useApp();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAllData = () => {
    if (isDeleting) {
      return;
    }

    Alert.alert(
      "Delete all data?",
      "This removes your profile, habits and progress from this device.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);

            try {
              await deleteAllData();
              setProfile(null);
              setHabits([]);
              setCheckins({});
              router.replace("/onboarding");
            } catch (error) {
              console.error("Failed to delete all data.", error);
              Alert.alert("Could not delete data", "Please try again.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <AppText type="heading" style={styles.sectionTitle}>
          Account & Data
        </AppText>
        <AppText type="caption" style={styles.sectionSubtitle}>
          Manage your local database, reset your founder profile, and clear your
          habits.
        </AppText>

        <Button
          onPress={handleDeleteAllData}
          isLoading={isDeleting}
          loadingText="Deleting..."
          loadingTextColor={colors.white}
          loadingTextBackgroundColor={colors.danger}
          backgroundColor={colors.danger}
          width={Math.min(width - 88, 360)}
          style={styles.deleteButton}
        >
          <AppText style={styles.buttonText}>Delete All Data</AppText>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: colors.textMuted,
    marginBottom: 24,
  },
  deleteButton: {
    marginTop: 4,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "600",
  },
});
