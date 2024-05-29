import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function Layout({
  children,
}: {
  children: React.JSX.Element;
}): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView>
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

export default Layout;
