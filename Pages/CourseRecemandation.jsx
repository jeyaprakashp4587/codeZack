import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const {width} = Dimensions.get('window');

const CourseRecommendation = () => {
  const data = ['jp', 'hh', 'hfk'];
  return (
    <View>
      <Carousel data={data} renderItem={({item}) => <Text>{item}</Text>} />
    </View>
  );
};

export default CourseRecommendation;
