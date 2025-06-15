import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ToastAndroid,
  FlatList,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {Colors} from '../../constants/Colors';
import HeadingText from '../../utils/HeadingText';
import {useData} from '../../Context/Contexter';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Skeleton from '../../Skeletons/Skeleton';
import {Font} from '../../constants/Font';
import axios from 'axios';
import {challengesApi} from '../../Api';

const {width, height} = Dimensions.get('window');

const LearnPage = () => {
  const {selectedTechnology} = useData();
  const {user} = useData();
  const [courseData, setCourseData] = useState([]);
  const [Topiclength, setTopicLength] = useState(0);
  const getTechCourse = useCallback(async () => {
    try {
      const {data, status} = await axios.get(
        `${challengesApi}/Courses/getTechCourse`,
        {
          params: {
            TechName: selectedTechnology?.name.toLowerCase(),
            level: 'beginner',
          },
        },
      );
      if (status === 200 && data) {
        setCourseData(data?.courseData);
        console.log(data?.courseData);
      }
    } catch (error) {
      ToastAndroid.show('error on get topics', ToastAndroid.SHORT);
    }
  }, [selectedTechnology]);
  useEffect(() => {
    getTechCourse();
  }, []);
  // send the topics length to server for save
  const handleSetTopicsLength = useCallback(async () => {
    const {status, data} = await axios.post(
      `${challengesApi}/Courses/setTopicLength`,
      {
        Topiclength: Topiclength,
        userId: user?._id,
        TechName: selectedTechnology?.name,
      },
    );
  }, []);
  const StudyBoxUi = useCallback(() => {
    const currentTopic = courseData[Topiclength];
    return (
      <View style={{flexDirection: 'column', rowGap: 10, borderWidth: 0}}>
        <Text
          style={{
            fontFamily: Font.SemiBold,
            color: Colors.veryDarkGrey,
            fontSize: width * 0.05,
          }}>
          Topic: {currentTopic?.title}
        </Text>
        <Text
          style={{
            backgroundColor: 'rgba(170, 173, 170, 0.1)',
            padding: 15,
            fontFamily: Font.Regular,
            fontSize: width * 0.035,
            borderRadius: 20,
            lineHeight: 23,
            color: Colors.mildGrey,
          }}>
          {currentTopic?.code}
        </Text>
        <Text
          style={{
            color: Colors.veryDarkGrey,
            fontFamily: Font.Medium,
            fontSize: width * 0.035,
            lineHeight: 20,
          }}>
          Content: {currentTopic?.content}
        </Text>
        <Text
          style={{
            color: Colors.veryDarkGrey,
            fontFamily: Font.Regular,
            fontSize: width * 0.033,
            lineHeight: 20,
          }}>
          Output: {currentTopic?.output}
        </Text>
      </View>
    );
  }, [Topiclength]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeadingText text="Study Area" />
      </View>
      {/* show study page */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            borderWidth: 1,
            flex: 1,
            height: height,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ImageBackground
            source={{
              uri: 'https://i.ibb.co/PGMhBBCv/v904-nunny-012-f.jpg',
            }}
            style={{
              padding: 20,
              width: '100%',
              borderRadius: 10,
              // borderWidth: 1,
            }}
            resizeMode="stretch">
            <StudyBoxUi />
          </ImageBackground>
        </View>
      </ScrollView>
    </View>
  );
};

export default React.memo(LearnPage);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
  },
  headerRight: {
    flexDirection: 'row',
    columnGap: width * 0.025,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    borderWidth: 0,
    minWidth: width * 0.2,
    textAlign: 'left',
    color: 'orange',
    fontSize: width * 0.045,
    fontFamily: Font.Regular,
  },
  webview: {
    height: height * 0.75,
  },
});
