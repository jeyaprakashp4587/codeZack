import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Colors} from '../constants/Colors';
import {Font} from '../constants/Font';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../Context/Contexter';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ripple from 'react-native-material-ripple';

const FreelancerBanner = () => {
  const {width, height} = Dimensions.get('window');
  const {user} = useData();
  const navigation = useNavigation();
  const [showModel, setShowModel] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const handleNavigate = () => {
    try {
      if (user?.Challenges?.length <= 3) {
        setShowModel(true);
        return;
      } else {
        navigation.navigate('ProjectPost');
      }
    } catch (error) {}
  };
  // return empty ui
  if (!showBanner) return null;

  return (
    <View
      style={{
        paddingHorizontal: 15,
        borderWidth: 0,
        borderColor: Colors.lightGrey,
        // marginVertical: 15,
      }}>
      <Text
        style={{
          fontFamily: Font.Medium,
          fontSize: width * 0.041,
          letterSpacing: 0.25,
          marginBottom: 10,
        }}>
        Freelancing
      </Text>
      {/* wrapper */}
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(13, 93, 185, 0.15)',
          padding: 15,
          borderRadius: 10,
          overflow: 'hidden',
          rowGap: 10,
        }}>
        <View style={{borderWidth: 0, width: '100%'}}>
          {/* times icons */}
          <Ripple
            onPress={() => setShowBanner(false)}
            style={{
              backgroundColor: Colors.veryLightGrey,
              borderRadius: 90,
              width: 25,
              aspectRatio: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'flex-end',
            }}>
            <FontAwesome5 name="times" size={13} color="rgb(0, 0, 0)" />
          </Ripple>
        </View>
        {/* content wrapper */}
        <FastImage
          source={{
            uri: 'https://i.ibb.co/9mHPQysq/happy-freelancer-with-computer-home-young-man-sitting-armchair-using-laptop-chatting-online-smiling.png',
            priority: FastImage.priority.high,
          }}
          resizeMode="cover"
          style={{
            width: width * 0.35,
            aspectRatio: 1,
            zIndex: 10,
            position: 'absolute',
            bottom: -8,
            left: 10,
          }}
        />
        <View
          style={{
            // borderWidth: 1,
            flex: 1,
            justifyContent: 'flex-end',
            alignSelf: 'flex-end',
            width: '50%',
            rowGap: 15,
          }}>
          <Text
            style={{
              fontFamily: Font.SemiBold,
              fontSize: width * 0.05,
              letterSpacing: 0.2,
              lineHeight: 30,
            }}>
            Get paid for your coding skills.
          </Text>
          <TouchableOpacity
            onPress={handleNavigate}
            style={{
              backgroundColor: Colors.violet,
              padding: 8,
              borderRadius: 90,
              width: '80%',
            }}>
            <Text
              style={{
                color: Colors.white,
                fontFamily: Font.Regular,
                fontSize: width * 0.03,
                textAlign: 'center',
                letterSpacing: 0.3,
              }}>
              Start now →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal transparent={true} visible={showModel} collapsable={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.46)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: Colors.white,
              margin: 20,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
              borderRadius: 14,
              rowGap: 10,
            }}>
            <FastImage
              style={{width: width * 0.4, aspectRatio: 1}}
              source={{
                uri: 'https://i.ibb.co/Rp6m2rcP/padlock.png',
                priority: FastImage.priority.high,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontFamily: Font.Medium,
                letterSpacing: 0.3,
                textAlign: 'center',
                lineHeight: 23,
              }}>
              To unlock this feature, You need to complete 5 web/app challenges
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.violet,
                width: width * 0.4,
                padding: 7,
                borderRadius: 50,
              }}
              onPress={() => {
                navigation.navigate('Code'), setShowModel(false);
              }}>
              <Text
                style={{
                  fontFamily: Font.Regular,
                  color: Colors.white,
                  textAlign: 'center',
                }}>
                Try it!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FreelancerBanner;

const styles = StyleSheet.create({});
