import { Canvas, Path } from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { useDerivedValue, useFrameCallback, useSharedValue } from "react-native-reanimated";
import { Point, RoadProps } from "../types/road";
import { createPath, randomByRange } from "../helpers/roadPaths";

export const RoadComponent: React.FC<RoadProps> = ({
    color = "gray",
    strokeWidth = 10,
    speed = 5,
}) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const roadPoints = useSharedValue<Point[]>([]);
    const direction = useSharedValue(0);
    const changeTimer = useSharedValue(2000);

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

    useFrameCallback((frame) => {
        const deltaTime = frame.timeSincePreviousFrame ?? 16;
        const points = roadPoints.value;
        const last = points[0] || { left: screenWidth / 2 - 100 };

        changeTimer.value -= deltaTime;

        if (changeTimer.value <= 0) {
            const isLeftMaximum = last.left === 10
            const isRightMaximum = last.left + 200 === screenWidth - 210

            const range = isLeftMaximum ? { from: 0, to: 1 } : isRightMaximum ? { from: -1, to: 0 } : { from: -1, to: 1 }
            direction.value = randomByRange(range)

            changeTimer.value = 1000 + Math.random() * 2000;
        }

        const duration = 1000;
        const progress = 1 - (changeTimer.value / duration);

        const eased = Math.sin(progress * Math.PI);

        const center = last.left + 100;

        const drift = direction.value * eased * 5;

        const newCenter = center + drift;

        const newLeft = Math.max(
            10,
            Math.min(newCenter - 100, screenWidth - 210)
        );

        const newRight = newLeft + 200;

        const newPoints = points
            .map(p => ({ ...p, y: p.y + speed }))
            .filter(p => p.y <= screenHeight);

        newPoints.unshift({ left: newLeft, right: newRight, y: 0 });

        roadPoints.value = newPoints;
    });

    return (
        <Canvas style={{ flex: 1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
            <Path path={leftPath} color={color} strokeWidth={strokeWidth} />
            <Path path={rightPath} color={color} strokeWidth={strokeWidth} />
        </Canvas>
    );
};