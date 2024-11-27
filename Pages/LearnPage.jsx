import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Dimensions, ToastAndroid} from 'react-native';
import {WebView} from 'react-native-webview';
import {Colors} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';
import {useData} from '../Context/Contexter';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Skeleton from '../Skeletons/Skeleton';
import BannerAdd from '../Adds/BannerAdd';
import AddWallet from '../hooks/AddWallet';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import {profileApi} from '../Api';

const {width, height} = Dimensions.get('window');

const LearnPage = () => {
  const {selectedTechnology, user, setUser} = useData();

  // Timer states
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds === 59) {
          setMinutes(prevMinutes => {
            if (prevMinutes === 59) {
              setHours(prevHours => prevHours + 1);
              return 0;
            }
            return prevMinutes + 1;
          });
          return 0;
        }
        return prevSeconds + 1;
      });

      // Reward logic: Reward user every 15 minutes
      if (minutes === 15 && seconds === 0) {
        AddWallet(user?._id, 5, setUser).then(() => {
          ToastAndroid.show('Congrats! You earned Rs:5', ToastAndroid.SHORT);
        });
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [minutes, seconds]);

  // Detect when the screen becomes inactive
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) {
      sendSpendTime(); // Send time to the server
    }
  }, [isFocused]);

  // Function to send total time (in minutes) to the server
  const sendSpendTime = useCallback(async () => {
    const totalMinutes = hours * 60 + minutes + Math.floor(seconds / 60); // Convert time to total minutes
    try {
      const res = await axios.post(`${profileApi}/Wallet/saveSpendTime`, {
        userId: user?._id,
        Time: totalMinutes,
      });
      if (res.status == 200) {
        res.status(200).json({data: user?.TotalStudyTime});
        setUser(prev => ({...prev, TotalStudyTime: res.data.data}));
      }
      // console.log('Time sent to server:', totalMinutes, res.data);
    } catch (error) {
      // console.error('Error sending time to server:', error);
    }
  }, [hours, minutes, seconds]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeadingText text="Study Area" />
        <View style={styles.headerRight}>
          <SimpleLineIcons
            name="note"
            size={width * 0.06}
            color={Colors.mildGrey}
          />
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {hours < 10 ? `0${hours}` : hours}:
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </Text>
          </View>
        </View>
      </View>
      <View style={{height: height * 0.02}} />
      {/* add */}
      <BannerAdd />
      {/* add */}
      {selectedTechnology?.web ? (
        <WebView
          javaScriptEnabled
          source={{uri: selectedTechnology.web}}
          style={styles.webview}
        />
      ) : (
        <Skeleton width={width * 0.5} height={height * 0.25} />
      )}
    </View>
  );
};

export default React.memo(LearnPage);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
  },
  headerRight: {
    flexDirection: 'row',
    columnGap: width * 0.025,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    borderWidth: 0,
    minWidth: width * 0.2,
    textAlign: 'left',
    color: 'orange',
    fontSize: width * 0.045,
  },
  webview: {
    height: height * 0.75,
  },
});
