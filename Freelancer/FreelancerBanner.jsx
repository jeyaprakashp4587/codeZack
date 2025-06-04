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

const FreelancerBanner = () => {
  const {width, height} = Dimensions.get('window');
  const {user} = useData();
  const navigation = useNavigation();
  const [showModel, setShowModel] = useState(false);
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

  return (
    <View
      style={{
        paddingHorizontal: 15,
        borderWidth: 0,
        borderColor: Colors.lightGrey,
        marginVertical: 15,
      }}>
      <Text
        style={{
          fontFamily: Font.Medium,
          fontSize: width * 0.045,
          letterSpacing: 0.26,
          marginBottom: 10,
        }}>
        Freelancing
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          columnGap: 30,
          backgroundColor: 'rgba(13, 102, 185, 0.12)',
          padding: 10,
          borderRadius: 10,
          // elevation: 2,
        }}>
        <FastImage
          source={{
            uri: 'https://i.ibb.co/bMsNhktm/11879394-Work-from-home.jpg',
            priority: FastImage.priority.high,
          }}
          resizeMode="contain"
          style={{width: width * 0.35, aspectRatio: 1, zIndex: -10}}
        />
        <View style={{flex: 1, borderWidth: 0, rowGap: 10}}>
          <Text
            style={{
              fontFamily: Font.SemiBold,
              fontSize: width * 0.044,
              letterSpacing: 0.2,
              lineHeight: 25,
            }}>
            Get paid for your coding skills.
          </Text>
          <TouchableOpacity
            onPress={handleNavigate}
            style={{
              backgroundColor: Colors.violet,
              padding: 8,
              borderRadius: 90,
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
      <Modal transparent={true} visible={showModel}>
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
                padding: 10,
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
