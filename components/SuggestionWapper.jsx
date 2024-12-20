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
import {loginApi} from '../Api';
import axios from 'axios';
import {FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../Context/Contexter';
import {TouchableOpacity} from 'react-native';

const SuggestionWapper = ({trigger, refresh}) => {
  const {width, height} = Dimensions.get('window');
  const [profiles, setProfiles] = useState([]);
  const Navigation = useNavigation();
  const {setSelectedUser, user} = useData();
  const userSuggestions = useCallback(async () => {
    const res = await axios.get(`${loginApi}/Suggestions/users/${user._id}`);
    if (res.data) {
      setProfiles(res.data);
    }
  }, [refresh]);
  useEffect(() => {
    userSuggestions().then(() => {
      if (profiles.length <= 0) {
        trigger(false);
      }
    });
  }, [refresh]);
  const HandleClose = () => {
    trigger(false);
  };

  return (
    <View style={{flexDirection: 'column', rowGap: 5}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <ParagraphText text="Suggestions" />
        <TouchableOpacity onPress={HandleClose}>
          <FontAwesomeIcon icon={faTimes} size={18} color={Colors.mildGrey} />
        </TouchableOpacity>
      </View>
      {/* list */}
      <FlatList
        horizontal
        data={profiles}
        showsHorizontalScrollIndicator={false}
        renderItem={user => (
          <ImageBackground
            source={{uri: user.item?.Images?.coverImg}}
            style={{
              borderRadius: 7,
              overflow: 'hidden',
              marginRight: 10,
              borderWidth: 1,
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
                <Image
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
                <View style={{borderWidth: 0, flex: 1}}>
                  <Text
                    style={{
                      fontSize: width * 0.04,
                      color: Colors.veryDarkGrey,
                      textTransform: 'capitalize',
                      // fontWeight: '600',
                      letterSpacing: 1,
                    }}>
                    {user.item?.firstName} {user.item?.LastName}
                  </Text>
                  <Text
                    style={{
                      fontSize: width * 0.03,
                      color: Colors.mildGrey,
                      fontWeight: '600',
                      // letterSpacing: 1,
                    }}>
                    {user.item?.InstitudeName}
                  </Text>
                </View>
                <Ripple>
                  <FontAwesomeIcon
                    icon={faEye}
                    color={Colors.white}
                    size={23}
                  />
                </Ripple>
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
