import React, {useEffect, useState} from 'react';
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
} from 'react-native';

import {useData} from '../Context/Contexter';
import {Colors, font, pageView} from '../constants/Colors';
import Skeleton from '../Skeletons/Skeleton';
import Ripple from 'react-native-material-ripple';
import TopicsText from '../utils/TopicsText';
import PragraphText from '../utils/PragraphText';
import Api from '../Api';
import axios from 'axios';
import Actitivity from '../hooks/ActivityHook';
import AddWallet from '../hooks/AddWallet';

const {width, height} = Dimensions.get('window');

const SelectedCourse = ({navigation}) => {
  const {selectedCourse, user, setUser} = useData();

  const HandleAddCourse = async () => {
    try {
      // Send request to add course
      const res = await axios.post(`${Api}/Courses/addCourse`, {
        courseName: selectedCourse.name,
        userId: user?._id,
      });

      // Check if the response contains user data (Email field presence indicates success)
      if (res.data.Email) {
        // Update user data and show success alert
        await AddWallet(user?._id, 2, setUser);
        ToastAndroid.show(
          'Course added sucessfully and earned Rs:2',
          ToastAndroid.SHORT,
        );
        setUser(res.data);
        Actitivity(user?._id, `${selectedCourse.name} Added`);
        // Navigate to course details screen
        navigation.navigate('courseDetails');
      } else if (res.data == 'Enrolled') {
        // Handle the case where the course couldn't be added (server returned an error message)
        ToastAndroid.show(
          'You are already enrolled in this course',
          ToastAndroid.BOTTOM,
        );
        navigation.navigate('courseDetails');
      }
    } catch (error) {
      // Handle network errors or other unforeseen issues
      console.error('Error adding course:', error);
      Alert.alert(
        'Error',
        'An error occurred while adding the course. Please try again.',
      );
    }
  };

  return (
    <ScrollView style={styles.pageView} showsVerticalScrollIndicator={false}>
      <Text style={styles.courseName}>{selectedCourse?.name}</Text>
      {selectedCourse?.img ? (
        <Image source={{uri: selectedCourse?.img}} style={styles.courseImage} />
      ) : (
        <Skeleton width={width * 0.9} height={250} />
      )}
      <View style={styles.section}>
        <TopicsText text="Course Intro" mb={2} />
        <PragraphText text={selectedCourse?.introduction} />
      </View>
      <View style={styles.section}>
        <TopicsText text="Technologies" mb={20} />
        <View style={styles.technologiesContainer}>
          {selectedCourse?.technologies.map((icon, index) => (
            <TouchableOpacity key={index}>{icon.icon}</TouchableOpacity>
          ))}
        </View>
      </View>
      <Ripple
        rippleColor={Colors.violet}
        rippleOpacity={1}
        style={styles.button}
        onPress={HandleAddCourse}>
        <Text style={styles.buttonText}>Let's Begin</Text>
      </Ripple>
    </ScrollView>
  );
};

export default React.memo(SelectedCourse);

const styles = StyleSheet.create({
  pageView: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#fff',
  },
  courseName: {
    fontSize: width * 0.065,
    color: Colors.mildGrey,
    fontFamily: font.poppins,
    marginBottom: height * 0.02,
  },
  courseImage: {
    width: '90%',
    height: 250,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: height * 0.02,
  },
  section: {
    marginVertical: height * 0.015,
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
    columnGap: width * 0.08,
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: height * 0.015,
    borderRadius: 5,
    borderColor: '#004080',
    elevation: 2,
    width: width * 0.5,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    marginTop: height * 0.03,
    marginBottom: height * 0.03,
  },
  buttonText: {
    color: Colors.mildGrey,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
