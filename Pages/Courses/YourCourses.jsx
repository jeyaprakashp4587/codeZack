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
import HeadingText from '../../utils/HeadingText';
import {Colors, pageView} from '../../constants/Colors';
import {useData} from '../../Context/Contexter';
import axios from 'axios';
import {challengesApi} from '../../Api';
import {ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import Ripple from 'react-native-material-ripple';
import {Modal} from 'react-native-paper';
import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';
import {Font} from '../../constants/Font';

const {width, height} = Dimensions.get('window');

const YourCourses = () => {
  const {user, setUser, setselectedTechnology} = useData();
  const color = useMemo(
    () => [
      {color1: 'rgba(241, 229, 159, 0.53)', color2: '#F7E7CD'},
      {color1: 'rgba(170, 155, 226, 0.42)', color2: '#DDD8F6'},
      {color1: 'rgba(159, 185, 241, 0.53)', color2: '#a8dadc'},
      {color1: 'rgba(173, 241, 159, 0.53)', color2: '#98c1d9'},
      {color1: 'rgba(241, 159, 159, 0.53)', color2: '#abc4ff'},
      {color1: 'rgba(159, 236, 241, 0.53)', color2: '#ecf9f2'},
      {color1: '#b3e6cc', color2: '#ecf9f2'},
      {color1: '#b3e6cc', color2: '#ecf9f2'},
    ],
    [],
  ); // Memoize colors to prevent unnecessary re-calculations
  const navigation = useNavigation();

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
  const levels = ['beginner', 'intermediate', 'advanced'];
  const [showTech, setShowTech] = useState(false);
  const [selectTechs, setSelectedTechs] = useState([]);
  const hideModal = useCallback(() => setShowTech(false), []);
  const showTechs = useCallback(async techs => {
    setShowTech(true);
    setSelectedTechs(techs);
  }, []);
  // load and destructure intrestial add
  const {load, show, isClosed, isLoaded} = useInterstitialAd(
    __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3257747925516984/9392069002',
    {requestNonPersonalizedAdsOnly: true},
  );
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (isClosed) {
      load();
    }
  }, [isClosed, load]);
  // navigate to learn page after select tech and show add
  const handleNavLearn = useCallback(
    async tech => {
      try {
        navigation.navigate('learn');
        setselectedTechnology({icon: tech.TechIcon, name: tech.TechName});
        if (isLoaded) {
          await show();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [isLoaded, show],
  );

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
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // borderWidth: 1,
              flex: 1,
              height: height,
              rowGap: 15,
            }}>
            <FastImage
              source={{
                uri: 'https://i.ibb.co/MDYKYTtm/8724495-3968350.jpg',
              }}
              style={{
                width: width * 0.7,
                aspectRatio: 1,
                alignSelf: 'center',
                borderRadius: 10,
              }}
              resizeMode="contain"
            />
            <Text style={styles.noCoursesText}>You have no courses</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('carrerScreen')}
              style={{
                borderWidth: 0.8,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                borderColor: Colors.violet,
                backgroundColor: Colors.violet,
                width: '60%',
                height: height * 0.06,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: width * 0.035,
                  fontFamily: Font.Medium,
                  color: Colors.white,
                }}>
                Select Course
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={user?.Courses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                // onLongPress={() => HandleRemoveCourse(item?.Course_Name)}
                style={[
                  styles.courseContainer,
                  {
                    backgroundColor: color[index % color.length].color1, // Apply dynamic background
                  },
                ]}>
                <View style={{flexDirection: 'column', rowGap: 5}}>
                  <Text style={styles.courseName}>{item?.Course_Name}</Text>
                  {item?.Technologies.map((tech, index) => (
                    <View key={index} style={styles.techWrapper}>
                      <FastImage
                        priority={FastImage.priority.high}
                        source={{uri: tech?.TechIcon}}
                        style={{width: width * 0.1, aspectRatio: 1}}
                        resizeMode="contain"
                      />
                      <Text style={styles.techName}>{tech?.TechName}</Text>
                      <Text style={styles.techPoints}>
                        {levels.length - 1 == tech?.TechCurrentLevel &&
                        tech?.currentTopicLength >= 19
                          ? 'Completed'
                          : `Current Level: ${levels[tech?.TechCurrentLevel]}`}
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
                    // borderWidth: 1,
                    backgroundColor: 'rgba(245, 245, 245, 0.51)',
                  }}>
                  <Text
                    style={{
                      // fontWeight: '600',
                      letterSpacing: 1,
                      color: Colors.veryDarkGrey,
                      fontSize: width * 0.035,
                      fontFamily: Font.Medium,
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
        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 20,
          width: '80%',
          margin: 'auto',
          borderRadius: 20,
        }}>
        {selectTechs?.map((tech, index) => (
          <TouchableOpacity
            onPress={() => handleNavLearn(tech)}
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 5,
              marginBottom: 10,
              padding: 10,
              borderRadius: 5,
              backgroundColor: 'white',
              borderLeftWidth: 0,
              borderWidth: 0,
              borderTopWidth: index == 1 ? 0.5 : 0,
              borderBottomWidth: index == 1 ? 0.5 : 0,
              borderColor: Colors.veryLightGrey,
            }}>
            <FastImage
              priority={FastImage.priority.high}
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
    // borderWidth: 1,
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
    fontSize: width * 0.04,
    // letterSpacing: 1,
    fontFamily: Font.SemiBold,
  },
  techPoints: {
    fontSize: width * 0.03,
    fontFamily: Font.SemiBold,
  },
  noCoursesText: {
    fontSize: width * 0.04,
    textAlign: 'center',
    fontFamily: Font.Medium,
  },
  infoText: {
    color: Colors.mildGrey,
    fontSize: width * 0.04, // 4% of screen width
    letterSpacing: 1,
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 30,
    marginBottom: 20,
    fontFamily: Font.Regular,
  },
  infoHighlight: {
    color: 'orange',
    fontSize: width * 0.05, // 5% of screen width
  },
  messageSystem: {
    color: Colors.veryDarkGrey,
  },
});
