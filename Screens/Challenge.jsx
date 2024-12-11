import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  ImageBackground,
  FlatList,
} from 'react-native';
import HeadingText from '../utils/HeadingText';
import PragraphText from '../utils/PragraphText';
import {useData} from '../Context/Contexter';
import {ScrollView} from 'react-native';
import {Dimensions} from 'react-native';
import BannerAdd from '../Adds/BannerAdd';
import {Colors} from '../constants/Colors';

const Challenge = ({navigation}) => {
  const {setselectedChallengeTopic} = useData();
  const {width, height} = Dimensions.get('window');
  // Memoize the challenge data to avoid recalculating the array on every render
  // right wrapper
  //   "https://i.ibb.co/6DzKrYd/icons8-swift-240.png"
  // "https://i.ibb.co/xfCGvhK/icons8-react-native-480.png"
  // "https://i.ibb.co/X2jw9bT/icons8-kotlin-480.png"
  // "https://i.ibb.co/HxY5tgj/icons8-javascript-240.png"
  // "https://i.ibb.co/gVV6xx5/icons8-java-480.png"
  // "https://i.ibb.co/vB0Z46W/icons8-html-240.png"
  // "https://i.ibb.co/wpRyJ9Q/icons8-c-240.png"
  // "https://i.ibb.co/hmFKgGc/icons8-bootstrap-480.png"
  // "https://i.ibb.co/1ZK8nFT/css-3.png"
  const rightWrapper = useMemo(() => [
    {
      ChallengeName: 'Your Challenges',
      bgColor: '#f8f5ed',
      route: 'yourchallenges',
      content: 'View your challenges!',
      Images: [],
    },
    {
      ChallengeName: 'Web Development',
      bgColor: '#f7f2ed',
      route: 'chooseChallenge',
      content:
        'Learn to build stunning static and dynamic websites using modern web technologies.',
      Images: [
        'https://i.ibb.co/vB0Z46W/icons8-html-240.png',
        'https://i.ibb.co/1ZK8nFT/css-3.png',
        'https://i.ibb.co/HxY5tgj/icons8-javascript-240.png',
        'https://i.ibb.co/xfCGvhK/icons8-react-native-480.png',
        'https://i.ibb.co/hmFKgGc/icons8-bootstrap-480.png',
      ],
    },
    {
      ChallengeName: 'App Development',
      bgColor: '#f0f2f4',
      route: 'chooseChallenge',
      content:
        'Discover the world of mobile app development! Create cross-platform apps for Android and iOS using technologies like React Native, Kotlin, and Swift.',
      Images: [
        'https://i.ibb.co/xfCGvhK/icons8-react-native-480.png',
        'https://i.ibb.co/X2jw9bT/icons8-kotlin-480.png',
        'https://i.ibb.co/6DzKrYd/icons8-swift-240.png',
      ],
    },
  ]);
  const leftWrapper = useMemo(
    () => [
      {
        ChallengeName: 'Java',
        bgColor: '#f7f1ee',
        web: 'https://www.programiz.com/java-programming/online-compiler/',
        route: 'CoreChallenge',
        content:
          'Master Java programming by solving real-world challenges. Explore key concepts such as object-oriented programming, data structures, and algorithms.',
        Images: ['https://i.ibb.co/gVV6xx5/icons8-java-480.png'],
      },
      {
        ChallengeName: 'Python',
        bgColor: '#ecf8f8',
        web: 'https://www.programiz.com/python-programming/online-compiler/',
        route: 'CoreChallenge',
        content:
          'Learn Python, a versatile programming language! Solve challenges in automation, data science, web development, and more.',
        Images: ['https://i.ibb.co/SyM2kSR/python.png'],
      },
      {
        ChallengeName: 'C++',
        bgColor: '#f4f3f0',
        web: 'https://www.programiz.com/cpp-programming/online-compiler/',
        route: 'CoreChallenge',
        content:
          'Sharpen your C++ skills with challenges focusing on competitive programming and system-level development.',
        Images: ['https://i.ibb.co/wpRyJ9Q/icons8-c-240.png'],
      },
    ],
    [],
  );

  const handleCoreChallenge = useCallback(item => {
    setselectedChallengeTopic(item);
    navigation.navigate('CoreChallenge');
  });
  // Memoize the handler to prevent re-creation on every render
  const HandleSelectChallenges = useCallback(
    item => {
      navigation.navigate('chooseChallenge');
      setselectedChallengeTopic(item?.ChallengeName);
    },
    [navigation, setselectedChallengeTopic],
  );
  return (
    <ScrollView
      style={{backgroundColor: 'white'}}
      showsVerticalScrollIndicator={false}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText
          text="Develop Your Skills Here"
          color={Colors.veryDarkGrey}
        />
      </View>
      {/* Tech chalenege */}
      <View
        style={{
          borderWidth: 0,
          paddingHorizontal: 15,
          flex: 1,
          height: '100%',
          flexDirection: 'row',
          gap: 15,
        }}>
        {/* left wrapper */}
        <View style={{flex: 1}}>
          {leftWrapper.map((ch, index) => (
            <TouchableOpacity
              onPress={() => handleCoreChallenge(ch)}
              style={{
                borderWidth: 0,
                backgroundColor: ch.bgColor,
                borderRadius: 30,
                padding: 20,
                width: '100%',
                marginBottom: 10,
                // height: '30%',
              }}>
              <Text
                style={{
                  fontWeight: '600',
                  letterSpacing: 2,
                  paddingBottom: 10,
                }}>
                {ch.ChallengeName}
              </Text>
              <Text
                style={{
                  letterSpacing: 1,
                  bgColor: Colors.mildGrey,
                  lineHeight: 20,
                  fontSize: width * 0.03,
                }}>
                {ch.content}
              </Text>
              {ch.Images.map(img => (
                <Image
                  source={{uri: img}}
                  style={{width: 20, height: 20, marginVertical: 10}}
                />
              ))}
            </TouchableOpacity>
          ))}
        </View>

        {/* right wrapper */}
        <View style={{flex: 1}}>
          {rightWrapper.map((ch, index) => (
            <TouchableOpacity
              onPress={
                index == 0
                  ? () => navigation.navigate(ch.route)
                  : () => HandleSelectChallenges(ch)
              }
              style={{
                borderWidth: 0,
                backgroundColor: ch.bgColor,
                borderRadius: 30,
                padding: 20,
                width: '100%',
                // height: '30%',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontWeight: '600',
                  letterSpacing: 2,
                  paddingBottom: 10,
                }}>
                {ch.ChallengeName}
              </Text>
              <Text
                style={{
                  letterSpacing: 1,
                  bgColor: Colors.mildGrey,
                  lineHeight: 20,
                  fontSize: width * 0.03,
                }}>
                {ch.content}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 8,
                  marginVertical: 10,
                }}>
                {ch.Images.map(img => (
                  <Image source={{uri: img}} style={{width: 20, height: 20}} />
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default React.memo(Challenge);

const styles = StyleSheet.create({});
