import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ToastAndroid,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {Colors} from '../../constants/Colors';
import HeadingText from '../../utils/HeadingText';
import {useData} from '../../Context/Contexter';
import {Font} from '../../constants/Font';
import axios from 'axios';
import {challengesApi} from '../../Api';
import StudyBoxUi from '../../components/StudyBoxUi';
import FastImage from 'react-native-fast-image';
import Skeleton from '../../Skeletons/Skeleton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Modal} from 'react-native-paper';

const {width, height} = Dimensions.get('window');

const LearnPage = () => {
  const {selectedTechnology, user} = useData();
  const levels = useMemo(() => ['beginner', 'intermediate', 'advanced'], []);
  const [toggle, setToggle] = useState('level');
  const [courseData, setCourseData] = useState([]);
  const [topicLength, setTopicLength] = useState(0);
  const [topicLevel, setTopicLevel] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [load, setLoad] = useState({
    uiload: false,
    boxLoad: false,
    completedUi: false,
    save: false,
  });

  // Fetch user topic progress
  const findTopicLength = useCallback(async () => {
    try {
      const userCourse = user?.Courses?.find(course =>
        course?.Technologies?.some(
          tech => tech?.TechName === selectedTechnology?.name,
        ),
      );

      if (userCourse) {
        const userTech = userCourse.Technologies.find(
          tech => tech?.TechName === selectedTechnology?.name,
        );

        if (userTech) {
          const levelIndex = userTech.TechCurrentLevel || 0;
          const currentTopicLen = userTech.currentTopicLength || 0;
          setTopicLength(currentTopicLen);
          setTopicLevel(levelIndex);
          // Check if course is finished
          if (userTech.TechStatus === 'completed') {
            setLoad(prev => ({...prev, completedUi: true, uiload: false}));
            setIsCompleted(true);
            return {TopicLevel: levelIndex, TopicLength: currentTopicLen};
          }
          return {TopicLevel: levelIndex};
        }
      }
      return {TopicLevel: 0};
    } catch (error) {
      ToastAndroid.show('Error finding user topics', ToastAndroid.SHORT);
      return {TopicLevel: 0};
    }
  }, []);

  // Fetch course data
  const getTechCourse = useCallback(async levelIndex => {
    try {
      setLoad(prev => ({...prev, uiload: true}));
      const res = await axios.get(`${challengesApi}/Courses/getTechCourse`, {
        params: {
          TechName: selectedTechnology?.name?.toLowerCase(),
          level: levels[levelIndex],
        },
      });

      if (res.status === 200 && res.data?.courseData) {
        setCourseData(res.data.courseData);
        setLoad(prev => ({...prev, uiload: false}));
      }
    } catch (error) {
      ToastAndroid.show('Error fetching topics', ToastAndroid.SHORT);
    }
  }, []);

  // Move to next topic
  const handleTopicLength = useCallback(async () => {
    if (topicLength >= courseData.length - 1) {
      await saveTopicsLength();
      return;
    }
    setLoad(prev => ({...prev, boxLoad: true}));
    setIsSaved(false);

    const delay = setTimeout(() => {
      setTopicLength(prev => prev + 1);
      setLoad(prev => ({...prev, boxLoad: false}));
    }, 600);

    return () => clearTimeout(delay);
  }, [topicLength, courseData]);

  // Save current topic progress
  const saveTopicsLength = useCallback(async () => {
    try {
      console.log(topicLength, topicLevel);

      setLoad(prev => ({...prev, save: true}));
      const res = await axios.post(`${challengesApi}/Courses/setTopicLength`, {
        Topiclength: topicLength + 1,
        userId: user?._id,
        TechName: selectedTechnology?.name,
      });

      if (res.status === 200) {
        if (topicLength >= courseData.length - 1) {
          await handleSetTopicLevel();
        }
        setIsSaved(true);
        setLoad(prev => ({...prev, save: false}));
      }
    } catch (error) {
      ToastAndroid.show('Failed to update topic length', ToastAndroid.SHORT);
    }
  }, [topicLength, courseData, user, selectedTechnology]);

  // Advance topic level
  const handleSetTopicLevel = useCallback(async () => {
    try {
      setLoad(prev => ({...prev, uiload: true}));
      const isLastLevel = topicLevel >= levels.length - 1;
      const res = await axios.post(`${challengesApi}/Courses/setTopicLevel`, {
        TopicLevel: isLastLevel ? topicLevel : topicLevel + 1,
        userId: user?._id,
        TechName: selectedTechnology?.name,
        TopicLength: isLastLevel ? topicLength + 1 : 0,
        TechStatus: isLastLevel ? true : false,
      });

      if (res.status === 200) {
        setUser(prev => ({...prev, Course: res.data.newTech}));
        if (isLastLevel) {
          setLoad(prev => ({...prev, completedUi: true, uiload: false}));
        } else {
          setTopicLevel(prev => prev + 1);
          setTopicLength(0);
          if (!isLastLevel) {
            await getTechCourse(topicLevel + 1);
          }
          setLoad(prev => ({...prev, uiload: false}));
        }
      }
    } catch (error) {
      ToastAndroid.show('Failed to update topic level', ToastAndroid.SHORT);
    }
  }, [topicLevel, user, selectedTechnology, topicLength]);

  // Load on mount
  useEffect(() => {
    const loadData = async () => {
      const data = await findTopicLength();
      await getTechCourse(data.TopicLevel);
    };
    loadData();
  }, []);

  if (load.uiload) {
    return (
      <View style={{backgroundColor: Colors.white, flex: 1, rowGap: 15}}>
        <View style={styles.header}>
          <HeadingText text="Study Area" />
        </View>
        <Skeleton width={width} height={height * 0.1} />
        <Skeleton width={width} height={height * 0.4} />
        <Skeleton width={width} height={height * 0.3} />
        <Skeleton width={width} height={height * 0.3} />
      </View>
    );
  }

  if (load.completedUi) {
    return (
      <ImageBackground
        source={{uri: 'https://i.ibb.co/PGMhBBCv/v904-nunny-012-f.jpg'}}
        style={{
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        resizeMode="stretch">
        <View
          style={{
            backgroundColor: Colors.white,
            padding: 15,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            rowGap: 10,
          }}>
          <FastImage
            source={{
              uri: 'https://i.ibb.co/5gyVs2pg/raising-hand-concept-illustration.png',
              priority: FastImage.priority.high,
            }}
            style={{width: width * 0.7, aspectRatio: 1}}
          />
          <Text
            style={{
              fontSize: width * 0.07,
              textAlign: 'center',
              fontFamily: Font.SemiBold,
            }}>
            Congrats!
          </Text>
          <Text style={{fontFamily: Font.Medium, fontSize: width * 0.04}}>
            You finished {selectedTechnology?.name} course
          </Text>
          <TouchableOpacity
            onPress={() => {
              setLoad(prev => ({...prev, completedUi: false})),
                setTopicLength(0);
            }}
            style={{
              backgroundColor: Colors.violet,
              height: height * 0.056,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
              width: width * 0.5,
            }}>
            <Text
              style={{
                color: Colors.white,
                fontFamily: Font.Medium,
                fontSize: width * 0.034,
              }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeadingText text="Study Area" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{uri: 'https://i.ibb.co/PGMhBBCv/v904-nunny-012-f.jpg'}}
          style={styles.imageBackground}
          resizeMode="stretch"
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 15,
            // borderWidth: 1,
          }}>
          <View style={{flex: 1, rowGap: 10, borderWidth: 0}}>
            <Text
              style={{
                fontFamily: Font.SemiBold,
                fontSize: width * 0.05,
                textTransform: 'capitalize',
              }}>
              Level: {levels[topicLevel]}
            </Text>
            <View style={{flexDirection: 'row', borderWidth: 0}}>
              <TouchableOpacity
                style={styles.toggle}
                onPress={() => {
                  setToggle('level'), setShowToggle(true);
                }}>
                <Text
                  style={{
                    fontFamily: Font.SemiBold,
                    fontSize: width * 0.034,
                    textTransform: 'capitalize',
                  }}>
                  {levels[topicLevel]}
                </Text>
                <FontAwesome name="caret-down" size={width * 0.04} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toggle}
                onPress={() => {
                  setToggle('topic'), setShowToggle(true);
                }}>
                <Text
                  style={{
                    fontFamily: Font.SemiBold,
                    fontSize: width * 0.034,
                    textTransform: 'capitalize',
                  }}>
                  Topic
                </Text>
                <FontAwesome name="caret-down" size={width * 0.04} />
              </TouchableOpacity>
            </View>
          </View>
          <FastImage
            source={{
              uri: selectedTechnology?.icon,
              priority: FastImage.priority.high,
            }}
            style={{width: width * 0.3, aspectRatio: 1}}
            resizeMode="contain"
          />
        </View>
        <View style={styles.contentWrapper}>
          {load.boxLoad ? (
            <Skeleton width={width * 0.9} height={height * 0.8} radius={20} />
          ) : (
            <StudyBoxUi
              courseData={courseData}
              topicLength={topicLength}
              handleSetTopicsLength={handleTopicLength}
            />
          )}
          {/* show save button, */}
          {!isCompleted && (
            <TouchableOpacity
              onPress={saveTopicsLength}
              style={{
                backgroundColor: Colors.violet,
                height: height * 0.065,
                width: '100%',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {load.save ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    color: Colors.white,
                    fontFamily: Font.Medium,
                  }}>
                  {isSaved ? 'Saved' : 'Save your progress'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <Modal visible={showToggle} onDismiss={() => setShowToggle(false)}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            width: '80%',
            margin: 'auto',
            paddingVertical: 15,
          }}>
          {toggle == 'level' ? (
            levels.map((level, index) => {
              const enabledLevel = index <= topicLevel;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setShowToggle(false);
                  }}
                  style={{
                    borderColor: Colors.veryLightGrey,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomWidth: index == levels.length - 1 ? 0 : 0.8,
                    backgroundColor:
                      index == topicLevel ? 'rgb(26, 219, 123)' : 'white',
                  }}>
                  <Text
                    style={{
                      textTransform: 'capitalize',
                      fontSize: width * 0.04,
                      fontFamily: Font.Medium,
                    }}>
                    {level}
                  </Text>
                  {!enabledLevel && (
                    <FastImage
                      style={{width: width * 0.06, aspectRatio: 1}}
                      source={{
                        uri: 'https://i.ibb.co/Rp6m2rcP/padlock.png',
                        priority: FastImage.priority.high,
                      }}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              );
            })
          ) : (
            <FlatList
              data={courseData}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              scrollsToTop={true}
              // indicatorStyle="white"
              renderItem={({item, index}) => {
                const enabledLevel =
                  index <=
                  findTopicLength().then(data =>
                    data?.TopicLength > topicLength
                      ? data?.TopicLength
                      : topicLength,
                  );
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (enabledLevel) {
                        setTopicLength(index);
                      }
                      setShowToggle(false);
                    }}
                    style={{
                      borderBottomWidth:
                        index == courseData.length - 1 ? 0 : 0.8,
                      borderColor: Colors.veryLightGrey,
                      paddingVertical: 12,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor:
                        index == topicLength ? 'rgb(26, 219, 123)' : 'white',
                    }}>
                    <Text
                      style={{
                        textTransform: 'capitalize',
                        fontSize: width * 0.035,
                        fontFamily: Font.Medium,
                        width: '80%',
                      }}>
                      {item?.title}
                    </Text>
                    {!enabledLevel && !isCompleted && (
                      <FastImage
                        style={{width: width * 0.06, aspectRatio: 1}}
                        source={{
                          uri: 'https://i.ibb.co/Rp6m2rcP/padlock.png',
                          priority: FastImage.priority.high,
                        }}
                        resizeMode="contain"
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default React.memo(LearnPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  imageBackground: {
    padding: 20,
    width: '100%',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: height,
    zIndex: -100,
    right: -width * 0.15,
    opacity: 0.5,
  },
  toggle: {
    borderColor: 'rgba(23, 24, 23, 0.22)',
    borderWidth: 0.5,
    padding: 7,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    paddingHorizontal: 14,
  },
});
