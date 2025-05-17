import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Carousel from 'react-native-reanimated-carousel';
import {Colors, font} from '../constants/Colors';
import {Font} from '../constants/Font';
import FastImage from 'react-native-fast-image';

const IntroScreen = () => {
  const {width} = Dimensions.get('window');
  const data = [
    {
      title: 'Learn. Code. Challenge',
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
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const handleNext = () => {
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
        style={{
          borderWidth: 1,
          flex: 1,
        }}
        renderItem={({item}) => (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
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
                letterSpacing: 0.2,
              }}>
              {item.message}
            </Text>
            <TouchableOpacity
              onPress={handleNext}
              style={{
                borderWidth: 1,
                backgroundColor: Colors.violet,
                width: '80%',
                borderRadius: 50,
                padding: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: width * 0.04,
                  fontFamily: Font.Medium,
                  color: Colors.white,
                }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
