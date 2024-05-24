import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, SafeAreaView, TextInput, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { callAPIAbort } from "../util/callAPIUtil";
import { cmpInfo, inUserT, userLS } from "../types/userT";
import { StyleSheet } from "nativewind";

function SearchComp(props: { setUsetList: Function }): React.JSX.Element {
  const [isFocus, setIsFocus] = useState(false);
  const [searchVal, setSearchVal] = useState<{
    Name: string;
    ID: string;
    occupied: boolean;
    searchQ: string;
    canSearch: boolean;
  } | null>();
  const [search, setSearch] = useState<
    {
      Name: string;
      ID: string;
      occupied: boolean;
      searchQ: string;
      canSearch: boolean;
    }[]
  >([
    {
      Name: "姓名",
      ID: "Name",
      occupied: false,
      searchQ: "",
      canSearch: false,
    },
    {
      Name: "電話",
      ID: "PhoneNum",
      occupied: false,
      searchQ: "",
      canSearch: false,
    },
    {
      Name: "所屬公司",
      ID: "BelongCmpName",
      occupied: false,
      searchQ: "",
      canSearch: false,
    },
  ]);

  const ctrl: AbortController = new AbortController();
  const signal: AbortSignal = ctrl.signal;

  const getData = useCallback(async () => {
    try {
      let str = "";
      search.forEach((e) => {
        if (e.canSearch) {
          str = str + e.ID + "=" + e.searchQ + "&";
        }
      });

      const data: userLS[] = await (
        await callAPIAbort(
          "/api/user?" + str.replace(/&$/, ""),
          "GET",
          {},
          true,
          signal
        )
      ).json();
      // console.log(data);
      props.setUsetList(data);
    } catch (error) {
      console.log(error);
    }
  }, [search]);

  useEffect(() => {
    getData();
  }, [search]);
  const inp = useRef();

  return (
    <SafeAreaView>
      <View className="flex flex-col w-full bg-yellow-200 ">
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={search.filter((e) => !e.occupied)}
          labelField="Name"
          valueField="ID"
          placeholder={!isFocus ? "條件" : "..."}
          value={searchVal}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setSearchVal(item);
            setIsFocus(false);
          }}
        />
        <View className=" bg-red-200 w-full ">
          <TextInput
            ref={inp}
            onChangeText={(e) => {
              if (searchVal) {
                ctrl.abort();
                setSearch(
                  search.map((el, i) => {
                    if (el.ID == searchVal.ID) {
                      return {
                        ...el,
                        canSearch: e == "" ? false : true,
                        searchQ: e,
                      };
                    }
                    return el;
                  })
                );
              }
            }}
          />
        </View>
      </View>
      <Pressable
        className="bg-sky-400"
        onPress={() => {
          if (searchVal) {
            const arr = search.map((e) => {
              if (e.ID == searchVal.ID) {
                return { ...e, occupied: true };
              }
              return e;
            });
            setSearch(arr);
            setSearchVal(null);
          }
          inp.current.clear();
        }}
      >
        <Text>新增</Text>
      </Pressable>
      {search.map((el) => {
        if (el.occupied) {
          return (
            <Pressable
              key={el.ID}
              onPress={() => {
                setSearch(
                  search.map((e) => {
                    if (e.ID == el.ID) {
                      return {
                        ...e,
                        occupied: false,
                        searchQ: "",
                        canSearch: false,
                      };
                    }
                    return e;
                  })
                );
              }}
            >
              <Text>
                {el.Name}:{el.searchQ}
              </Text>
            </Pressable>
          );
        }
        return;
      })}
    </SafeAreaView>
  );
}

export default SearchComp;
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 50,
  },
  container: {
    display: "flex",
    paddingHorizontal: 10,
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
