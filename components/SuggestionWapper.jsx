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
import {LinearGradient} from 'react-native-linear-gradient';
import ParagraphText from '../utils/PragraphText';
import {functionApi} from '../Api';
import axios from 'axios';
import {FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../Context/Contexter';
import {TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import truncateText from '../hooks/truncateText';
import {Font} from '../constants/Font';

const SuggestionWapper = ({refresh}) => {
  const {width, height} = Dimensions.get('window');
  const [profiles, setProfiles] = useState([]);
  const Navigation = useNavigation();
  const {setSelectedUser, user} = useData();
  const userSuggestions = useCallback(async () => {
    const res = await axios.get(`${functionApi}/Suggestions/users/${user._id}`);
    if (res.data) {
      setProfiles(res.data);
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
    <View style={{flexDirection: 'column', rowGap: 15}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
        }}>
        <Text
          style={{
            color: Colors.veryDarkGrey,
            letterSpacing: 0.3,
            fontSize: width * 0.043,
            fontFamily: Font.Medium,
          }}>
          Suggestions
        </Text>
        <TouchableOpacity
          onPress={() => {
            HandleShowMore();
          }}>
          <Text
            style={{
              letterSpacing: 0.3,
              fontSize: width * 0.03,
              color: Colors.veryDarkGrey,
              fontFamily: Font.Medium,
              textDecorationLine: 'underline',
            }}>
            Show more
          </Text>
        </TouchableOpacity>
      </View>
      {/* list */}
      <FlatList
        nestedScrollEnabled={true}
        horizontal
        initialNumToRender={2}
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
              // borderWidth: 0.2,
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
                  }}
                />
                <View style={{borderWidth: 0, flex: 1}}>
                  <Text
                    style={{
                      fontSize: width * 0.04,
                      color: Colors.veryDarkGrey,
                      textTransform: 'capitalize',
                      // fontWeight: '600',
                      letterSpacing: 0.3,
                      fontFamily: Font.Medium,
                    }}
                    numberOfLines={1}>
                    {truncateText(
                      user.item?.firstName + ' ' + user.item?.LastName,
                    )}
                    {/* {user.item?.firstName} {user.item?.LastName} */}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: width * 0.025,
                      color: Colors.mildGrey,
                      // fontWeight: '600',
                      letterSpacing: 0.3,
                      fontFamily: Font.Regular,
                    }}>
                    {truncateText(user.item?.InstitudeName)}
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
