import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {Colors, font, pageView} from '../../constants/Colors';
import {useData} from '../../Context/Contexter';
import HeadingText from '../../utils/HeadingText';
import TopicsText from '../../utils/TopicsText';
import axios from 'axios';
import {challengesApi} from '../../Api';
import Actitivity from '../../hooks/ActivityHook';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';
import {Font} from '../../constants/Font';

const {width, height} = Dimensions.get('window');

const CourseDetails = () => {
  const {selectedCourse, setselectedTechnology, user, setUser} = useData();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  // init add load
  const {
    load: loadInterest,
    isClosed: interestClosed,
    show: showInterest,
    isLoaded: interestIsLoaded,
  } = useInterstitialAd(
    __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3257747925516984/9392069002',
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );
  useEffect(() => {
    loadInterest();
  }, [loadInterest]);
  useEffect(() => {
    if (interestClosed) {
      loadInterest();
    }
  }, [interestClosed, loadInterest]);
  const HandleCourse = useCallback(
    async item => {
      try {
        setLoading(true);
        // Make the API request to add the course technology
        const res = await axios.post(`${challengesApi}/Courses/addTech`, {
          TechName: item.name,
          CourseName: selectedCourse.name,
          TechIcon: item.icon,
          TechWeb: item.web,
          UserId: user?._id,
        });

        // Check the response
        if (res.data != 'Enrolled') {
          // Set the selected technology
          setselectedTechnology({web: item.web, name: item.name});
          if (interestIsLoaded) {
            showInterest();
          }
          // Navigate to "learn" screen immediately
          navigation.navigate('learn');
          setUser(prev => ({...prev, Courses: res.data.Tech}));
          ToastAndroid.show(
            'Technology Added Successfully',
            ToastAndroid.BOTTOM,
          );
          setLoading(false);
          // Log the activity if course is successfully added
          try {
            await Actitivity(user?._id, `${item.name} Successfully Added.`);
          } catch (error) {
            // console.log(error);
          }
        } else if (res.data == 'Enrolled') {
          ToastAndroid.show(
            'You are already enrolled in this Tool',
            ToastAndroid.BOTTOM,
          );
          setselectedTechnology({web: item.web, name: item.name});
          // Navigate to "learn" screen immediately
          navigation.navigate('learn');
          setLoading(false);
        }
      } catch (error) {
        // Catch and handle any errors
        setLoading(false);
        ToastAndroid.show('Error adding course', ToastAndroid.SHORT);
      }
    },
    [selectedCourse, setselectedTechnology, user, setUser, navigation, loading],
  );

  return (
    <View style={styles.container}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Course Details" />
      </View>
      <FlatList
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        data={selectedCourse?.technologies}
        renderItem={({item, index}) => (
          <View key={index} style={styles.courseItem}>
            <View style={styles.iconContainer}>
              <FastImage
                priority={FastImage.priority.high}
                source={{uri: item?.icon}}
                style={{width: width * 0.5, aspectRatio: 1}}
              />
            </View>
            <Text
              style={{
                fontSize: width * 0.04,
                letterSpacing: 1,
                lineHeight: height * 0.035,
                color: Colors.mildGrey,
                fontFamily: Font.Medium,
              }}>
              {item.details}
            </Text>
            <View>
              <TopicsText text="Concepts" color={Colors.veryDarkGrey} />
              {item.basics.map((basic, index) => (
                <Text key={index} style={styles.basicText}>
                  <Text style={styles.asterisk}> * </Text>
                  {basic}
                </Text>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => HandleCourse(item)}
              style={{
                backgroundColor: Colors.violet,
                borderRadius: 90,
                width: '100%',
                padding: 10,
                borderWidth: 0.8,
                borderColor: Colors.violet,
              }}>
              {loading ? (
                <ActivityIndicator color={Colors.white} size={25} />
              ) : (
                <Text
                  style={{
                    color: Colors.white,
                    textAlign: 'center',
                    letterSpacing: 1,
                    fontSize: width * 0.05,
                    fontFamily: Font.Medium,
                  }}>
                  Start
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // paddingHorizontal: ,
  },
  courseItem: {
    marginBottom: 50,
    padding: 10,
    rowGap: 20,
    borderRadius: 5,
    // borderWidth: 1,
    borderColor: Colors.veryLightGrey,
    paddingHorizontal: 15,
  },
  iconContainer: {
    alignSelf: 'center',
  },
  basicText: {
    color: Colors.veryDarkGrey,
    fontSize: width * 0.038,
    lineHeight: 27,
    letterSpacing: 0.9,
    paddingVertical: 10,
    fontFamily: Font.Regular,
  },
  asterisk: {
    color: 'orange',
    fontWeight: '700',
    fontSize: width * 0.03,
  },
});

export default React.memo(CourseDetails);
