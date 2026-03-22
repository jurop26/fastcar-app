import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { Accelerometer } from "expo-sensors";
import React, { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import CAR_PATH from "../constans/car";

export const CarComponent = () => {
    const { width: screenWidth } = useWindowDimensions();
    const translateX = useSharedValue(screenWidth / 2);
    const carWidth = 200 / 3;

    useEffect(() => {
        const subscription = Accelerometer.addListener(accelData => {
            let newX = screenWidth / 2 - (carWidth / 2) + accelData.x * 200;
            newX = Math.max(0, Math.min(newX, screenWidth - carWidth));

            translateX.value = newX;
        });
        Accelerometer.setUpdateInterval(16);

        return () => subscription.remove();
    }, []);

    const transform = useDerivedValue(() => {
        return [
            { translateX: translateX.value },
            { scale: 1 / 3 },
            { translateY: 2000 }
        ];
    }, [translateX]);

    return (
        <Canvas style={{ flex: 1, backgroundColor: "black" }}>
            <Path path={CAR_PATH} color="red" transform={transform} />
        </Canvas>
    );
};