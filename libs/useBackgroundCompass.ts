import { Magnetometer } from "expo-sensors";
import { useEffect, useState } from "react";

export const useBackgroundCompass = (count: number) => {
  const [compassDegree, setCompassDegree] = useState(0);
  useEffect(() => {
    if (count === 0) return;

    const magnometerSubscribe = Magnetometer.addListener(({ x, y }) => {
      const angle = Math.atan2(y, x);
      const heading = (angle * 180) / Math.PI + 90;

      setCompassDegree((prev) => {
        if (prev.toFixed(0) === heading.toFixed(0)) return prev;

        return heading >= 0 ? heading : heading + 360;
      });
    });

    return () => magnometerSubscribe.remove();
  }, [count]);

  return { compassDegree };
};
