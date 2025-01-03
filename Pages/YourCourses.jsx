import React, {useCallback, useState, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

import HeadingText from '../utils/HeadingText';
import {Colors, pageView} from '../constants/Colors';
import {useData} from '../Context/Contexter';
import {LinearGradient} from 'react-native-linear-gradient';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCode} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {profileApi} from '../Api';
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
      {color1: '#ffb3b3', color2: '#ffe6e6'},
      {color1: '#b3d9ff', color2: '#e6f2ff'},
      {color1: '#b3e6cc', color2: '#ecf9f2'},
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
        const res = await axios.post(`${profileApi}/Courses/removeCourse`, {
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

  const HandleRefresh = useCallback(() => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
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
          user?.Courses.map((course, index) => (
            <LinearGradient
              key={index}
              colors={[
                color[index % color.length].color1,
                color[index % color.length].color2,
              ]}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              style={styles.courseWrapper}>
              <TouchableOpacity
                onLongPress={() => HandleRemoveCourse(course.Course_Name)}
                style={styles.courseContainer}>
                <View style={{flexDirection: 'column', rowGap: 5}}>
                  <Text style={styles.courseName}>{course.Course_Name}</Text>
                  {course.Technologies.map((tech, index) => (
                    <View key={index} style={styles.techWrapper}>
                      <Text style={styles.techName}>{tech.TechName}</Text>
                      <Text style={styles.techPoints}>
                        Points( {tech?.Points} / 10 )
                      </Text>
                    </View>
                  ))}
                </View>
                <FontAwesomeIcon
                  icon={faCode}
                  color={Colors.veryLightGrey}
                  size={50}
                />
              </TouchableOpacity>
            </LinearGradient>
          ))
        )}
      </ScrollView>
      {/* add */}
      <BannerAdd />
    </View>
  );
};

export default React.memo(YourCourses);

const styles = StyleSheet.create({
  courseWrapper: {
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
    marginHorizontal: 3,
    padding: width * 0.05, // 5% of screen width
  },
  courseContainer: {
    width: '100%',
    height: 'auto',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
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
