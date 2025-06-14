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
  if (user?.Courses?.length == 0) {
    return null;
  }
  return (
    <View style={{paddingHorizontal: 15}}>
      <Text
        style={{
          fontFamily: Font.Medium,
          fontSize: width * 0.041,
          marginBottom: 10,
          letterSpacing: 0.25,
        }}>
        {/* {user?.Courses[newCourseIndex]?.Course_Name} */}
        Your recent courses
      </Text>
      <LinearGradient
        colors={['rgba(127, 208, 233, 0.65)', 'rgba(159,126,205,0.65)']}
        style={{padding: 20, borderRadius: 10}}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}>
        <FlatList
          initialNumToRender={2}
          nestedScrollEnabled={true}
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
                });
              }}
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 5,
                marginRight: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                borderRadius: 100,
                padding: 10,
              }}>
              <FastImage
                priority={FastImage.priority.high}
                source={{uri: item?.TechIcon}}
                style={{width: width * 0.1, aspectRatio: 1}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        />
      </LinearGradient>
    </View>
  );
};

export default RecentCourses;

const styles = StyleSheet.create({});
