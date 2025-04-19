import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import PragraphText from '../utils/PragraphText';
import {Colors} from '../constants/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const Journey = () => {
  // get jouney Name
  const {width, height} = Dimensions.get('window');

  return (
    <View style={{paddingHorizontal: 15, marginTop: 10}}>
      <PragraphText text="Camps" />
      {/* <TouchableOpacity
        style={{
          borderWidth: 0,
          height: height * 0.2,
          borderRadius: 10,
          overflow: 'hidden',
          elevation: 2,
          backgroundColor: 'white',
          padding: 20,
        }}>
        <Text
          style={{
            color: Colors.mildGrey,
            fontSize: width * 0.05,
            letterSpacing: 2,
            // fontWeight: '600',
          }}>
          Web Development
        </Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={{borderRadius: 10, overflow: 'hidden'}}>
        <ImageBackground
          source={{uri: 'https://i.ibb.co/LP5BCHs/18705.jpg'}}
          style={{height: height * 0.2}}>
          <LinearGradient colors={[Colors.violet, 'white']}></LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

export default Journey;

const styles = StyleSheet.create({});
