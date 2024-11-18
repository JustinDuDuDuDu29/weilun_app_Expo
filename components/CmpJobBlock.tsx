import React, { useState } from 'react';
import { Pressable, Text, View, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importing icon
import { cmpJobT } from '../types/revenueT';
import { useAtom } from 'jotai';
import { userInfo } from '../App';
import CJBlock from './CJBlock';
import { ClaimedJob } from '../types/JobItemT';

type User = {
  UserID: number;
  UserName: string;
  job: ClaimedJob[];
};

function CmpJobBlock({ cmpJob }: { cmpJob: cmpJobT }): React.JSX.Element {
  const [getUserInfo] = useAtom(userInfo);
  const [showUsers, setShowUsers] = useState(false);
  const [expandedUserID, setExpandedUserID] = useState<number | null>(null);
  const downloadByCmp = () => {
    console.log("Press")
  }
  const handleCompanyPress = () => {
    setShowUsers(!showUsers);
  };

  const handleUserPress = (userID: number) => {
    setExpandedUserID((prev) => (prev === userID ? null : userID));
  };

  const renderJobDetails = ({ item }: { item: ClaimedJob }) => (
    <View style={styles.jobContainer}>
      <CJBlock CJ={item} removeFromList={() => {}} />
    </View>
  );

  const renderUser = ({ item }: { item: User }) => (
    <>
      <Pressable onPress={() => handleUserPress(item.UserID)} style={styles.userPressable}>
        <Text style={styles.userName}>{item.UserName}</Text>
      </Pressable>
      {expandedUserID === item.UserID && (
        <FlatList
          data={item.job}
          keyExtractor={(job) => job.ID.toString()}
          renderItem={renderJobDetails}
          contentContainerStyle={styles.jobListContainer}
        />
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <Pressable onPress={handleCompanyPress} style={styles.pressable}>
        <View style={styles.row}>
          {/* Left Side: Text */}
          <Text style={styles.headerText}>
            {cmpJob.Name} / {cmpJob.Count} / {cmpJob.Total}
          </Text>

          {/* Right Side: Icon */}
          <Pressable onPress={downloadByCmp}>
          <Icon
            name={'save'}
            size={24}
            color="#333"
            style={styles.icon}
          />
          </Pressable>
        </View>
      </Pressable>

      {showUsers && (
        <FlatList
          data={cmpJob.Jobs}
          keyExtractor={(user) => user.UserID.toString()}
          renderItem={renderUser}
        />
      )}
    </View>
  );
}

export default CmpJobBlock;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
  },
  pressable: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
  userPressable: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  jobContainer: {
    paddingLeft: 20,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  jobListContainer: {
    paddingLeft: 20,
  },
});
