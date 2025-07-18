import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import PragraphText from '../../utils/PragraphText';
import {useData} from '../../Context/Contexter';
import {Colors, pageView} from '../../constants/Colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {challengesApi} from '../../Api';
import Skeleton from '../../Skeletons/Skeleton';
import {debounce} from 'lodash';
import HeadingText from '../../utils/HeadingText';
import {Font} from '../../constants/Font';

const CoreChallenges = () => {
  const {selectedChallengeTopic, setSelectedChallenge} = useData();
  // console.log(selectedChallengeTopic);
  const [challenges, setChallenges] = useState([]);
  const {width, height} = Dimensions.get('window');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  // get all challeges
  // console.log(selectedChallengeTopic?.challengeName);
  const getChallenges = useCallback(async () => {
    try {
      console.log('log from core');

      const res = await axios.post(
        `${challengesApi}/Challenges/getChallenges`,
        {
          ChallengeTopic: selectedChallengeTopic?.ChallengeName,
        },
      );
      if (res.data) {
        // console.log(res.data);
        setLoading(false);
        setChallenges(res.data);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setLoading(false);
    }
  }, [selectedChallengeTopic]);

  const handleSelectChallenge = useCallback(item => {
    setSelectedChallenge(item);
    navigation.navigate('CoreChallengeViewer');
  }, []);
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
        elevation: 1.5,
        marginHorizontal: 5,
        padding: 15,
        borderRadius: 5,
        flexDirection: 'column',
        rowGap: 10,
      }}>
      <Text
        style={{
          color: Colors.veryDarkGrey,
          letterSpacing: 0.4,
          fontSize: width * 0.045,
          // fontWeight: '700',
          fontFamily: Font.SemiBold,
        }}>
        <Text>{item?.question_id}.</Text>
        {item?.title}
      </Text>
      <Text
        style={{
          letterSpacing: 0.4,
          color: Colors.mildGrey,
          lineHeight: 20,
          fontSize: width * 0.03,
          fontFamily: Font.Medium,
        }}>
        {item?.description}
      </Text>
      <Text
        style={{
          color: '#1d3557',
          fontWeight: '600',
          letterSpacing: 0.4,
          fontSize: width * 0.03,
          fontFamily: Font.Medium,
        }}>
        <Text style={{fontFamily: Font.Regular}}>Inputs: </Text>
        {item?.input_example}
      </Text>
      <Text
        style={{
          color: '#ee6c4d',
          letterSpacing: 0.4,
          fontSize: width * 0.03,
          fontFamily: Font.Medium,
        }}>
        <Text style={{fontFamily: Font.Regular}}>Output: </Text>{' '}
        {item?.output_example}
      </Text>
      <TouchableOpacity
        onPress={() => handleSelectChallenge(item)}
        style={{
          padding: 10,
          borderColor: Colors.violet,
          borderWidth: 0.5,
          borderRadius: 50,
          backgroundColor: Colors.violet,
        }}>
        <Text
          style={{
            color: Colors.white,
            textAlign: 'center',
            // letterSpacing: 1,
            fontSize: width * 0.033,
            // fontWeight: '700',
            fontFamily: Font.SemiBold,
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
        <Text style={{fontSize: width * 0.05, fontFamily: Font.Medium}}>
          Language: {selectedChallengeTopic?.ChallengeName}
        </Text>
      </View>
      {/* challenge list */}
      <View style={{paddingHorizontal: 10, borderWidth: 0, flex: 1}}>
        <FlatList
          initialNumToRender={2}
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
