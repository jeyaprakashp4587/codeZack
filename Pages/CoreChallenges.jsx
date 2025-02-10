import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import PragraphText from '../utils/PragraphText';
import {useData} from '../Context/Contexter';
import {Colors, pageView} from '../constants/Colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {challengesApi} from '../Api';
import Skeleton from '../Skeletons/Skeleton';
import {debounce} from 'lodash';
import HeadingText from '../utils/HeadingText';

const CoreChallenges = () => {
  const {selectedChallengeTopic, setSelectedChallenge} = useData();
  // console.log(selectedChallengeTopic);
  const {width, height} = Dimensions.get('window');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  // get all challeges
  const [challenges, setChallenges] = useState([]);
  const [chloading, setChLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const getChallenges = useCallback(async () => {
    if (chloading || !hasMore) return;
    setChLoading(true);
    try {
      const res = await axios.post(
        `${challengesApi}/Challenges/getChallenges`,
        {
          ChallengeTopic: selectedChallengeTopic?.ChallengeName,
          page,
          limit: 10,
        },
      );
      if (res.data) {
        setChallenges(prev => [...prev, ...res.data.challenges]);
        setHasMore(res.data.hasMore);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setChLoading(false);
    }
  }, [selectedChallengeTopic, page, chloading, hasMore]);
  // Call getChallenges on component mount and when page changes
  useEffect(() => {
    getChallenges();
  }, [getChallenges]);

  // console.log(selectedChallengeTopic?.challengeName);

  const handleSelectChallenge = useCallback(
    debounce(item => {
      setSelectedChallenge(item);
      navigation.navigate('CoreChallengeViewer');
    }, 200),
    [],
  );
  useFocusEffect(
    useCallback(() => {
      getChallenges();
    }, [getChallenges]),
  );
  // lists
  const ChallengeItem = React.memo(({item, width}) => (
    <TouchableOpacity
      style={{
        marginVertical: 10,
        backgroundColor: 'white',
        elevation: 2,
        marginHorizontal: 5,
        padding: 15,
        borderRadius: 5,
        flexDirection: 'column',
        rowGap: 10,
      }}>
      <Text
        style={{
          color: Colors.veryDarkGrey,
          letterSpacing: 1,
          fontSize: width * 0.045,
          fontWeight: '700',
        }}>
        <Text>{item?.question_id}.</Text>
        {item?.title}
      </Text>
      <Text
        style={{
          letterSpacing: 1,
          color: Colors.mildGrey,
          lineHeight: 20,
          fontSize: width * 0.03,
        }}>
        {item?.description}
      </Text>
      <Text
        style={{
          color: '#1d3557',
          fontWeight: '600',
          letterSpacing: 1,
          fontSize: width * 0.03,
        }}>
        <Text>Inputs: </Text>
        {item?.input_example}
      </Text>
      <Text
        style={{color: '#ee6c4d', letterSpacing: 1, fontSize: width * 0.03}}>
        <Text>Output: </Text> {item?.output_example}
      </Text>
      <TouchableOpacity
        onPress={() => handleSelectChallenge(item)}
        style={{
          padding: 7,
          borderRadius: 5,
          borderColor: Colors.violet,
          borderWidth: 0.5,
          borderRadius: 50,
        }}>
        <Text
          style={{
            color: Colors.violet,
            textAlign: 'center',
            letterSpacing: 1,
            fontSize: width * 0.033,
            fontWeight: '700',
          }}>
          Take a Look
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  ));
  // loadinf skeletom
  if (loading) {
    return (
      <View style={[pageView, {paddingHorizontal: 15}]}>
        <Skeleton width="100%" height={height * 0.02} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.2} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.2} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.2} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.2} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.2} radius={10} mt={10} />
      </View>
    );
  }
  return (
    <View style={pageView}>
      {/* header */}
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Challenges" />
        <PragraphText text={selectedChallengeTopic?.ChallengeName} fsize={24} />
      </View>
      {/* challenge list */}
      <View style={{paddingHorizontal: 10, borderWidth: 0, flex: 1}}>
        <FlatList
          nestedScrollEnabled={true}
          data={challenges}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <ChallengeItem item={item} width={width} />}
        />
      </View>
    </View>
  );
};

export default CoreChallenges;

const styles = StyleSheet.create({});
