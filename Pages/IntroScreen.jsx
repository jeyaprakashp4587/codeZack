import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Carousel from 'react-native-reanimated-carousel';
import {Colors} from '../constants/Colors';

const IntroScreen = () => {
  const {width, height} = Dimensions.get('window');
  const data = [
    {
      title: 'Learn. Code. Challenge',
      message:
        'Explore coding tutorials, practice with challenges, and level up your skills',
    },
    {
      title: 'Connect with Coders',
      message:
        'Share your achievements, chat with friends, and grow your network',
    },
    {
      title: 'Stay Updated, Stay Ahead',
      message: 'Get the latest job updates and career opportunities in tech',
    },
  ];

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <Carousel
        width={width}
        data={data}
        // height={300}
        renderItem={({item}) => (
          <View
            style={{
              borderWidth: 1,
              borderColor: 'red',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{textAlign: 'center'}}>{item.title}</Text>
            <Text style={{textAlign: 'center'}}>{item.message}</Text>
          </View>
        )}
        // mode="horizontal-stack"
      />
    </View>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({});
