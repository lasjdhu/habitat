import { MorphLoader } from "@/components/reactix/organisms/morph-loader";
import { colors } from "@/lib/config/colors";
import { View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <MorphLoader
        size={120}
        color={colors.primary}
        rotationDuration={1000}
        morphDuration={1200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
