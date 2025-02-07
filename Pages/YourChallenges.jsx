import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, View, Image} from 'react-native';
import {Dimensions} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {ScrollView} from 'react-native';
import {Colors, pageView} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';
import HrLine from '../utils/HrLine';
import {challengesApi} from '../Api';
import axios from 'axios';
import {useData} from '../Context/Contexter';
const {width, height} = Dimensions.get('window');
import ParagraphText from '../utils/PragraphText';
import Skeleton from '../Skeletons/Skeleton';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const YourChallenges = props => {
  const navigation = useNavigation();
  const {setSelectedChallenge} = useData();
  const {width, height} = Dimensions.get('window');
  const {user} = useData();
  const [challenges, setChallenges] = useState(null); // Initially null
  const [skLoad, setSkLoad] = useState(false); // Loading state

  // Fetch challenges from the database
  const getChallenges = async option => {
    try {
      const res = await axios.post(
        `${challengesApi}/Challenges/getUserChallenge/${user?._id}`,
        {option: option},
      );
      if (res.data) {
        setLoading(true);
        setChallenges(res.data);
        setSkLoad(true);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  // Fetch challenges when the screen is focused
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setSkLoad(false); // Reset loading state
      getChallenges('All'); // Fetch all challenges when the screen comes into focus
    });

    // Optional: Clear challenges when leaving the screen
    const unsubscribeBlur = navigation.addListener('blur', () => {
      setChallenges(null); // Clear challenges on leaving the screen
    });

    // Cleanup the listeners on component unmount
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  // Handle option change
  const HandleOption = option => {
    // console.log(option);

    setSkLoad(false); // Reset loading state
    getChallenges(option); // Fetch challenges based on the selected option
  };
  // const challenges oprion
  const options = useMemo(
    () => [
      {
        Name: 'All',
        route: 'All',
        color: '#a2d2ff',
      },
      {
        Name: 'Pending',
        route: 'Pending',
        color: '#fcd5ce',
      },
      {
        Name: 'Completed',
        route: 'Complete',
        color: '#e9ecef',
      },
    ],
    [],
  );
  // render skeleton
  const [loading, setLoading] = useState(false);
  if (!loading) {
    return (
      <View style={pageView}>
        <Skeleton width="100%" height={height * 0.06} radius={10} mt={10} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Skeleton
            width={width * 0.25}
            height={height * 0.06}
            radius={10}
            mt={10}
          />
          <Skeleton
            width={width * 0.25}
            height={height * 0.06}
            radius={10}
            mt={10}
          />
          <Skeleton
            width={width * 0.25}
            height={height * 0.06}
            radius={10}
            mt={10}
          />
        </View>
        <Skeleton width="100%" height={height * 0.3} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.3} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.3} radius={10} mt={10} />
      </View>
    );
  }
  //  ---------
  return (
    <View style={[pageView, {borderWidth: 0}]}>
      {/* header options */}
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Your Challenges" mb={1} />
      </View>
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          //   borderWidth: 1,
          height: height * 0.05,
          marginBottom: 5,
          marginHorizontal: 5,
          columnGap: 20,
          paddingHorizontal: 15,
        }}>
        {options.map(item => (
          <TouchableOpacity onPress={() => HandleOption(item.route)}>
            <Text
              style={{
                letterSpacing: 1,
                fontSize: width * 0.03,
                paddingVertical: 5,
                paddingHorizontal: 15,
                // borderWidth: 1,
                borderBottomWidth: 1,
                borderRadius: 50,
                borderColor: item.color,
              }}>
              {item.Name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* list challenges */}
      {challenges?.length <= 0 ? (
        !skLoad ? (
          <View style={{rowGap: 10, paddingHorizontal: 15}}>
            <Skeleton width="100%" height={200} radius={10} />
            <Skeleton width="100%" height={200} radius={10} />
            <Skeleton width="100%" height={200} radius={10} />
            <Skeleton width="100%" height={200} radius={10} />
            <Skeleton width="100%" height={200} radius={10} />
          </View>
        ) : (
          <View>
            <Text
              style={{
                letterSpacing: 2,
                paddingHorizontal: 15,
                fontSize: width * 0.03,
                color: 'black',
                fontWeight: '600',
              }}>
              Nothing Is There!
            </Text>
            <Ripple
              onPress={() => navigation.navigate('Code')}
              style={{
                borderWidth: 0.5,
                padding: 10,
                marginHorizontal: 15,
                marginTop: 20,
                borderRadius: 5,
                borderColor: Colors.lightGrey,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  letterSpacing: 1,
                  fontWeight: '400',
                  fontSize: width * 0.025,
                  color: Colors.mildGrey,
                }}>
                Choose Challenges
              </Text>
            </Ripple>
          </View>
        )
      ) : (
        <FlatList
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item?._id}
          data={challenges}
          style={{borderWidth: 0}}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedChallenge(item);
                navigation.navigate('challengeDetail');
              }}
              style={styles.challengeContainer}
              key={index}>
              <View style={styles.challengeHeader}>
                <Text
                  style={{
                    fontSize: width * 0.045,
                    fontWeight: '600',
                    color: 'black',
                    maxWidth: '80%',
                    lineHeight: 25,
                  }}>
                  {item?.ChallengeName}
                </Text>
                <Text
                  style={{
                    color: 'orange',
                    fontWeight: '600',
                    fontSize: width * 0.03,
                  }}>
                  {item?.ChallengeLevel}
                </Text>
              </View>
              {item?.ChallengeLevel !== 'newbie' && (
                <View style={{borderWidth: 0, height: height * 0.3}}>
                  <FastImage
                    priority={FastImage.priority.high}
                    source={{uri: item?.ChallengeImage}}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="center"
                  />
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: height * 0.018,
                    letterSpacing: 1,
                    color: Colors.mildGrey,
                  }}>
                  {item?.ChallengeType}
                </Text>
                <Text
                  style={{
                    fontSize: height * 0.018,
                    letterSpacing: 1,
                    color: Colors.violet,
                  }}>
                  {item?.status}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default React.memo(YourChallenges);

const styles = StyleSheet.create({
  challengeContainer: {
    flexDirection: 'column',
    rowGap: 10,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 2,
    marginTop: 5,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
