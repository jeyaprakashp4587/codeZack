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
} from 'react-native';

import {Colors, pageView} from '../constants/Colors';
import {useData} from '../Context/Contexter';
import HeadingText from '../utils/HeadingText';
import TopicsText from '../utils/TopicsText';
import PragraphText from '../utils/PragraphText';
import axios from 'axios';
import Api from '../Api';
import Actitivity from '../hooks/ActivityHook';
import {useNavigation} from '@react-navigation/native';
import BannerAdd from '../Adds/BannerAdd';

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

  const HandleCourse = useCallback(
    async item => {
      try {
        // Set the selected technology
        setselectedTechnology({web: item.web, name: item.name});

        // Navigate to "learn" screen immediately
        navigation.navigate('learn');

        // Make the API request to add the course technology
        const res = await axios.post(`${Api}/Courses/addTech`, {
          TechName: item.name,
          CourseName: selectedCourse.name,
          UserId: user?._id,
        });

        // Check the response
        if (res.data.Email) {
          setUser(res.data);
          ToastAndroid.show(
            'Technology Added Successfully',
            ToastAndroid.BOTTOM,
          );
          // Log the activity if course is successfully added
          try {
            Actitivity(user?._id, `${selectedCourse.name} Successfully Added.`);
          } catch (error) {
            console.log(error);
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
        showsVerticalScrollIndicator={false}
        data={selectedCourse?.technologies}
        renderItem={({item, index}) => (
          <View key={index} style={styles.courseItem}>
            <View style={styles.iconContainer}>
              {React.cloneElement(item.icon, {size: 130})}
            </View>
            <PragraphText text={item.details} />
            <View>
              <TopicsText text="Concepts" />
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
                backgroundColor: '#7575a3',
                borderRadius: 10,
                width: '100%',
                padding: 10,
              }}>
              <Text
                style={{color: 'white', textAlign: 'center', letterSpacing: 1}}>
                Start
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {/* add */}
      <BannerAdd />
      {/* add */}
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
    borderWidth: 1,
    borderColor: Colors.veryLightGrey,
    paddingHorizontal: 15,
  },
  iconContainer: {
    alignSelf: 'center',
  },
  basicText: {
    color: Colors.mildGrey,
    fontSize: 16,
    lineHeight: 27,
    letterSpacing: 0.9,
    paddingVertical: 10,
  },
  asterisk: {
    color: 'orange',
    fontWeight: '700',
    fontSize: 20,
  },
});

export default React.memo(CourseDetails);
