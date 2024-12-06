import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, View, Image} from 'react-native';
import {Dimensions} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {ScrollView} from 'react-native';
import {Colors, pageView} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';
import HrLine from '../utils/HrLine';
import {profileApi} from '../Api';
import axios from 'axios';
import {useData} from '../Context/Contexter';
const {width, height} = Dimensions.get('window');
import ParagraphText from '../utils/PragraphText';
import Skeleton from '../Skeletons/Skeleton';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BannerAdd from '../Adds/BannerAdd';

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
        `${profileApi}/Challenges/getUserChallenge/${user?._id}`,
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
    setSkLoad(false); // Reset loading state
    getChallenges(option); // Fetch challenges based on the selected option
  };
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
        <Ripple
          onPress={() => HandleOption('All')}
          style={{
            padding: 10,
            elevation: 3,
            // borderWidth: 1,
            backgroundColor: 'white',
            borderRadius: 5,
          }}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: width * 0.03,
              letterSpacing: 1,
            }}>
            All Challenges
          </Text>
        </Ripple>
        <Ripple
          onPress={() => HandleOption('Complete')}
          style={{
            padding: 10,
            elevation: 3,
            // borderWidth: 1,
            backgroundColor: 'white',
            borderRadius: 5,
          }}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: width * 0.03,
              letterSpacing: 1,
            }}>
            Completed
          </Text>
        </Ripple>
        <Ripple
          onPress={() => HandleOption('Pending')}
          style={{
            padding: 10,
            elevation: 3,
            backgroundColor: 'white',
            borderRadius: 5,
          }}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: width * 0.03,
              letterSpacing: 1,
            }}>
            In Progress
          </Text>
        </Ripple>
      </View>
      {/* add banner */}
      <BannerAdd />
      {/* add banner */}
      <HrLine width="100%" />
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
          <Text style={{fontSize: 20, letterSpacing: 1, paddingHorizontal: 15}}>
            Nothing Is There!
          </Text>
        )
      ) : (
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
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
                <ParagraphText
                  text={item?.ChallengeName}
                  fsize={height * 0.021}
                  padding={5}
                  widht="70%"
                />
                <ParagraphText
                  text={
                    item?.ChallengeLevel
                      ? item?.ChallengeLevel
                      : item?.ChallengeLevel
                  }
                  fsize={height * 0.017}
                  padding={5}
                  color="orange"
                />
              </View>
              {item?.ChallengeLevel !== 'newbie' && (
                <Image
                  source={{uri: item?.ChallengeImage}}
                  style={styles.challengeImage}
                />
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
                    color: Colors.lightGrey,
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
    // rowGap: 10,
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
  challengeImage: {
    width: '100%',
    height: height * 0.35, // Responsive height
    alignSelf: 'center',
    resizeMode: 'contain',
    borderRadius: 20,
  },
});
