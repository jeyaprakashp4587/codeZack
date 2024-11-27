import React, {useEffect, useState, useCallback} from 'react';
import {Dimensions, Text, ToastAndroid, View, Animated} from 'react-native';
import Ripple from 'react-native-material-ripple';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';
import useShakeAnimation from '../hooks/useShakeAnimation';
import AddWallet from '../hooks/AddWallet';
import {useData} from '../Context/Contexter';
import {Colors} from '../constants/Colors';
import {debounce} from 'lodash';

const DailyClaim = () => {
  const {width, height} = Dimensions.get('window');
  const {user, setUser} = useData();
  const shakeInterpolation = useShakeAnimation(3000);

  // States for timer and button
  const [isDisabled, setIsDisabled] = useState(false); // Initially disabled
  const [timer, setTimer] = useState(30); // 30-second timer on mount

  // Google Ads Interstitial configuration
  const {
    show: showIntrestAdd,
    isLoaded: loadedIntrestAdd,
    load: loadIntrestAdd,
    isClosed: closedIntrestAdd,
  } = useInterstitialAd(
    __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3257747925516984/2804627935',
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );

  // Load the interstitial ad
  useEffect(() => {
    loadIntrestAdd();
  }, [loadIntrestAdd]);

  // Reload ad when closed
  useEffect(() => {
    if (closedIntrestAdd) {
      loadIntrestAdd();
    }
  }, [closedIntrestAdd]);

  // Timer logic for countdown on mount
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setIsDisabled(true); // Enable the button when timer ends
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);
  // check
  // this is for check day
  const checkButtonStatus = async () => {
    const lastCheckIn = await AsyncStorage.getItem('lastCheckIn');
    if (lastCheckIn) {
      const lastCheckInDate = moment(lastCheckIn);
      const now = moment();
      setIsDisabled(lastCheckInDate.isSame(now, 'day'));
    }
  };
  const debouncedFunctions = useCallback(
    debounce(() => {
      checkButtonStatus();
    }, 300), // 300 ms debounce delay, adjust as needed
    [],
  );
  useFocusEffect(debouncedFunctions);
  // Handle claim action
  const handleCheckIn = useCallback(async () => {
    await showIntrestAdd();
    if (isDisabled) {
      ToastAndroid.show('You have already checked', ToastAndroid.SHORT);
      return;
    }

    if (!loadedIntrestAdd) {
      ToastAndroid.show(
        'Ad is still loading. Please wait.',
        ToastAndroid.SHORT,
      );
      return;
    }

    const now = moment().toISOString();
    await AsyncStorage.setItem('lastCheckIn', now);

    const result = await AddWallet(user?._id, 1, setUser);
    if (result === 'ok') {
      await showIntrestAdd();
      ToastAndroid.show('You earned 1 rupee!', ToastAndroid.SHORT);
      setIsDisabled(true); // Disable the button again after claiming
    } else {
      ToastAndroid.show('Failed to add to wallet.', ToastAndroid.SHORT);
    }
  }, [isDisabled, user, setUser, loadedIntrestAdd]);

  return (
    <Animated.View
      style={{
        transform: [{translateX: isDisabled ? 0 : shakeInterpolation}],
      }}>
      <Ripple
        onPress={handleCheckIn}
        disabled={!isDisabled}
        style={{
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 5,
          borderWidth: 1,
          borderColor: '#3d405b',
          height: height * 0.03,
          paddingHorizontal: 10,
          justifyContent: 'center',
          backgroundColor: !isDisabled ? Colors.veryLightGrey : '#fff',
        }}>
        <Text
          style={{
            color: '#14213d',
            letterSpacing: 2,
            fontSize: width * 0.02,
          }}>
          {!isDisabled ? `Daily Check In (Wait ${timer}s)` : 'Daily Check In'}
        </Text>
        {!isDisabled ? (
          <Feather name="clock" color="red" />
        ) : (
          <Feather name="check" color="#3d405b" />
        )}
      </Ripple>
    </Animated.View>
  );
};

export default DailyClaim;
