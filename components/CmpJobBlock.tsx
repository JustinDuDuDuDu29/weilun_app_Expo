import React, { useState } from 'react';
import { Pressable, Text, View, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { cmpJobT } from '../types/revenueT';
import { callAPI } from '../util/callAPIUtil';
import { formatDate } from '../util/giveMeDate';

type ClaimedJob = {
  ID: number;
  Jobid: number;
  Userid: number;
  Fromloc: string;
  Mid: { String: string; Valid: boolean };
  Toloc: string;
  CreateDate: string;
  Username: string;
  Cmpname: string;
  Cmpid: number;
  Approveddate: { Time: string; Valid: boolean };
  Finishdate: { Time: string; Valid: boolean };
};

function CmpJobBlock({ cmpJob }: { cmpJob: cmpJobT }): React.JSX.Element {
  const [showDetails, setShowDetails] = useState(false);
  const [claimedJobs, setClaimedJobs] = useState<ClaimedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClaimedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await callAPI(`/api/claimed/list?cmp=${cmpJob.ID}`, 'GET', {}, true);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data: ClaimedJob[] = await response.json();
      setClaimedJobs(data);
    } catch (err) {
      console.error('Error fetching claimed jobs:', err);
      setError('Error fetching claimed jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    if (showDetails) {
      setShowDetails(false);
    } else {
      fetchClaimedJobs();
      setShowDetails(true);
    }
  };

  const renderClaimedJob = ({ item }: { item: ClaimedJob }) => (
    <View style={styles.jobContainer}>
      <Text style={styles.textBold}>Username: {item.Username}</Text>
      <Text>From: {item.Fromloc} → To: {item.Toloc}</Text>
      <Text>
        Approved Date: {item.Approveddate.Valid ? formatDate(item.Approveddate.Time) : 'N/A'}
      </Text>
      <Text>
        Finish Date: {item.Finishdate.Valid ? formatDate(item.Finishdate.Time) : 'In Progress'}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={showDetails ? claimedJobs : []}
      keyExtractor={(item) => item.ID.toString()}
      renderItem={renderClaimedJob}
      ListHeaderComponent={
        <Pressable onPress={handlePress} style={styles.pressable}>
          <Text style={styles.headerText}>
            {cmpJob.Name}/{cmpJob.Count}/{cmpJob.Total}
          </Text>
        </Pressable>
      }
      ListEmptyComponent={!loading && showDetails && <Text>No claimed jobs available.</Text>}
      ListFooterComponent={loading && <ActivityIndicator size="large" color="#0000ff" />}
      contentContainerStyle={styles.container}
    />
  );
}

export default CmpJobBlock;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  pressable: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobContainer: {
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  textBold: {
    fontWeight: 'bold',
  },
});
