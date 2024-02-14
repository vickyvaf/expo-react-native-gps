import { Text, View } from "@/components/Themed";
import { useBackgroundCompass } from "@/libs/useBackgroundCompass";
import { useBackgoundLocation } from "@/libs/useBackgroundLocation";
import { useState } from "react";
import { Button, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/SimpleLineIcons";

export default function TabOneScreen() {
  const [count, setCount] = useState(0);

  const { location } = useBackgoundLocation(count);
  const { compassDegree } = useBackgroundCompass(count);

  return (
    <>
      <View style={styles.container}>
        <Text>Latitude {location?.coords.latitude}</Text>
        <Text>Longitude {location?.coords.longitude}</Text>
        <Text>Speed {location?.coords.speed?.toFixed(3)}</Text>
        <Text>Compass {compassDegree && compassDegree.toFixed(0)}°</Text>

        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <Button title="Update coordinate" onPress={() => setCount(count + 1)} />
      </View>

      <MapView style={styles.map} zoomControlEnabled>
        <Marker
          coordinate={{
            latitude: location?.coords.latitude || 0,
            longitude: location?.coords.longitude || 0,
          }}
          title="Marker"
          description="Example Marker"
          rotation={Number(compassDegree.toFixed(0))}
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
    height: 300,
  },
  iconContainer: {
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  markerIcon: {
    position: "relative",
    transform: [{ translateY: 30 }],
  },
});
