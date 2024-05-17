import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { G, Path, Svg } from "react-native-svg";
import { generateBlob } from "../util/blob";

export function SplashScreen() {
  const ww = Dimensions.get("window").width;
  const hh = Dimensions.get("window").height;
  const [blob, setBlob] = useState(generateBlob(ww, hh));

  const iid = setInterval(() => {
    setBlob(generateBlob(ww, hh));
  }, 400);
  useEffect(() => {
    return () => {
      clearInterval(iid);
    };
  });

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Svg>
        <G>
          <Path d={blob}></Path>
        </G>
      </Svg>
    </View>
  );
}
