import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Dimensions, ToastAndroid} from 'react-native';

import {WebView} from 'react-native-webview';
import {Colors, pageView} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';
import {useData} from '../Context/Contexter';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Skeleton from '../Skeletons/Skeleton';
import BannerAdd from '../Adds/BannerAdd';
import AddWallet from '../hooks/AddWallet';

const {width, height} = Dimensions.get('window');

const LearnPage = () => {
  const {selectedTechnology, user, setUser} = useData();
  // time
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    let interval = null;

    if (hours > 0 || minutes > 0 || seconds > 0) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prevSeconds => prevSeconds - 1);
        } else if (minutes > 0) {
          setMinutes(prevMinutes => prevMinutes - 1);
          setSeconds(59);
        } else if (hours > 0) {
          setHours(prevHours => prevHours - 1);
          setMinutes(59);
          setSeconds(59);
        }

        // Check if the timer has just gone below 15 minutes
        if (minutes === 15 && seconds === 0) {
          AddWallet(user?._id, 5, setUser).then(() => {
            ToastAndroid.show('Congrats! You earned Rs:5', ToastAndroid.SHORT);
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
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
            <MaterialCommunityIcons
              name="timer-outline"
              size={width * 0.06}
              color={Colors.mildGrey}
            />
            <Text style={styles.timerText}>
              {hours}:{minutes < 10 ? `0${minutes}` : minutes}:
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
    // paddingHorizontal: width * 0.05,
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
