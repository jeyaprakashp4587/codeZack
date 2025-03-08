import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback} from 'react';
import {useData} from '../Context/Contexter';
import HeadingText from '../utils/HeadingText';
import {Colors} from '../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

const SelectedProject = () => {
  const {selectedProject} = useData();
  const {width, height} = Dimensions.get('window');
  //   console.log(selectedProject);
  // handle buy project
  const handleBuyProject = useCallback(async () => {
    ToastAndroid.show("We'll updated soon", ToastAndroid.SHORT);
  }, []);
  return (
    <ScrollView
      style={{flex: 1, backgroundColor: 'white'}}
      showsHorizontalScrollIndicator={false}>
      {/* header */}
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text={selectedProject?.name} />
      </View>
      {/* contect */}
      <View
        style={{
          borderWidth: 0,
          paddingHorizontal: 15,
          flexDirection: 'column',
          rowGap: 20,
        }}>
        <FastImage
          priority={FastImage.priority.high}
          source={{uri: selectedProject?.img}}
          style={{
            width: width * 0.9,
            alignSelf: 'center',
            height: height * 0.3,
          }}
          resizeMode="center"
        />
        <Text
          style={{
            fontSize: width * 0.03,
            lineHeight: 20,
            letterSpacing: 1,
            // fontWeight: '600',
            color: Colors.mildGrey,
            fontFamily: 'Poppins-Light',
          }}>
          Note! "If you purchase this project, our skilled software engineers
          will provide full support from scratch to completion. This project
          assets, including UI design, color schemes, and images, will be
          prepared and provided by our expert technicians once your payment is
          successfully processed. We're here to ensure a seamless and
          professional experience throughout your project journey!"
        </Text>
        {/* selct tech */}
        <Text
          style={{
            color: Colors.veryDarkGrey,
            fontWeight: '600',
            fontSize: width * 0.045,
            letterSpacing: 0.5,
            fontFamily: 'Poppins-Light',
          }}>
          Select your Technology
        </Text>
        <View>
          {selectedProject?.Technologies?.map((tech, index) => (
            <View
              key={index}
              style={{
                borderWidth: 0,
                padding: 15,
                marginBottom: 20,
                elevation: 2,
                backgroundColor: 'white',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: width * 0.035,
                  letterSpacing: 1,
                  fontWeight: '600',
                  color: Colors.veryDarkGrey,
                  marginBottom: 10,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                Project Type: {tech?.TechType}
              </Text>
              {tech?.Techs?.map((tool, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    borderColor: Colors.veryLightGrey,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                    borderBottomWidth: 0.5,
                    paddingBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: Colors.mildGrey,
                      letterSpacing: 1,
                      fontSize: width * 0.03,
                      fontFamily: 'Poppins-Light',
                    }}>
                    {tool?.TechName}
                  </Text>
                  <FastImage
                    priority={FastImage.priority.high}
                    source={{uri: tool?.TechImg}}
                    style={{width: width * 0.06, aspectRatio: 1}}
                  />
                </View>
              ))}
              {/* price */}
              <Text
                style={{
                  fontWeight: '900',
                  color: Colors.violet,
                  letterSpacing: 1,
                  fontSize: width * 0.03,
                  marginBottom: 10,
                  fontFamily: 'Poppins-Light',
                }}>
                Price Rs: {tech?.Price} /-
              </Text>
              <TouchableOpacity
                style={{
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                onPress={() => handleBuyProject()}>
                <Text
                  style={{
                    textAlign: 'center',
                    letterSpacing: 1,
                    fontSize: width * 0.035,
                    color: Colors.mildGrey,
                    fontFamily: 'Poppins-Light',
                  }}>
                  Coming Soon
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {/* text */}
        <Text
          style={{
            color: Colors.veryDarkGrey,
            fontSize: width * 0.03,
            marginBottom: 30,
            // fontWeight: '600',
            letterSpacing: 0.7,
            lineHeight: 20,
            fontFamily: 'Poppins-SemiBold',
          }}>
          "Achieve success with our project! Get full support, UI assets, and
          expert guidance. Start your journey today!"
        </Text>
      </View>
    </ScrollView>
  );
};

export default SelectedProject;

const styles = StyleSheet.create({});
