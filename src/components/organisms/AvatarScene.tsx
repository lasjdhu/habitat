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

import AvatarModel from "../../../assets/models/avatar.glb";

function InteractiveScene() {
  const cameraManipulator = useCameraManipulator({
    orbitHomePosition: [0, 0, 8],
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

  return (
    <GestureDetector gesture={combinedGesture}>
      <FilamentView style={styles.filamentView}>
        <DefaultLight />
        <Model source={AvatarModel} />
        <Camera cameraManipulator={cameraManipulator} />
      </FilamentView>
    </GestureDetector>
  );
}

export function AvatarScene() {
  return (
    <View style={styles.sceneContainer}>
      <FilamentScene>
        <InteractiveScene />
      </FilamentScene>
    </View>
  );
}

const styles = StyleSheet.create({
  sceneContainer: {
    height: 200,
    backgroundColor: colors.background,
  },
  filamentView: {
    flex: 1,
  },
});
