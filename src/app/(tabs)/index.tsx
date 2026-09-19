import { SafeAreaView } from "react-native-safe-area-context";
import { TileScene } from "@/components/organisms";

export default function WorldScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TileScene />
    </SafeAreaView>
  );
}
