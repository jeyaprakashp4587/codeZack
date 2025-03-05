import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Colors} from '../constants/Colors';
import Ripple from 'react-native-material-ripple';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {faEye} from '@fortawesome/free-regular-svg-icons';
import {LinearGradient} from 'react-native-linear-gradient';
import ParagraphText from '../utils/PragraphText';
import {functionApi} from '../Api';
import axios from 'axios';
import {FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../Context/Contexter';
import {TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

const SuggestionWapper = ({refresh}) => {
  const {width, height} = Dimensions.get('window');
  const [profiles, setProfiles] = useState([]);
  const Navigation = useNavigation();
  const {setSelectedUser, user} = useData();
  const userSuggestions = useCallback(async () => {
    const res = await axios.get(`${functionApi}/Suggestions/users/${user._id}`);
    if (res.data) {
      setProfiles(res.data);
      // console.log(res.data);
      if (res.data.length <= 0) trigger(false);
    }
    return res.data;
  }, [refresh]);
  useEffect(() => {
    userSuggestions();
  }, [refresh]);
  // handle show more
  const HandleShowMore = useCallback(async () => {
    Navigation.navigate('allUserPage');
  }, []);
  // render ui
  if (profiles.length <= 0) {
    return <View></View>;
  }
  return (
    <View style={{flexDirection: 'column', rowGap: 5}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <ParagraphText text="Suggestions" color="black" fweight={700} />
        <TouchableOpacity
          onPress={() => {
            HandleShowMore();
          }}>
          <Text
            style={{
              // textDecorationLine: 'underline',
              letterSpacing: 1,
              fontSize: width * 0.03,
              // fontWeight: '600',
              color: Colors.mildGrey,
              fontFamily: 'Poppins-Medium',
            }}>
            Show more
          </Text>
        </TouchableOpacity>
      </View>
      {/* list */}
      <FlatList
        nestedScrollEnabled={true}
        horizontal
        data={profiles}
        showsHorizontalScrollIndicator={false}
        renderItem={user => (
          <ImageBackground
            source={{
              uri:
                user.item?.Images?.coverImg ??
                'https://i.ibb.co/Fh1fwGm/2151777507.jpg',
            }}
            style={{
              borderRadius: 7,
              overflow: 'hidden',
              marginRight: 10,
              borderWidth: 0.7,
              borderColor: Colors.veryLightGrey,
            }}>
            <LinearGradient
              colors={['rgba(0,0,0,.1)', '#f2f2f2', Colors.white]}
              // style={{elevation: 2, borderRadius: 5}}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 1}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: width * 0.8,
                  height: height * 0.1,
                  paddingHorizontal: 15,
                  columnGap: 10,
                }}
                onPress={() => {
                  Navigation.navigate('userprofile');
                  setSelectedUser(user.item._id);
                }}>
                <FastImage
                  priority={FastImage.priority.high}
                  source={{
                    uri: user.item?.Images?.profile
                      ? user.item?.Images?.profile
                      : 'https://i.ibb.co/3T4mNMm/man.png',
                  }}
                  style={{
                    width: width * 0.14,
                    height: height * 0.07,
                    borderRadius: 50,
                    // borderWidth: 1,
                    // resizeMode: 'contain',
                  }}
                />
                {/* online status dot */}
                <View
                  style={{
                    position: 'absolute',
                    top: height * 0.072,
                    zIndex: 10,
                    left: width * 0.14,
                    padding: width * 0.01,
                    backgroundColor: user?.item?.onlineStatus ? 'Green' : 'red',
                    borderRadius: 50,
                    borderWidth: 1.3,
                    borderColor: 'white',
                  }}
                />
                <View style={{borderWidth: 0, flex: 1}}>
                  <Text
                    style={{
                      fontSize: width * 0.04,
                      color: Colors.veryDarkGrey,
                      textTransform: 'capitalize',
                      // fontWeight: '600',
                      letterSpacing: 1,
                      fontFamily: 'Poppins-Medium',
                    }}
                    numberOfLines={1}>
                    {user.item?.firstName} {user.item?.LastName}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: width * 0.025,
                      color: Colors.mildGrey,
                      // fontWeight: '600',
                      letterSpacing: 1,
                      fontFamily: 'Poppins-SemiBold',
                    }}>
                    {user.item?.InstitudeName}
                  </Text>
                </View>
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground>
        )}
      />
    </View>
  );
};

export default SuggestionWapper;

const styles = StyleSheet.create({});
