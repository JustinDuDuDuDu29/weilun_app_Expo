import React, { useState } from "react";
import { Pressable, SafeAreaView, View, Text } from "react-native";

function OpenMe({
  children,
  cmpName,
  cmpId,
}: {
  children: React.JSX.Element;
  cmpName: string;
  cmpId: number;
}): React.JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <SafeAreaView>
      <Pressable>
        <Text allowFontScaling={false} className="text-2xl">
          {cmpId},{cmpName}
        </Text>
      </Pressable>
      <View className="px-2">{open && children}</View>
    </SafeAreaView>
  );
}

export default OpenMe;
