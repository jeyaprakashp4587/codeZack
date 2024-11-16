import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import HeadingText from '../utils/HeadingText';
import {Colors, pageView} from '../constants/Colors';
import Moment from 'moment';

const Placement = () => {
  const {width, height} = Dimensions.get('window');
  console.log(typeof 2);

  return (
    <View style={pageView}>
      {/* header */}
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Placement" />
        <Text style={{color: Colors.mildGrey, letterSpacing: 2}}>
          We are working on it :)
        </Text>
        <Image
          source={{uri: 'https://i.ibb.co/fQhgqVz/rb-2148817994.png'}}
          style={{
            width: width * 0.7,
            height: height * 0.3,
            alignSelf: 'center',
            marginTop: height * 0.2,
          }}
        />
      </View>
    </View>
  );
};

export default Placement;

const styles = StyleSheet.create({});
