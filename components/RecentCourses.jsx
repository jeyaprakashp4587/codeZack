import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import TopicsText from '../utils/TopicsText';
import {useData} from '../Context/Contexter';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../constants/Colors';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {Font} from '../constants/Font';
import PragraphText from '../utils/PragraphText';
import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';

const RecentCourses = () => {
  const {width, height} = Dimensions.get('window');
  const {user, setselectedTechnology} = useData();
  const levels = ['beginner', 'intermediate', 'advanced'];
  const navigation = useNavigation();
  const [newCourseIndex, setNewCourseIndex] = useState(null);
  // load intrestial add
  const {load, isClosed, show, isLoaded} = useInterstitialAd(
    __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3257747925516984/9392069002',
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (isClosed) {
      load();
    }
  }, [isClosed]);
  useEffect(() => {
    if (user?.Courses) {
      const index =
        user.Courses[user.Courses.length - 1]?.Technologies?.length <= 0
          ? user?.Courses?.length - 2
          : user?.Courses?.length - 1;
      setNewCourseIndex(index);
    }
  }, [user?.Courses]);
  // get percentage
  const getProgressPercentage = (
    currentTopicLength,
    totalTopicsPerLevel = 20,
  ) => {
    return Math.round((currentTopicLength / totalTopicsPerLevel) * 100);
  };

  if (user?.Courses?.length == 0) {
    return null;
  }
  return (
    <View style={{paddingHorizontal: 15}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // borderWidth: 1,
          marginBottom: 10,
        }}>
        <Text
          style={{
            fontFamily: Font.Medium,
            fontSize: width * 0.041,
            letterSpacing: 0.25,
            color: Colors.veryDarkGrey,
          }}>
          Your recent courses
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('yourcourse')}>
          <Text
            style={{
              letterSpacing: 0.3,
              fontSize: width * 0.03,
              color: Colors.veryDarkGrey,
              fontFamily: Font.Medium,
              textDecorationLine: 'underline',
            }}>
            See all
          </Text>
        </TouchableOpacity>
      </View>
      <LinearGradient
        colors={['rgba(127, 208, 233, 0.65)', 'rgba(159,126,205,0.65)']}
        style={{
          padding: 20,
          borderRadius: 10,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          rowGap: 10,
        }}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}>
        {/* <Text
          style={{
            fontSize: width * 0.04,
            fontFamily: Font.Medium,
            textAlign: 'left',
            width: '100%',
            color: Colors.violet,
          }}>
          {user.Courses[newCourseIndex]?.Course_Name}
        </Text> */}
        <FlatList
          initialNumToRender={2}
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          data={user.Courses[newCourseIndex]?.Technologies}
          horizontal
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => {
                if (isLoaded) {
                  show();
                }
                navigation.navigate('learn');
                setselectedTechnology({
                  name: item.TechName,
                  icon: item.TechIcon,
                });
              }}
              key={index}
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                columnGap: 5,
                marginRight: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.07)',
                borderRadius: 10,
                padding: 10,
                justifyContent: 'center',
              }}>
              <FastImage
                priority={FastImage.priority.high}
                source={{uri: item?.TechIcon}}
                style={{width: width * 0.12, aspectRatio: 1}}
                resizeMode="contain"
              />
              <View>
                {levels.map((level, levelIndex) => {
                  const isCurrentLevel = item.TechCurrentLevel === levelIndex;
                  let currentLength;
                  let BarColor;
                  let txtColor;
                  if (levelIndex < item.TechCurrentLevel) {
                    currentLength = 100;
                    txtColor = 'rgb(18, 18, 19)';
                    BarColor = '#34D399';
                  } else if (isCurrentLevel) {
                    currentLength = item.currentTopicLength;
                    txtColor = '#111827';
                    BarColor = '#34D399';
                  } else {
                    currentLength = 0;
                    txtColor = 'rgb(111, 111, 114)';
                  }
                  const progress = getProgressPercentage(currentLength);

                  return (
                    <View
                      key={levelIndex}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        columnGap: 5,
                        marginVertical: 2,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          textTransform: 'capitalize',
                          fontFamily: Font.Medium,
                          fontSize: width * 0.034,
                          color: txtColor,
                        }}>
                        {level}
                      </Text>
                      <View
                        style={{
                          width: width * 0.3,
                          height: 8,
                          borderRadius: 100,
                          backgroundColor: 'rgba(48, 46, 46, 0.05)',
                          overflow: 'hidden',
                        }}>
                        <View
                          style={{
                            backgroundColor: BarColor,
                            width: `${progress}%`,
                            height: '100%',
                            borderRadius: 100,
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: width * 0.03,
                          color: txtColor,
                        }}>
                        {isCurrentLevel ? `${progress}%` : `${currentLength}%`}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </TouchableOpacity>
          )}
        />
      </LinearGradient>
    </View>
  );
};

export default RecentCourses;

const styles = StyleSheet.create({});
