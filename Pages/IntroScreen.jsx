import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import Carousel from 'react-native-reanimated-carousel';
import {Colors, font} from '../constants/Colors';
import {Font} from '../constants/Font';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

const IntroScreen = () => {
  const {width, height} = Dimensions.get('window');
  const data = useMemo(() => [
    {
      title: 'Learn. Code. Prepare. Hired',
      message:
        'Explore coding tutorials, practice with challenges, and level up your skills',
      img: 'https://i.ibb.co/gxCPg5C/209091878-10951137.jpg',
    },
    {
      title: 'Connect with Coders',
      message:
        'Share your achievements, chat with friends, and grow your network',
      img: 'https://i.ibb.co/VcZKGBMC/20181844-6238849.jpg',
    },
    {
      title: 'Stay Updated, Stay Ahead',
      message: 'Get the latest job updates and career opportunities in tech',
      img: 'https://i.ibb.co/MD5nvdTX/18734235-Tiny-people-searching-for-business-opportunities.jpg',
    },
  ]);
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const handleNext = () => {
    if (currentIndex == 2) {
      navigation.replace('login');
      return;
    }
    const nextIndex = (currentIndex + 1) % data.length;
    carouselRef.current.scrollTo({
      index: nextIndex,
      animated: true,
      duration: 500,
    });
    setCurrentIndex(nextIndex);
  };
  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        width={width}
        data={data}
        height={height * 0.9}
        // style={{borderWidth: 1}}
        onSnapToItem={setCurrentIndex}
        renderItem={({item}) => (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: 20,
              rowGap: 10,
            }}>
            <FastImage
              source={{uri: item.img, priority: FastImage.priority.high}}
              style={{width: width * 0.8, aspectRatio: 1}}
              resizeMode="contain"
            />
            <Text
              style={{
                textAlign: 'center',
                fontFamily: Font.SemiBold,
                fontSize: width * 0.07,
              }}>
              {item.title}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: Font.Medium,
                letterSpacing: 0.25,
                lineHeight: 25,
              }}>
              {item.message}
            </Text>
          </View>
        )}
      />
      <TouchableOpacity
        onPress={handleNext}
        style={{
          // borderWidth: 1,
          backgroundColor: Colors.violet,
          width: '80%',
          borderRadius: 50,
          padding: 15,
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: width * 0.04,
            fontFamily: Font.Medium,
            color: Colors.white,
          }}>
          {currentIndex === 2 ? 'Get Start' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
});
