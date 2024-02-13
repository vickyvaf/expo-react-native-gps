import { useEffect, useState } from "react";
import { Button, Image, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";

import * as Location from "expo-location";

import { Magnetometer } from "expo-sensors";
import MapView, { Marker } from "react-native-maps";

import Icon from "react-native-vector-icons/SimpleLineIcons";

// import IconA from "@/assets/icons/blue-dot-1.png";

export default function TabOneScreen() {
  const [count, setCount] = useState(0);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deviceRotation, setDeviceRotation] = useState<number | null>(null);

  const formattedDate = (time: Date | number | undefined) => {
    const date = new Date(time as Date);
    // Customize the date format as needed
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };
    return date.toLocaleDateString("en-US", options as any);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      // Watch for location updates
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 1,
        },
        (newLocation) => {
          console.log("new location: ", newLocation);

          setLocation(newLocation);
        }
      );

      // Clean up subscription when component unmounts
      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    })();
  }, [count]);

  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState<any>(null);
  const [angleRotation, setAngleRotation] = useState(0);

  const _subscribe = () => {
    const x = Magnetometer.addListener((result) => {
      console.log("result: ", result);
      const angleRadians = Math.atan2(result.y, result.x);

      // Convert radians to degrees
      const angleDegrees = (angleRadians * 180) / Math.PI;

      setAngleRotation(angleDegrees);

      setData(result);
    });
    setSubscription(x);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const _slow = () => Magnetometer.setUpdateInterval(3000);
  const _fast = () => Magnetometer.setUpdateInterval(16);

  useEffect(() => {
    // _subscribe();
    // _slow();
    // return () => _unsubscribe();
  }, []);

  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const subscribeToHeading = () => {
      Magnetometer.addListener(({ x, y }) => {
        const angle = Math.atan2(y, x);
        const heading = (angle * 180) / Math.PI + 90; // Adjust for device-specific offset
        setHeading(heading >= 0 ? heading : heading + 360); // Ensure positive angle
      });
    };

    const unsubscribeFromHeading = () => {
      Magnetometer.removeAllListeners();
    };

    subscribeToHeading();

    return () => {
      unsubscribeFromHeading();
    };
  }, [count]);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <>
      <View style={styles.container}>
        {/* <Text>{formattedDate(location?.timestamp)}</Text> */}
        <Text>Latitude {location?.coords.latitude}</Text>
        <Text>Longitude {location?.coords.longitude}</Text>
        <Text>Speed {location?.coords.speed?.toFixed(3)}</Text>
        <Text>Device rotation {JSON.stringify(deviceRotation)}</Text>
        <Text>Compass {heading.toFixed(2)}</Text>

        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <Button title="Update coordinate" onPress={() => setCount(count + 1)} />
      </View>

      <MapView
        style={styles.map}
        zoomControlEnabled
        region={{
          latitude: location?.coords.latitude || 0,
          longitude: location?.coords.longitude || 0,
          // latitudeDelta: 3, // Controls the zoom level (higher value = lower zoom)
          // longitudeDelta: 3,
        }}
      >
        {/* Add markers or other map components as needed */}
        <Marker
          coordinate={{
            latitude: location?.coords.latitude || 0,
            longitude: location?.coords.longitude || 0,
          }}
          title="Marker"
          description="Example Marker"
          rotation={Number(heading.toFixed(0))}
          zIndex={1}
        >
          <Icon
            name="arrow-up"
            size={50}
            color="#2a9df4"
            style={styles.markerIcon}
          />
        </Marker>
      </MapView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  map: {
    flex: 1,
    height: 300, // Adjust the height as needed
  },
  iconContainer: {
    zIndex: 2, // Ensure the icon is on top
    justifyContent: "center",
    alignItems: "center",
  },
  markerIcon: {
    position: "relative",
    transform: [{ translateY: 30 }],
  },
});
