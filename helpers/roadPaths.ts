import { Skia } from "@shopify/react-native-skia";
import { Point } from "../types/road";

export function createPath(
  points: Point[],
  side: "left" | "right",
  screenHeight: number,
  screenWidth = 0,
) {
  "worklet";
  const path = Skia.Path.Make();
  const startingPoint = points[0]?.[side] || 0;

  path.moveTo(startingPoint, 0);
  points.forEach((p) => {
    path.lineTo(p[side], p.y);
  });
  path.lineTo(points[points.length - 1]?.[side] || 0, screenHeight);
  path.lineTo(screenWidth, screenHeight);
  path.lineTo(screenWidth, 0);
  path.close();

  return path;
}

export function randomByRange({ from, to }: { from: number; to: number }) {
  return Math.floor(Math.random() * (to - from + 1)) + from;
}
