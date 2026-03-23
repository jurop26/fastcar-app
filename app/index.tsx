import React from "react";
import { ActivityIndicator, View } from "react-native";
import { AsyncSkia } from "../components/async-skia.native";
import { CarComponent } from "../components/CarComponent";
import { RoadComponent } from "../components/RoadComponent";


export default function Page() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <React.Suspense fallback={<ActivityIndicator />}>
          <AsyncSkia />
          <RoadComponent />
          <CarComponent />

        </React.Suspense>
      </View>

    </View >
  );
}
