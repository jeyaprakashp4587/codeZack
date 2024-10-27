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
import Api from '../Api';
import {ScrollView} from 'react-native';
import {RefreshControl} from 'react-native';

const {width} = Dimensions.get('window');

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

  const HandleRemoveCourse = useCallback(
    async crName => {
      try {
        const res = await axios.post(`${Api}/Courses/removeCourse`, {
          userId: user?._id,
          CourseName: crName,
        });

        if (res.data.Email) {
          setUser(res.data);
        }
      } catch (error) {
        console.error('Error removing course:', error);
        // Handle the error (e.g., show notification to user)
      }
    },
    [user?._id, setUser],
  );

  const [refresh, setRefresh] = useState(false);

  const HandleRefresh = useCallback(() => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  }, []);

  return (
    <View style={pageView}>
      <HeadingText text="Your Courses" />
      {/* wrappers */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={HandleRefresh} />
        }>
        {user?.Courses.length <= 0 ? (
          <Text style={styles.noCoursesText}>You Have No Courses</Text>
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
                        Points( {tech.Points} / 10 )
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
        {/* tutorials */}
        <HeadingText text="Tutorials" />
        <Text style={styles.infoText}>
          <Text style={styles.infoHighlight}>*</Text> Long press the course
          wrapper to remove the course
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.infoHighlight}>*</Text> For you to earn 10 points,
          you must complete Assesments and earn points
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.infoHighlight}>*</Text> Once You reach 10 points
          then you will receive a certification and unlock the{' '}
          <Text style={styles.messageSystem}>(Message System)</Text>.
        </Text>
      </ScrollView>
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
