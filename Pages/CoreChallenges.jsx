import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import PragraphText from '../utils/PragraphText';
import {useData} from '../Context/Contexter';
import {Colors, pageView} from '../constants/Colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Api from '../Api';
import Skeleton from '../Skeletons/Skeleton';

const CoreChallenges = () => {
  const {selectedChallengeTopic, setSelectedChallenge} = useData();
  const [challenges, setChallenges] = useState([]);
  const {width, height} = Dimensions.get('window');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  // get all challeges
  // console.log(selectedChallengeTopic?.challengeName);

  const getChallenges = useCallback(async () => {
    try {
      const res = await axios.post(`${Api}/Challenges/getChallenges`, {
        ChallengeTopic: selectedChallengeTopic?.challengeName,
      });
      if (res.data) {
        console.log(res.data);
        setLoading(false);
        setChallenges(res.data);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setLoading(false);
    }
  }, [selectedChallengeTopic]);

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
        elevation: 3,
        marginHorizontal: 5,
        padding: 15,
        borderRadius: 10,
        flexDirection: 'column',
        rowGap: 7,
      }}>
      <Text
        style={{
          color: Colors.veryDarkGrey,
          letterSpacing: 1,
          fontSize: width * 0.045,
        }}>
        <Text>{item?.question_id}.</Text>
        {item?.title}
      </Text>
      <Text style={{letterSpacing: 1, color: Colors.mildGrey}}>
        {item?.description}
      </Text>
      <Text style={{color: '#1d3557', fontWeight: '600', letterSpacing: 1}}>
        <Text>Inputs: </Text>
        {item?.input_example}
      </Text>
      <Text style={{color: '#ee6c4d', letterSpacing: 1}}>
        <Text>Output: </Text> {item?.output_example}
      </Text>
      <Text
        onPress={() => {
          navigation.navigate('CoreChallengeViewer');
          setSelectedChallenge(item);
        }}
        style={{
          color: 'white',
          padding: 10,
          backgroundColor: Colors.violet,
          textAlign: 'center',
          letterSpacing: 1,
          borderRadius: 10,
        }}>
        Take a Look
      </Text>
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
        <PragraphText text={selectedChallengeTopic?.challengeName} fsize={28} />
      </View>
      {/* challenge list */}
      <View style={{paddingHorizontal: 10, borderWidth: 0, flex: 1}}>
        <FlatList
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
