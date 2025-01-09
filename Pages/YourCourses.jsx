import React, {useCallback, useState, useMemo, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
} from 'react-native';

import HeadingText from '../utils/HeadingText';
import {Colors, pageView} from '../constants/Colors';
import {useData} from '../Context/Contexter';
import {LinearGradient} from 'react-native-linear-gradient';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCode} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {challengesApi} from '../Api';
import {ScrollView} from 'react-native';
import {RefreshControl} from 'react-native';
import BannerAdd from '../Adds/BannerAdd';
import PragraphText from '../utils/PragraphText';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const YourCourses = () => {
  const {user, setUser} = useData();

  const color = useMemo(
    () => [
      {color1: '#F7E7CD', color2: '#F7E7CD'},
      {color1: '#DDD8F6', color2: '#DDD8F6'},
      {color1: '#EA96AD', color2: '#EA96AD'},
      {color1: '#b3b3ff', color2: '#e6e6ff'},
      {color1: '#ffb3ff', color2: '#ffe6ff'},
      {color1: '#b3e6cc', color2: '#ecf9f2'},
      {color1: '#b3e6cc', color2: '#ecf9f2'},
      {color1: '#b3e6cc', color2: '#ecf9f2'},
    ],
    [],
  ); // Memoize colors to prevent unnecessary re-calculations
  const navigation = useNavigation();
  const HandleRemoveCourse = useCallback(
    async crName => {
      try {
        const res = await axios.post(`${challengesApi}/Courses/removeCourse`, {
          userId: user?._id,
          CourseName: crName,
        });

        if (res.status === 200) {
          setUser(prev => ({...prev, Courses: res.data.course}));
        }
      } catch (error) {
        console.error('Error removing course:', error);
        // Handle the error (e.g., show notification to user)
      }
    },
    [user?._id, setUser],
  );

  const [refresh, setRefresh] = useState(false);
  // console.log(user?.Courses[0]?.Technologies);
  // get user courses
  const getCourses = useCallback(async () => {
    try {
      const {status, data} = await axios.get(
        `${challengesApi}/Courses/getCourses/${user?._id}`,
      );
      if (status === 200) {
        setUser(prev => ({...prev, Courses: data.Courses}));
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  }, []);
  // splist course
  const [leftWrapper, setLeftWrapper] = useState([]);
  const [rightWrapper, setRightWrapper] = useState([]);
  // focus effect
  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      getCourses().then(data => {
        const left = [];
        const right = [];
        data?.Courses?.forEach((item, index) => {
          if (index % 2 === 0) {
            left.push(item);
          } else {
            right.push(item);
          }
        });
        setLeftWrapper(left);
        setRightWrapper(right);
      });
    });
    return () => {
      navigation.removeListener('focus', focusListener);
    };
  }, [getCourses, navigation]);

  const HandleRefresh = useCallback(() => {
    setRefresh(true);
    getCourses().finally(() => {
      setRefresh(false);
    });
  }, []);

  return (
    <View style={pageView}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Your Courses" />
      </View>
      {/* wrappers */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 15}}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={HandleRefresh} />
        }>
        {user?.Courses.length <= 0 ? (
          <View>
            <FastImage
              source={{
                uri: 'https://i.ibb.co/z2yHfJ0/35496095-2211-w026-n002-2760-B-p1-2760.jpg',
              }}
              style={{
                width: width * 0.9,
                height: height * 0.3,
                // aspectRatio: 1,
                alignSelf: 'center',
              }}
              resizeMode="contain"
            />
            <Text style={styles.noCoursesText}>You Have No Courses</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('carrerScreen')}
              style={{
                borderWidth: 0.8,
                padding: 15,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                borderColor: Colors.lightGrey,
                marginTop: 20,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  letterSpacing: 0.5,
                  fontSize: width * 0.031,
                }}>
                Select course
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <FlatList
              data={leftWrapper}
              keyExtractor={(item, index) => `left-${index}`}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onLongPress={() => HandleRemoveCourse(item?.Course_Name)}
                  style={[
                    styles.courseContainer,
                    {
                      backgroundColor: color[index % color.length].color1, // Apply dynamic background color
                      borderColor: color[index % color.length].color2, // Apply dynamic border color
                    },
                  ]}>
                  <View style={{flexDirection: 'column', rowGap: 5}}>
                    <Text style={styles.courseName}>{item?.Course_Name}</Text>
                    {item?.Technologies.map((tech, index) => (
                      <View key={index} style={styles.techWrapper}>
                        <Text style={styles.techName}>{tech?.TechName}</Text>
                        <Text style={styles.techPoints}>
                          Points( {tech?.Points} / 10 )
                        </Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              )}
            />
            <FlatList
              data={rightWrapper}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onLongPress={() => HandleRemoveCourse(item?.Course_Name)}
                  style={[
                    styles.courseContainer,
                    {
                      backgroundColor: color[index % color.length].color1, // Apply dynamic background color
                      borderColor: color[index % color.length].color2, // Apply dynamic border color
                    },
                  ]}>
                  <View style={{flexDirection: 'column', rowGap: 5}}>
                    <Text style={styles.courseName}>{item?.Course_Name}</Text>
                    {item?.Technologies.map((tech, index) => (
                      <View key={index} style={styles.techWrapper}>
                        <Text style={styles.techName}>{tech?.TechName}</Text>
                        <Text style={styles.techPoints}>
                          Points( {tech?.Points} / 10 )
                        </Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>
      {/* add */}
      <BannerAdd />
    </View>
  );
};

export default React.memo(YourCourses);

const styles = StyleSheet.create({
  courseContainer: {
    // width: '100%',
    height: 'auto',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
  },
  courseName: {
    fontSize: width * 0.04, // 5% of screen width
    fontWeight: '700',
    color: Colors.veryDarkGrey,
    letterSpacing: 1,
  },
  techWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  techName: {
    textTransform: 'capitalize',
    fontSize: width * 0.04, // 4% of screen width
    letterSpacing: 1,
  },
  techPoints: {
    fontWeight: '700',
    letterSpacing: 1,
  },
  noCoursesText: {
    fontSize: width * 0.04, // 4% of screen width
    textAlign: 'center',
  },
  infoText: {
    color: Colors.mildGrey,
    fontSize: width * 0.04, // 4% of screen width
    letterSpacing: 1,
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 30,
    marginBottom: 20,
  },
  infoHighlight: {
    color: 'orange',
    fontSize: width * 0.05, // 5% of screen width
  },
  messageSystem: {
    color: Colors.veryDarkGrey,
  },
});
