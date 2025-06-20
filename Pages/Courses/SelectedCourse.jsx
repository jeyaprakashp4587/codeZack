import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import {useData} from '../../Context/Contexter';
import {Colors, font, pageView} from '../../constants/Colors';
import Skeleton from '../../Skeletons/Skeleton';
import Ripple from 'react-native-material-ripple';
import TopicsText from '../../utils/TopicsText';
import PragraphText from '../../utils/PragraphText';
import {challengesApi} from '../../Api';
import axios from 'axios';
import Actitivity from '../../hooks/ActivityHook';
import HeadingText from '../../utils/HeadingText';
import FastImage from 'react-native-fast-image';
import {Font} from '../../constants/Font';
import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';
import LinearGradient from 'react-native-linear-gradient';
const {width, height} = Dimensions.get('window');

const SelectedCourse = ({navigation}) => {
  const {selectedCourse, user, setUser} = useData();
  // console.log(selectedCourse);
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
  const [loading, setLoading] = useState(false);

  const HandleAddCourse = useCallback(async () => {
    setLoading(true);
    try {
      if (interestIsLoaded) {
        await showInterest();
      }

      const res = await axios.post(`${challengesApi}/Courses/addCourse`, {
        courseName: selectedCourse.name,
        userId: user?._id,
      });

      if (res.data !== 'Enrolled') {
        const updatedCourses = res.data.courses;

        setUser(prev => {
          if (!updatedCourses || !Array.isArray(updatedCourses)) return prev;
          return {
            ...prev,
            Courses: updatedCourses,
          };
        });

        try {
          await Actitivity(user?._id, `${selectedCourse.name} Added`);
        } catch (err) {
          console.log(err);
        }

        navigation.navigate('courseDetails');
      } else {
        ToastAndroid.show(
          'You are already enrolled in this course',
          ToastAndroid.SHORT,
        );
        navigation.navigate('courseDetails');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      Alert.alert(
        'Error',
        'An error occurred while adding the course. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [user, selectedCourse, interestIsLoaded, navigation]);
  return (
    <ScrollView style={styles.pageView} showsVerticalScrollIndicator={false}>
      {/* heading text */}
      <View
        style={{
          paddingHorizontal: 15,
        }}>
        <HeadingText text="Selected course" />
      </View>
      {/* Body content */}
      <View style={{borderWidth: 0, flex: 1}}>
        <FastImage
          source={{uri: selectedCourse?.img, priority: FastImage.priority.high}}
          resizeMode="contain"
          style={{
            width: width * 0.9,
            aspectRatio: 1,
            // borderWidth: 1,
            alignSelf: 'center',
          }}
        />
        <View style={styles.section}>
          <View style={{borderWidth: 0, rowGap: 5}}>
            <Text
              style={{
                fontSize: width * 0.05,
                fontFamily: Font.SemiBold,
                flexWrap: 'wrap',
              }}>
              Course Name:
            </Text>
            <Text
              style={{
                fontSize: width * 0.05,
                fontFamily: Font.SemiBold,
                flexWrap: 'wrap',
              }}>
              {selectedCourse?.name}
            </Text>
          </View>
          <View style={{borderWidth: 0, rowGap: 5}}>
            <Text
              style={{
                fontSize: width * 0.05,
                fontFamily: Font.SemiBold,
                flexWrap: 'wrap',
              }}>
              Context:
            </Text>
            <Text
              style={{
                fontSize: width * 0.035,
                color: Colors.veryDarkGrey,
                fontFamily: Font.Regular,
                letterSpacing: 0.3,
                lineHeight: 25,
              }}>
              {selectedCourse?.introduction}
            </Text>
          </View>
          <View style={{borderWidth: 0, rowGap: 5}}>
            <Text
              style={{
                fontSize: width * 0.05,
                fontFamily: Font.SemiBold,
                flexWrap: 'wrap',
              }}>
              Technologies:
            </Text>
            <View style={styles.technologiesContainer}>
              {selectedCourse?.technologies.map((icon, index) => (
                <FastImage
                  key={index}
                  source={{uri: icon.icon}}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  resizeMode="contain"
                />
              ))}
            </View>
          </View>
          <Ripple
            rippleColor={Colors.violet}
            rippleOpacity={1}
            style={styles.button}
            onPress={HandleAddCourse}>
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Let's begin</Text>
            )}
          </Ripple>
        </View>
      </View>
    </ScrollView>
  );
};

export default React.memo(SelectedCourse);

const styles = StyleSheet.create({
  pageView: {
    flex: 1,
    backgroundColor: '#fff',
    // borderWidth: 1,
    borderColor: 'red',
  },
  courseName: {
    fontSize: width * 0.08,
    color: Colors.mildGrey,
    fontFamily: Font.Medium,
    // marginBottom: height * 0.02,
    paddingHorizontal: 15,
  },
  courseImage: {
    width: width * 0.6,
    alignSelf: 'center',
    marginBottom: height * 0.02,
    aspectRatio: 1,
    // borderWidth: 1,
  },
  section: {
    marginVertical: height * 0.015,
    paddingHorizontal: 15,
    rowGap: 13,
  },
  sectionTitle: {
    color: Colors.mildGrey,
    fontSize: width * 0.06,
    paddingVertical: height * 0.01,
  },
  sectionText: {
    color: Colors.lightGrey,
    fontSize: width * 0.04,
    letterSpacing: 0.8,
    lineHeight: height * 0.04,
  },
  technologiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    columnGap: 10,
  },
  webviewContainer: {
    height: 250,
    borderColor: Colors.lightGrey,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: height * 0.03,
    alignSelf: 'center',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: height * 0.015,
    borderRadius: 50,
    borderColor: Colors.violet,
    elevation: 2,
    alignSelf: 'center',
    backgroundColor: Colors.violet,
    borderWidth: 1,
    columnGap: 10,
    width: width * 0.9,
    fontFamily: Font.Regular,
    overflow: 'hidden',
    height: height * 0.065,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: Font.Medium,
    fontSize: width * 0.043,
  },
});
