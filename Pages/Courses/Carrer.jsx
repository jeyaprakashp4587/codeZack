import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  InteractionManager,
} from 'react-native';
import {Colors, font, pageView} from '../../constants/Colors';
import {useData} from '../../Context/Contexter';
import {Dimensions} from 'react-native';
import Skeleton from '../../Skeletons/Skeleton';
import {useNavigation} from '@react-navigation/native';
import HeadingText from '../../utils/HeadingText';
import axios from 'axios';
import {challengesApi} from '../../Api';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';

const {width, height} = Dimensions.get('window');
const Carrer = () => {
  // courses list update from git log
  const navigation = useNavigation();
  const {setSelectedCourse} = useData();
  const [courses, setCourses] = useState([]);
  // get all courses from db
  const getCourses = useCallback(async () => {
    try {
      const {data, status} = await axios.get(
        `${challengesApi}/Courses/getAllCourses`,
      );
      if (status == 200) {
        setCourses(data.Course);
      }
    } catch (error) {}
  }, []);
  // render skeleton
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      getCourses().finally(() => {
        setLoading(true);
      });
    });
    return () => task.cancel();
  }, []);
  if (!loading) {
    return (
      <View style={[pageView, {paddingHorizontal: 15}]}>
        <Skeleton width="100%" height={height * 0.1} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.1} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.1} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.1} radius={10} mt={10} />
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
        <HeadingText text="Choose Your Course" />
      </View>
      <View style={styles.courseContainer}>
        <FlatList
          nestedScrollEnabled={true}
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
                overflow: 'hidden',
                borderRadius: 5,
                backgroundColor: 'white',
                padding: 15,
                flexDirection: 'column',
                rowGap: 10,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                borderBottomWidth: index == courses.length - 1 ? 0 : 1,
                borderColor: Colors.veryLightGrey,
                marginTop: 10,
              }}>
              <FastImage
                source={{uri: item?.img}}
                style={{
                  width: 150,
                  height: 150,
                  position: 'absolute',
                  right: -40,
                  top: 0,
                  opacity: 0.08,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: Colors.veryDarkGrey,
                  // fontWeight: '700',
                  fontSize: width * 0.039,
                  letterSpacing: 0.5,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                {item?.name}
              </Text>
              <View style={{flexDirection: 'row', columnGap: 10}}>
                {item?.technologies?.map(tech => (
                  <FastImage
                    priority={FastImage.priority.high}
                    source={{uri: tech.icon}}
                    style={{width: 20, height: 20}}
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
    fontFamily: 'Poppins-Light',
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
    fontFamily: 'Poppins-Light',
  },
  footerText: {
    textAlign: 'center',
    padding: 20,
    fontSize: width * 0.03,
    // fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 1,
  },
});
