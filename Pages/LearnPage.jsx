import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Dimensions, ToastAndroid} from 'react-native';
import {WebView} from 'react-native-webview';
import {Colors} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';
import {useData} from '../Context/Contexter';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Skeleton from '../Skeletons/Skeleton';

const {width, height} = Dimensions.get('window');

const LearnPage = () => {
  const {selectedTechnology} = useData();

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
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [minutes, seconds]);

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

      <WebView
        javaScriptEnabled
        source={{uri: selectedTechnology?.web}}
        style={styles.webview}
      />
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
    fontFamily: 'Poppins-Light',
  },
  webview: {
    height: height * 0.75,
  },
});
