import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';
import {Colors, font, pageView} from '../constants/Colors';
import {useData} from '../Context/Contexter';
import {Dimensions} from 'react-native';
import Skeleton from '../Skeletons/Skeleton';
import {useNavigation} from '@react-navigation/native';
import BannerAdd from '../Adds/BannerAdd';
import HeadingText from '../utils/HeadingText';
import axios from 'axios';
import {challengesApi} from '../Api';
const {width, height} = Dimensions.get('window');
const Carrer = () => {
  // courses list
  const navigation = useNavigation();
  const {setSelectedCourse} = useData();
  const [courses, setCourses] = useState([]);
  // get all courses from db
  const getCourses = useCallback(async () => {
    const {data, status} = await axios.get(
      `${challengesApi}/Courses/getAllCourses`,
    );
    if (status == 200) {
      setCourses(data.Course);
    }
  }, []);
  // render skeleton

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getCourses().finally(() => {
      setLoading(true);
    });
  }, []);
  if (!loading) {
    return (
      <View style={pageView}>
        <Skeleton width="100%" height={height * 0.06} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.5} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.1} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.1} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.1} radius={10} mt={10} />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{backgroundColor: 'white'}}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Choose Your Learning Carrer" />
        <Image
          source={{uri: 'https://i.ibb.co/vDwVGnW/carrer.jpg'}}
          style={{
            ...styles.careerImage,
            width: width * 0.7,
            height: width * 0.7,
          }}
        />
      </View>
      {/* Banner */}
      <BannerAdd />
      {/* Banner */}
      <View style={styles.courseContainer}>
        <FlatList
          data={courses}
          keyExtractor={(_, index) => index}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedCourse(item);
                navigation.navigate('course');
              }}
              key={index}
              style={{
                ...styles.courseButton,
                width: '98%',
                backgroundColor: 'white',
                marginBottom: 20,
                borderColor: item.bgColor,
                elevation: 2,
                marginHorizontal: 'auto',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: item?.bgColor,
                  fontWeight: '600',
                  letterSpacing: 1,
                }}>
                {item?.name}
              </Text>
              <View style={{flexDirection: 'row', columnGap: 10}}>
                {item?.technologies?.map(tech => (
                  <Image
                    source={{uri: tech.icon}}
                    style={{width: 30, height: 30}}
                  />
                ))}
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <Text style={styles.footerText}>Other Courses will be added soon!</Text>
    </ScrollView>
  );
};

export default React.memo(Carrer);

const styles = StyleSheet.create({
  pageView: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  titleText: {
    fontFamily: font.poppins,
    color: Colors.mildGrey,
    fontSize: 25,
    // textAlign: 'center',
    marginBottom: 20,
  },
  careerImage: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  courseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 35,
    marginTop: 20,
  },
  courseButton: {
    height: height * 0.15,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    flexDirection: 'column',
    // rowGap: 10,
    // borderRadius: 6,
  },
  courseButtonText: {
    fontFamily: font.poppins,
    color: 'white',
    textAlign: 'center',
    fontSize: width * 0.04,
    letterSpacing: 1.3,
  },
  footerText: {
    textAlign: 'center',
    padding: 20,
    fontSize: width * 0.03,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
