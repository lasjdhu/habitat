/* eslint-disable react-hooks/immutability */
import React, { useMemo } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import {
  FilamentScene,
  FilamentView,
  DefaultLight,
  Model,
  Camera,
  useCameraManipulator,
} from "react-native-filament";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-worklets-core";
import { colors } from "@/lib/config/colors";

import TileModel from "../../../assets/models/tile.glb";

function InteractiveScene() {
  const cameraManipulator = useCameraManipulator({
    orbitHomePosition: [0, 10, 10],
    targetPosition: [0, 0, 0],
    orbitSpeed: [0.003, 0.003],
  });

  const viewHeight = Dimensions.get("window").height;

  const previousScale = useSharedValue(1);

  const combinedGesture = useMemo(() => {
    const panGesture = Gesture.Pan()
      .onBegin((event) => {
        const yCorrected = viewHeight - event.translationY;
        cameraManipulator?.grabBegin(event.translationX, yCorrected, false);
      })
      .onUpdate((event) => {
        const yCorrected = viewHeight - event.translationY;
        cameraManipulator?.grabUpdate(event.translationX, yCorrected);
      })
      .maxPointers(1)
      .onEnd(() => {
        cameraManipulator?.grabEnd();
      });

    const scaleMultiplier = 100;
    const pinchGesture = Gesture.Pinch()
      .onBegin(({ scale }) => {
        previousScale.value = scale;
      })
      .onUpdate(({ scale, focalX, focalY }) => {
        const delta = scale - previousScale.value;
        cameraManipulator?.scroll(focalX, focalY, -delta * scaleMultiplier);
        previousScale.value = scale;
      });

    return Gesture.Race(pinchGesture, panGesture);
  }, [cameraManipulator, viewHeight, previousScale]);

  const tiles = useMemo(() => {
    const spacing = 0;
    const positions: {
      translate: [number, number, number];
    }[] = [];

    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 2; y++) {
        positions.push({
          translate: [x * spacing, 0, (y - 0.5) * spacing],
        });
      }
    }

    return positions;
  }, []);

  return (
    <GestureDetector gesture={combinedGesture}>
      <FilamentView style={styles.filamentView}>
        <DefaultLight />
        {tiles.map((tile, index) => (
          <Model key={index} source={TileModel} translate={tile.translate} />
        ))}
        <Camera cameraManipulator={cameraManipulator} />
      </FilamentView>
    </GestureDetector>
  );
}

export function TileScene() {
  return (
    <View style={styles.container}>
      <FilamentScene>
        <InteractiveScene />
      </FilamentScene>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filamentView: {
    flex: 1,
  },
});
