import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {useData} from '../Context/Contexter';
import {Font} from '../constants/Font';
import {Colors} from '../constants/Colors';
import {profileApi} from '../Api';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {TestIds, useRewardedAd} from 'react-native-google-mobile-ads';
const {width} = Dimensions.get('window');

const InterviewSucess = () => {
  const {selectedCompany, user, setUser} = useData();
  const navigate = useNavigation();
  const [loading, setLoading] = useState(false);
  // inint add
  const {
    load: loadReward,
    isClosed: rewardClosed,
    show: showReward,
    isLoaded: rewardIsLoaded,
  } = useRewardedAd(
    __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3257747925516984/2148003800',
    {requestNonPersonalizedAdsOnly: true},
  );
  useEffect(() => {
    loadReward(); // Load rewarded ad on initial render
  }, [loadReward]);

  useEffect(() => {
    if (rewardClosed) {
      loadReward(); // Reload ad if it's closed
    }
  }, [rewardClosed, loadReward]);
  // load reward and destructure Reward add
  // reset the user selected interview company
  const setQuestionLength = useCallback(async () => {
    try {
      setLoading(true);
      const {status, data} = await axios.post(
        `${profileApi}/InterView/setQuestionLength`,
        {
          userId: user?._id,
          companyName: selectedCompany?.company_name || selectedCompany,
          currentQuestion: 0,
          resetWeek: true,
        },
      );
      if (status === 200) {
        setUser(prev => ({...prev, InterView: data.InterView}));
        await showReward();
        navigate.replace('InterviewDetail');
        setLoading(false);
      }
    } catch (error) {
      ToastAndroid.show('Error loading Try Again', ToastAndroid.SHORT);
      console.error('Error sending question length:', error);
      setLoading(false);
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 20,
      }}>
      <FastImage
        source={{
          uri: 'https://i.ibb.co/hJQwxwfh/22908886-6736639.jpg',
          priority: FastImage.priority.high,
        }}
        resizeMode="contain"
        style={{width: 200, aspectRatio: 1}}
      />
      <Text
        style={{
          fontFamily: Font.Regular,
          fontSize: width * 0.045,
          letterSpacing: 0.4,
          textAlign: 'center',
          lineHeight: 30,
        }}>
        You are completed {selectedCompany?.company_name} InterView preparation.
      </Text>
      <TouchableOpacity
        onPress={setQuestionLength}
        style={{
          width: '80%',
          padding: 10,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.violet,
          borderRadius: 50,
        }}>
        {loading ? (
          <ActivityIndicator color={Colors.white} size={25} />
        ) : (
          <Text
            style={{
              textAlign: 'center',
              color: Colors.white,
              fontFamily: Font.Regular,
              letterSpacing: 0.4,
            }}>
            Prepare Again
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default InterviewSucess;
