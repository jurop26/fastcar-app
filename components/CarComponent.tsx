import { Canvas, Path } from "@shopify/react-native-skia";
import { Accelerometer } from "expo-sensors";
import React, { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import CAR_PATH from "../constans/car";

export const CarComponent = () => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();

    const speedFactor = 300;
    const originalCarWidth = 200;
    const originalCarHeight = 290;

    const scale = 1 / 3;
    const carWidth = originalCarWidth * scale;
    const carHeight = originalCarHeight * scale;

    const translateX = useSharedValue((screenWidth - carWidth) / 2);
    const translateY = useSharedValue((screenHeight - carHeight) / 2);

    useEffect(() => {
        const subscription = Accelerometer.addListener(accelData => {
            const velocityX = accelData.x * speedFactor;
            const velocityY = -accelData.y * speedFactor;

            translateX.value = Math.max(0, Math.min(translateX.value + velocityX * 0.128, screenWidth - carWidth));
            translateY.value = Math.max(screenHeight / 3, Math.min(translateY.value + velocityY * 0.064, screenHeight - (carHeight * 1.5)));
        });

        Accelerometer.setUpdateInterval(16);

        return () => subscription.remove();
    }, []);


    const transform = useDerivedValue(() => {
        return [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale },
        ];
    }, [translateX, translateY]);

    return (
        <Canvas style={{ flex: 1 }}>
            <Path path={CAR_PATH} color="red" transform={transform} />
        </Canvas>
    );
};