import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  View,
  Alert,
} from "react-native";
import _data from "../asset/fakeData/_jobs.json";
import { jobItemT, jobItemTS } from "../types/JobItemT";
import JobBlock from "../components/JobBlock";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { callAPI } from "../util/callAPIUtil";
import { FAB, TextInput } from "react-native-paper";
import { StyleSheet } from "nativewind";
import { cmpInfo } from "../types/userT";
import { useColorScheme as usc } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import { useStore } from "jotai";
import { fnAtom } from "../App";
import { AlertMe } from "../util/AlertMe";

function JobsAdmin(): React.JSX.Element {
  const isFocused = useIsFocused();
  const store = useStore();
  const cS = usc();
  const navigation = useNavigation<ScreenProp>();

  const getData = useCallback(async () => {
    try {
      const res = await callAPI("/api/jobs/all", "POST", {}, true);
      if (!res.ok) {
        throw res;
      }
      const allJobs = await res.json();
      setData(allJobs);
    } catch (err) {
      if (err instanceof Response) {
        switch (err.status) {
          case 451:
            store.get(fnAtom).codefn();
            break;

          default:
            AlertMe(err);
            break;
        }
      }
      if (err instanceof TypeError) {
        if (err.message == "Network request failed") {
          Alert.alert("糟糕！", "請檢察網路有沒有開", [
            { text: "OK", onPress: () => {} },
          ]);
        }
      } else {
        Alert.alert("GG", `怪怪\n${err}`, [{ text: "OK", onPress: () => {} }]);
      }
    }
  }, [isFocused]);

  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  }, []);

  const [cmpList, setCmpList] = useState<cmpInfo[]>([]);

  //
  return (
    <SafeAreaView>
      <View className="mx-5 relative">
        <FlatList
          data={data}
          className="h-full"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await getData();
                setRefreshing(false);
              }}
            />
          }
          renderItem={({ item }: { item: jobItemT }) => (
            <JobBlock jobItem={item} />
          )}
        />
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate("CreateJobP")}
        />
      </View>
    </SafeAreaView>
  );
}

export default JobsAdmin;
const styles = StyleSheet.create({
  container: {
    display: "flex",
    paddingHorizontal: 10,
    // backgroundColor: usc() == "light" ? "#fff" : "#000",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 40,
  },
  dropdown: {
    backgroundColor: "rgb(233, 223, 235)",
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
