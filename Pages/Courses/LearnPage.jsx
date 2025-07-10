import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const LearnPage = () => {
  const {selectedTechnology, user, setUser} = useData();
  const navigation = useNavigation();
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
  const [maxUnlockedTopicIndex, setMaxUnlockedTopicIndex] = useState(0);
  const [maxUnlockedLevelIndex, setMaxUnlockedLevelIndex] = useState(0);
  const prevLevel = useRef(null);

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
          if (userTech.TechStatus === 'completed') {
            setLoad(prev => ({...prev, completedUi: true, uiload: false}));
            setIsCompleted(true);
          }
          return {TopicLevel: levelIndex, TopicLength: currentTopicLen};
        }
      }
      return {TopicLevel: 0, TopicLength: 0};
    } catch (error) {
      ToastAndroid.show('Error finding user topics', ToastAndroid.SHORT);
      return {TopicLevel: 0, TopicLength: 0};
    }
  }, [user, selectedTechnology]);

  const getTechCourse = useCallback(
    async levelIndex => {
      if (prevLevel.current === levelIndex) return;
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
          prevLevel.current = levelIndex;
        }
      } catch (error) {
        ToastAndroid.show('Error fetching topics', ToastAndroid.SHORT);
      } finally {
        setLoad(prev => ({...prev, uiload: false}));
      }
    },
    [selectedTechnology, levels],
  );

  const handleTopicLength = useCallback(() => {
    if (topicLength >= courseData.length - 1) {
      saveTopicsLength();
      return;
    }
    setLoad(prev => ({...prev, boxLoad: true}));
    setIsSaved(false);
    const timer = setTimeout(() => {
      setTopicLength(prev => {
        const newIndex = prev + 1;
        setMaxUnlockedTopicIndex(newIndex);
        return newIndex;
      });
      setLoad(prev => ({...prev, boxLoad: false}));
    }, 500);
    return () => clearTimeout(timer);
  }, [topicLength, courseData]);

  const saveTopicsLength = useCallback(async () => {
    try {
      setLoad(prev => ({...prev, save: true}));
      const res = await axios.post(`${challengesApi}/Courses/setTopicLength`, {
        Topiclength: topicLength,
        userId: user?._id,
        TechName: selectedTechnology?.name,
      });
      if (res.status === 200) {
        const updatedTech = res.data.updatedTech;

        setUser(prev => {
          const updatedCourses = prev.Courses.map(course => {
            if (
              course.Technologies.some(
                tech => tech.TechName === updatedTech.TechName,
              )
            ) {
              const newTechs = course.Technologies.map(tech =>
                tech.TechName === updatedTech.TechName ? updatedTech : tech,
              );
              return {...course, Technologies: newTechs};
            }
            return course;
          });
          return {...prev, Courses: updatedCourses};
        });
        if (topicLength >= courseData.length - 1) {
          setMaxUnlockedTopicIndex(courseData.length - 1);
          await handleSetTopicLevel();
        }
        setIsSaved(true);
      }
    } catch (error) {
      ToastAndroid.show('Failed to update topic length', ToastAndroid.SHORT);
    } finally {
      setLoad(prev => ({...prev, save: false}));
    }
  }, [topicLength, user, selectedTechnology, courseData]);

  const handleSetTopicLevel = useCallback(async () => {
    try {
      if (isCompleted) {
        setLoad(prev => ({...prev, completedUi: true}));
        return;
      }
      setLoad(prev => ({...prev, uiload: true}));
      const isLastLevel = topicLevel >= levels.length - 1;
      const res = await axios.post(`${challengesApi}/Courses/setTopicLevel`, {
        TopicLevel: isLastLevel ? topicLevel : topicLevel + 1,
        userId: user?._id,
        TechName: selectedTechnology?.name,
        TopicLength: isLastLevel ? topicLength + 1 : 0,
        TechStatus: isLastLevel,
      });
      if (res.status === 200) {
        if (isLastLevel) {
          setLoad(prev => ({...prev, completedUi: true, uiload: false}));
        } else {
          const updatedTech = res.data.updatedTech;

          setUser(prev => {
            const updatedCourses = prev.Courses.map(course => {
              if (
                course.Technologies.some(
                  tech => tech.TechName === updatedTech.TechName,
                )
              ) {
                const newTechs = course.Technologies.map(tech =>
                  tech.TechName === updatedTech.TechName ? updatedTech : tech,
                );
                return {...course, Technologies: newTechs};
              }
              return course;
            });
            return {...prev, Courses: updatedCourses};
          });
          const nextLevel = topicLevel + 1;
          setTopicLevel(nextLevel);
          setMaxUnlockedLevelIndex(nextLevel);
          setMaxUnlockedTopicIndex(0);
          setTopicLength(0);
          await getTechCourse(nextLevel);
        }
      }
    } catch (error) {
      ToastAndroid.show('Failed to update topic level', ToastAndroid.SHORT);
    } finally {
      setLoad(prev => ({...prev, uiload: false}));
    }
  }, [topicLevel, user, selectedTechnology, topicLength, isCompleted]);

  useEffect(() => {
    const loadData = async () => {
      const data = await findTopicLength();
      setMaxUnlockedTopicIndex(data.TopicLength || 0);
      setMaxUnlockedLevelIndex(data.TopicLevel || 0);
      await getTechCourse(data.TopicLevel);
    };
    loadData();
  }, [findTopicLength, getTechCourse]);

  const MemoStudyBoxUi = useMemo(() => {
    return (
      <StudyBoxUi
        courseData={courseData}
        topicLength={topicLength}
        handleSetTopicsLength={handleTopicLength}
      />
    );
  }, [courseData, topicLength, handleTopicLength]);

  const renderLevelItem = useCallback(
    ({item, index}) => {
      const enabled = index <= maxUnlockedLevelIndex;
      return (
        <TouchableOpacity
          key={index}
          onPress={async () => {
            if (enabled) {
              setTopicLevel(index);
              setMaxUnlockedLevelIndex(Math.max(maxUnlockedLevelIndex, index));
              setMaxUnlockedTopicIndex(0);
              await getTechCourse(index);
              setShowToggle(false);
            }
          }}
          style={[
            styles.modalItem,
            index === topicLevel && styles.activeItem,
            {borderBottomWidth: index == levels.length - 1 ? 0 : 1},
          ]}>
          <Text style={styles.modalText}>{item}</Text>
          {!enabled && (
            <FastImage
              style={styles.lockIcon}
              source={{uri: 'https://i.ibb.co/1GpWpcPS/padlock.png'}}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      );
    },
    [topicLevel, getTechCourse, maxUnlockedLevelIndex],
  );

  const renderTopicItem = useCallback(
    ({item, index}) => {
      const enabled = index <= maxUnlockedTopicIndex;
      return (
        <TouchableOpacity
          onPress={() => {
            if (enabled) {
              setTopicLength(index);
              setIsSaved(false);
              setShowToggle(false);
            }
          }}
          style={[
            styles.modalItem,
            index === topicLength && styles.activeItem,
          ]}>
          <Text style={[styles.modalText, {width: '80%'}]}>{item?.title}</Text>
          {!enabled && !isCompleted && (
            <FastImage
              style={styles.lockIcon}
              source={{
                uri: 'https://i.ibb.co/1GpWpcPS/padlock.png',
                priority: FastImage.priority.high,
              }}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      );
    },
    [topicLength, isCompleted, maxUnlockedTopicIndex],
  );

  if (load.uiload) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <HeadingText text="Study Area" />
        </View>
        <Skeleton width={width} height={height * 0.1} />
        <Skeleton width={width} height={height * 0.4} />
        <Skeleton width={width} height={height * 0.3} />
      </View>
    );
  }

  if (load.completedUi) {
    return (
      <ImageBackground
        source={{uri: 'https://i.ibb.co/PGMhBBCv/v904-nunny-012-f.jpg'}}
        style={styles.completedBg}
        resizeMode="stretch">
        <View style={styles.completedBox}>
          <FastImage
            source={{
              uri: 'https://i.ibb.co/5gyVs2pg/raising-hand-concept-illustration.png',
            }}
            style={{width: width * 0.7, aspectRatio: 1}}
          />
          <Text style={styles.completedCongrats}>Congrats!</Text>
          <Text style={styles.completedMessage}>
            You finished {selectedTechnology?.name} course
          </Text>
          <TouchableOpacity
            onPress={() => {
              setLoad(prev => ({...prev, completedUi: false}));
              setTopicLength(0);
            }}
            style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Close</Text>
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
        <View style={styles.techHeader}>
          <View style={{flex: 1, rowGap: 10}}>
            <Text style={styles.levelText}>Level: {levels[topicLevel]}</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.toggle}
                onPress={() => {
                  setToggle('level');
                  setShowToggle(true);
                }}>
                <Text style={styles.toggleText}>{levels[topicLevel]}</Text>
                <FontAwesome name="caret-down" size={width * 0.04} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toggle}
                onPress={() => {
                  setToggle('topic');
                  setShowToggle(true);
                }}>
                <Text style={styles.toggleText}>Topic</Text>
                <FontAwesome name="caret-down" size={width * 0.04} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Code');
              }}
              style={{
                padding: 5,
                backgroundColor: 'rgba(10, 13, 180, 0.14)',
                width: '70%',
                borderRadius: 100,
              }}>
              <Text
                style={{
                  fontFamily: Font.Medium,
                  fontSize: width * 0.033,
                  textAlign: 'center',
                }}>
                Try real challenges!
              </Text>
            </TouchableOpacity>
          </View>
          <FastImage
            source={{uri: selectedTechnology?.icon}}
            style={{width: width * 0.3, aspectRatio: 1}}
            resizeMode="contain"
          />
        </View>
        <View style={styles.contentWrapper}>
          {load.boxLoad ? (
            <Skeleton width={width * 0.9} height={height * 0.8} radius={20} />
          ) : (
            MemoStudyBoxUi
          )}
          {!isCompleted && (
            <TouchableOpacity style={styles.saveBtn} onPress={saveTopicsLength}>
              {load.save ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.saveText}>
                  {isSaved ? 'Saved' : 'Save your progress'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <Modal visible={showToggle} onDismiss={() => setShowToggle(false)}>
        <View style={styles.modalBox}>
          {toggle === 'level' ? (
            levels.map((lvl, idx) => renderLevelItem({item: lvl, index: idx}))
          ) : (
            <FlatList
              data={courseData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderTopicItem}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              removeClippedSubviews
              windowSize={5}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default React.memo(LearnPage);
// 🎨 Styles (unchanged but clean)
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
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
    marginRight: 10,
  },
  toggleText: {
    fontFamily: Font.SemiBold,
    fontSize: width * 0.034,
    textTransform: 'capitalize',
  },
  techHeader: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontFamily: Font.SemiBold,
    fontSize: width * 0.05,
    textTransform: 'capitalize',
  },
  saveBtn: {
    backgroundColor: Colors.violet,
    height: height * 0.065,
    width: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: Colors.white,
    fontFamily: Font.Medium,
  },
  completedBg: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBox: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 10,
  },
  completedCongrats: {
    fontSize: width * 0.07,
    textAlign: 'center',
    fontFamily: Font.SemiBold,
  },
  completedMessage: {
    fontFamily: Font.Medium,
    fontSize: width * 0.04,
  },
  closeBtn: {
    backgroundColor: Colors.violet,
    height: height * 0.056,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: width * 0.5,
  },
  closeBtnText: {
    color: Colors.white,
    fontFamily: Font.Medium,
    fontSize: width * 0.034,
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center',
    paddingVertical: 15,
  },
  modalItem: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.8,
    borderColor: Colors.veryLightGrey,
  },
  activeItem: {
    backgroundColor: 'rgb(26, 219, 123)',
  },
  modalText: {
    textTransform: 'capitalize',
    fontSize: width * 0.035,
    fontFamily: Font.Medium,
  },
  lockIcon: {
    width: width * 0.08,
    aspectRatio: 1,
  },
});
