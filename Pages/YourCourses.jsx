import React, {useCallback, useState, useMemo, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import HeadingText from '../utils/HeadingText';
import {Colors, pageView} from '../constants/Colors';
import {useData} from '../Context/Contexter';
import axios from 'axios';
import {challengesApi} from '../Api';
import {ScrollView} from 'react-native';

import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import Ripple from 'react-native-material-ripple';
import {Modal} from 'react-native-paper';

const {width, height} = Dimensions.get('window');

const YourCourses = () => {
  const {user, setUser, setselectedTechnology} = useData();

  const color = useMemo(
    () => [
      {color1: '#F7E7CD', color2: '#F7E7CD'},
      {color1: '#DDD8F6', color2: '#DDD8F6'},
      {color1: '#a8dadc', color2: '#a8dadc'},
      {color1: '#98c1d9', color2: '#98c1d9'},
      {color1: '#abc4ff', color2: '#abc4ff'},
      {color1: '#b3e6cc', color2: '#ecf9f2'},
      {color1: '#b3e6cc', color2: '#ecf9f2'},
      {color1: '#b3e6cc', color2: '#ecf9f2'},
    ],
    [],
  ); // Memoize colors to prevent unnecessary re-calculations
  const navigation = useNavigation();
  // const HandleRemoveCourse = useCallback(
  //   async crName => {
  //     try {
  //       const res = await axios.post(`${challengesApi}/Courses/removeCourse`, {
  //         userId: user?._id,
  //         CourseName: crName,
  //       });

  //       if (res.status === 200) {
  //         setUser(prev => ({...prev, Courses: res.data.course}));
  //       }
  //     } catch (error) {
  //       console.error('Error removing course:', error);
  //       // Handle the error (e.g., show notification to user)
  //     }
  //   },
  //   [user?._id, setUser],
  // );

  const [refresh, setRefresh] = useState(false);
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
  // focus effect
  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      // getCourses();
    });
    return () => {
      navigation.removeListener('focus', focusListener);
    };
  }, [navigation]);

  const HandleRefresh = useCallback(() => {
    setRefresh(true);
    // getCourses().finally(() => {
    //   setRefresh(false);
    // });
  }, []);
  // techs
  const [showTech, setShowTech] = useState(false);
  const [selectTechs, setSelectedTechs] = useState([]);
  const hideModal = () => setShowTech(false);
  const showTechs = useCallback(async techs => {
    setShowTech(true);
    setSelectedTechs(techs);
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
        // refreshControl={
        //   <RefreshControl refreshing={refresh} onRefresh={HandleRefresh} />
        // }
      >
        {user?.Courses?.length <= 0 ? (
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
          <FlatList
            nestedScrollEnabled={true}
            data={user?.Courses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                // onLongPress={() => HandleRemoveCourse(item?.Course_Name)}
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
                      <Image
                        source={{uri: tech?.TechIcon}}
                        style={{width: width * 0.06, aspectRatio: 1}}
                      />
                      <Text style={styles.techName}>{tech?.TechName}</Text>
                      <Text style={styles.techPoints}>
                        Points ({tech?.Points}/10)
                      </Text>
                    </View>
                  ))}
                </View>
                <Ripple
                  onPress={() => showTechs(item?.Technologies)}
                  style={{
                    padding: 5,
                    borderWidth: 0.7,
                    paddingHorizontal: 20,
                    borderRadius: 50,
                    borderWidth: 0,
                    borderColor: Colors.mildGrey,
                    borderWidth: 1,
                  }}>
                  <Text
                    style={{
                      fontWeight: '600',
                      letterSpacing: 1,
                    }}>
                    Continue
                  </Text>
                </Ripple>
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>
      {/* model for select tech and navigate to learn section */}
      <Modal
        visible={showTech}
        onDismiss={hideModal}
        anima
        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 20,
          width: '80%',
          margin: 'auto',
        }}>
        {selectTechs?.map((tech, index) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('learn');
              setselectedTechnology({web: tech.TechWeb, name: tech.TechName});
            }}
            key={index}
            style={{
              // borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 5,
              marginBottom: 10,
              padding: 10,
              borderRadius: 5,
              backgroundColor: 'white',
              elevation: 2,
            }}>
            <Image
              source={{uri: tech?.TechIcon}}
              style={{width: width * 0.08, aspectRatio: 1}}
            />
            <Text style={styles.techName}>{tech?.TechName}</Text>
          </TouchableOpacity>
        ))}
      </Modal>
    </View>
  );
};

export default React.memo(YourCourses);

const styles = StyleSheet.create({
  courseContainer: {
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    rowGap: 10,
  },
  courseName: {
    fontSize: width * 0.035,
    fontWeight: '700',
    color: Colors.veryDarkGrey,
    letterSpacing: 1,
  },
  techWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    flexWrap: 'wrap',
  },
  techName: {
    textTransform: 'capitalize',
    fontSize: width * 0.03,
    letterSpacing: 1,
  },
  techPoints: {
    fontWeight: '700',
    letterSpacing: 1,
    fontSize: width * 0.03,
  },
  noCoursesText: {
    fontSize: width * 0.04,
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
