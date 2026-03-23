import { Canvas, Path } from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { Point, RoadProps } from "../types/road";
import { createPath } from "../helpers/roadPaths";

export const RoadComponent: React.FC<RoadProps> = ({
    color = "gray",
    strokeWidth = 10,
    speed = 15,
}) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const roadPoints = useSharedValue<Point[]>([]);
    const direction = useSharedValue(0);
    const changeTimer = useSharedValue(0);


    const leftPath = useDerivedValue(() => {
        return createPath(roadPoints.value, "left", screenHeight)
    })

    const rightPath = useDerivedValue(() => {
        return createPath(roadPoints.value, "right", screenHeight, screenWidth)
    })

    useEffect(() => {
        const inititalPoints = [{ left: 100, right: 300, y: 0 }]

        roadPoints.value = inititalPoints
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            const points = roadPoints.value;
            changeTimer.value -= 16;

            if (changeTimer.value <= 0) {
                direction.value = (Math.random() - 0.5) * 2;
                changeTimer.value = Math.random() * 2000;
            }

            const last = points[0] || { left: screenWidth / 2 };
            const drift = direction.value < 0 ? 2 : -2;
            const newLeft = Math.max(10, Math.min(last.left + drift, screenWidth - 210));
            const newRight = newLeft + 200;

            const newPoints = points
                .map(p => ({ ...p, y: p.y + speed }))
                .filter(p => p.y <= screenHeight);


            newPoints.unshift({ left: newLeft, right: newRight, y: 0 });

            roadPoints.value = newPoints;

        }, 16);

        return () => clearInterval(interval);
    }, []);


    return (
        <Canvas style={{ flex: 1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
            <Path path={leftPath} color={color} strokeWidth={strokeWidth} />
            <Path path={rightPath} color={color} strokeWidth={strokeWidth} />
        </Canvas>
    );
};