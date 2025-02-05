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
  ActivityIndicator,
} from 'react-native';

import {useData} from '../Context/Contexter';
import {Colors, font, pageView} from '../constants/Colors';
import Skeleton from '../Skeletons/Skeleton';
import Ripple from 'react-native-material-ripple';
import TopicsText from '../utils/TopicsText';
import PragraphText from '../utils/PragraphText';
import {challengesApi} from '../Api';
import axios from 'axios';
import Actitivity from '../hooks/ActivityHook';
import HeadingText from '../utils/HeadingText';
import FastImage from 'react-native-fast-image';

const {width, height} = Dimensions.get('window');

const SelectedCourse = ({navigation}) => {
  const {selectedCourse, user, setUser} = useData();
  // console.log(selectedCourse);
  const [loading, setLoading] = useState(false);
  const HandleAddCourse = async () => {
    // console.log(user);

    setLoading(true);
    try {
      // Send request to add course
      const res = await axios.post(`${challengesApi}/Courses/addCourse`, {
        courseName: selectedCourse.name,
        userId: user?._id,
      });

      // Check if the response contains user data (Email field presence indicates success)
      if (res.data != 'Enrolled') {
        // Update user data and show success alert
        setLoading(false);
        setUser(prev => ({...prev, Courses: res.data.courses}));
        try {
          await Actitivity(user?._id, `${selectedCourse.name} Added`);
        } catch (error) {
          console.log(error);
        }

        // Navigate to course details screen
        navigation.navigate('courseDetails');
      } else if (res.data == 'Enrolled') {
        setLoading(false);
        // Handle the case where the course couldn't be added (server returned an error message)
        ToastAndroid.show(
          'You are already enrolled in this course',
          ToastAndroid.BOTTOM,
        );
        navigation.navigate('courseDetails');
      }
    } catch (error) {
      setLoading(false);
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
      <View
        style={{
          // borderWidth: 1,
          borderColor: 'red',
          flex: 1,
          height: height * 0.92,
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <View
          style={{
            paddingHorizontal: 15,
            flex: 1,
          }}>
          <HeadingText text={selectedCourse?.name} />
        </View>
        {selectedCourse?.img ? (
          <FastImage
            source={{uri: selectedCourse?.img}}
            style={styles.courseImage}
            priority={FastImage.priority.high}
          />
        ) : (
          <Skeleton width={width * 0.9} height={250} />
        )}
        <View style={styles.section}>
          <TopicsText
            text="Course Intro"
            mb={2}
            color="black"
            fszie={height * 0.024}
            fontWeight={900}
          />
          <PragraphText text={selectedCourse?.introduction} fsize={13} />
        </View>
        <View style={{paddingHorizontal: 15}}>
          <TopicsText
            text="Technologies"
            mb={20}
            color="black"
            fszie={width * 0.04}
          />
          <View style={styles.technologiesContainer}>
            {selectedCourse?.technologies.map((icon, index) => (
              <FastImage
                source={{uri: icon.icon}}
                style={{width: 30, height: 30}}
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
            <ActivityIndicator color={Colors.mildGrey} size={17} />
          ) : (
            <Text style={styles.buttonText}>Let's Begin</Text>
          )}
        </Ripple>
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
    fontSize: width * 0.065,
    color: Colors.mildGrey,
    fontFamily: font.poppins,
    marginBottom: height * 0.02,
    paddingHorizontal: 15,
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
    paddingHorizontal: 15,
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
    // borderWidth: 1,
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
    padding: height * 0.015,
    borderRadius: 5,
    borderColor: '#004080',
    elevation: 2,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    marginTop: height * 0.03,
    marginBottom: height * 0.03,
    // paddingHorizontal: 25,
    columnGap: 10,
    width: width * 0.5,
  },
  buttonText: {
    color: Colors.mildGrey,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
