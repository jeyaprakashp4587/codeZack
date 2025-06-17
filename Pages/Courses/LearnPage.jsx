import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ToastAndroid,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {Colors} from '../../constants/Colors';
import HeadingText from '../../utils/HeadingText';
import {useData} from '../../Context/Contexter';
import {Font} from '../../constants/Font';
import axios from 'axios';
import {challengesApi} from '../../Api';
import StudyBoxUi from '../../components/StudyBoxUi';

const {width, height} = Dimensions.get('window');

const LearnPage = () => {
  const {selectedTechnology, user} = useData();
  const levels = ['beginner', 'intermediate', 'advanced'];
  const [courseData, setCourseData] = useState([]);
  const [topicLength, setTopicLength] = useState(0);
  const [topicLevel, setTopicLevel] = useState(0);
  const [isFinishes, setIsFinished] = useState(false);
  // Fetch user topic progress
  const findTopicLength = useCallback(async () => {
    const userCourse = user?.Courses?.find(course =>
      course?.Technologies?.some(
        tech => tech?.TechName === selectedTechnology?.name,
      ),
    );

    if (userCourse) {
      const userTech = userCourse?.Technologies?.find(
        tech => tech?.TechName === selectedTechnology?.name,
      );

      if (userTech) {
        setTopicLength(userTech.currentTopicLength || 0);
        setTopicLevel(userTech.TechCurrentLevel || 0);
        return {
          TopicLevel: userTech.TechCurrentLevel || 0,
        };
      }
    }

    return {TopicLevel: 0};
  }, [user, selectedTechnology]);

  // Get course data for the current level
  const getTechCourse = useCallback(
    async (levelIndex = topicLevel) => {
      try {
        const res = await axios.get(`${challengesApi}/Courses/getTechCourse`, {
          params: {
            TechName: selectedTechnology?.name?.toLowerCase(),
            level: levels[levelIndex],
          },
        });

        if (res.status === 200 && res.data?.courseData) {
          setCourseData(res.data.courseData);
        }
      } catch (error) {
        ToastAndroid.show('Error fetching topics', ToastAndroid.SHORT);
      }
    },
    [selectedTechnology, topicLevel],
  );
  // check if all level are finished
  const checkAllLevelFinished = useCallback(async () => {}, []);

  // On component mount
  useEffect(() => {
    const load = async () => {
      const data = await findTopicLength();
      await getTechCourse(data.TopicLevel);
    };
    load();
  }, [findTopicLength]);

  // Advance topic length
  const handleSetTopicsLength = useCallback(async () => {
    try {
      const res = await axios.post(`${challengesApi}/Courses/setTopicLength`, {
        Topiclength: topicLength,
        userId: user?._id,
        TechName: selectedTechnology?.name,
      });

      if (res.status === 200) {
        setTopicLength(prev => prev + 1);

        if (topicLength >= courseData.length - 1) {
          await handleSetTopicLevel();
        }
      }
    } catch (error) {
      ToastAndroid.show('Failed to update topic length', ToastAndroid.SHORT);
    }
  }, [topicLength, courseData, user, selectedTechnology]);

  // Advance topic level
  const handleSetTopicLevel = useCallback(async () => {
    try {
      const res = await axios.post(`${challengesApi}/Courses/setTopicLevel`, {
        TopicLevel: levels[topicLevel],
        userId: user?._id,
        TechName: selectedTechnology?.name,
      });
      if (res.status === 200) {
        setTopicLength(0);
        setTopicLevel(prev => prev + 1);
        await getTechCourse(topicLevel + 1);
      }
    } catch (error) {
      ToastAndroid.show('Failed to update topic level', ToastAndroid.SHORT);
    }
  }, [topicLevel, user, selectedTechnology]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeadingText text="Study Area" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          <ImageBackground
            source={{uri: 'https://i.ibb.co/PGMhBBCv/v904-nunny-012-f.jpg'}}
            style={styles.imageBackground}
            resizeMode="stretch"
          />
          {/* courseData, topicLength, handleSetTopicsLength */}
          <StudyBoxUi
            courseData={courseData}
            topicLength={topicLength}
            handleSetTopicsLength={handleSetTopicsLength}
          />
        </View>
      </ScrollView>
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
    paddingHorizontal: width * 0.05,
    marginTop: 10,
  },
  contentWrapper: {
    flex: 1,
    height: height,
    justifyContent: 'center',
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
    // borderWidth: 1,
    zIndex: -100,
    right: -width * 0.15,
    opacity: 0.7,
  },
  topicContainer: {
    flexDirection: 'column',
    rowGap: 10,

    // borderWidth: 1,
  },
  topicTitle: {
    fontFamily: Font.SemiBold,
    color: Colors.veryDarkGrey,
    fontSize: width * 0.065,
    lineHeight: 30,
  },
  topicCode: {
    backgroundColor: 'rgba(170, 173, 170, 0.1)',
    padding: 15,
    borderRadius: 20,
    fontFamily: Font.Regular,
    fontSize: width * 0.035,
    lineHeight: 23,
    color: Colors.mildGrey,
  },
  topicContent: {
    color: Colors.veryDarkGrey,
    fontFamily: Font.Medium,
    fontSize: width * 0.035,
    lineHeight: 20,
  },
  topicOutput: {
    color: Colors.veryDarkGrey,
    fontFamily: Font.Regular,
    fontSize: width * 0.033,
    lineHeight: 20,
  },
});
