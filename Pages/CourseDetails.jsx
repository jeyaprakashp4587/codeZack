import React, {useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  Image,
} from 'react-native';
import {Colors, pageView} from '../constants/Colors';
import {useData} from '../Context/Contexter';
import HeadingText from '../utils/HeadingText';
import TopicsText from '../utils/TopicsText';
import axios from 'axios';
import {challengesApi} from '../Api';
import Actitivity from '../hooks/ActivityHook';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const CourseDetails = () => {
  const {
    selectedCourse,
    setselectedTechnology,
    selectedTechnology,
    user,
    setUser,
  } = useData();
  const navigation = useNavigation();
  // console.log(user?.Courses[0]);
  // console.log(selectedCourse);

  const HandleCourse = useCallback(
    async item => {
      try {
        // Set the selected technology
        setselectedTechnology({web: item.web, name: item.name});
        // Navigate to "learn" screen immediately
        navigation.navigate('learn');

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
          setUser(prev => ({...prev, Courses: res.data.Tech}));
          ToastAndroid.show(
            'Technology Added Successfully',
            ToastAndroid.BOTTOM,
          );
          // Log the activity if course is successfully added
          try {
            await Actitivity(
              user?._id,
              `${selectedCourse.name} Successfully Added.`,
            );
          } catch (error) {
            // console.log(error);
          }
        } else if (res.data == 'Enrolled') {
          ToastAndroid.show(
            'You are already enrolled in this Tool',
            ToastAndroid.BOTTOM,
          );
        }
      } catch (error) {
        // Catch and handle any errors
        ToastAndroid.show('Error adding course');
      }
    },
    [selectedCourse, setselectedTechnology, user, setUser, navigation],
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
              <Image
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
                backgroundColor: 'white',
                borderRadius: 90,
                width: '100%',
                padding: 10,
                borderWidth: 0.8,
                borderColor: Colors.mildGrey,
              }}>
              <Text
                style={{color: 'black', textAlign: 'center', letterSpacing: 1}}>
                Start
              </Text>
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
    fontSize: width * 0.04,
    lineHeight: 27,
    letterSpacing: 0.9,
    paddingVertical: 10,
  },
  asterisk: {
    color: 'orange',
    fontWeight: '700',
    fontSize: width * 0.03,
  },
});

export default React.memo(CourseDetails);
