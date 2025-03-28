import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {challengesApi} from '../Api';
import {useData} from '../Context/Contexter';
import axios from 'axios';
import {Colors, font} from '../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {TestIds, useRewardedAd} from 'react-native-google-mobile-ads';
import Skeleton from '../Skeletons/Skeleton';
import FastImage from 'react-native-fast-image';
import {BlurView} from '@react-native-community/blur';
import {Font} from '../constants/Font';

const Projects = () => {
  const {setSelectedProject} = useData();
  // fetch all projects from server
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const {width, height} = Dimensions.get('window');
  const getAllProjects = useCallback(async () => {
    try {
      const {status, data} = await axios.get(
        `${challengesApi}/Challenges/getAllProjects`,
      );
      if (status == 200 && data) {
        setProjects(data.projects[0]?.Projects);
      }
    } catch (error) {
      console.log(error);
    }
  }, [projects]);
  // call the function using useeffect
  useEffect(() => {
    setLoading(true);
    getAllProjects().finally(() => {
      setLoading(false);
    });
  }, []);
  // load and destructuring add
  const {load, isLoaded, show, isClosed} = useRewardedAd(
    __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3257747925516984/2804627935',
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );
  useEffect(() => {
    load();
  }, [load]);
  // Reload the add after it is closed
  useEffect(() => {
    if (isClosed) {
      load();
    }
  }, [isClosed, load]);

  //handle select project and navigate
  const navigation = useNavigation();
  const handleSelectProject = useCallback(
    async project => {
      try {
        navigation.navigate('selectedProject');
        setSelectedProject(project);
        if (isLoaded) {
          await show();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [navigation, isLoaded, show],
  );

  if (projects.length <= 0) {
    return (
      <View
        style={{
          // paddingHorizontal: 15,
          marginBottom: 5,
          flexDirection: 'row',
          columnGap: 10,
          paddingHorizontal: 15,
          // borderWidth: 1,
        }}>
        <Skeleton width={width * 0.6} height={height * 0.2} radius={20} />
        <Skeleton width={width * 0.6} height={height * 0.2} radius={20} />
      </View>
    );
  }
  return (
    <View style={{marginBottom: 15}}>
      <FlatList
        nestedScrollEnabled={true}
        data={projects}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <View
            style={{
              borderRadius: 10,
              overflow: 'hidden',
              width: width * 0.7,
              marginRight: 10,
              opacity: 0.9,
              marginLeft: index == 0 && 15,
            }}>
            <ImageBackground source={{uri: item?.img}} resizeMode="cover">
              <LinearGradient
                colors={[
                  'rgb(0, 0, 0)',
                  'rgba(13, 13, 13, 0.88)',
                  'rgba(22, 22, 22, 0.62)',
                  'rgba(255, 255, 255, 0.2)',
                ]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{flex: 1, padding: 20}}>
                <View style={{rowGap: 5}}>
                  {/* crown icons */}
                  <FastImage
                    source={{
                      uri: 'https://img.icons8.com/color/96/fairytale.png',
                      priority: FastImage.priority.high,
                    }}
                    resizeMode="center"
                    style={{
                      position: 'absolute',
                      width: width * 0.05,
                      aspectRatio: 1,
                      right: 0,
                      top: 0,
                    }}
                  />
                  <Text
                    style={{
                      // fontWeight: '400',
                      letterSpacing: 1,
                      color: 'white',
                      fontFamily: Font.SemiBold,
                    }}>
                    {item?.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: width * 0.03,
                      // fontWeight: '600',
                      letterSpacing: 0.5,
                      color: 'white',
                      fontFamily: Font.Medium,
                    }}>
                    Get Full Assets
                  </Text>
                  <Text
                    style={{
                      letterSpacing: 1,
                      fontSize: width * 0.025,
                      color: Colors.veryLightGrey,
                      fontFamily: Font.Regular,
                    }}
                    numberOfLines={2}>
                    Technical Support (Time Limit)
                  </Text>
                  {/* <View style={{flexDirection: 'row', columnGap: 10}}>
                    <Image
                      source={{
                        uri: 'https://img.icons8.com/ios/100/android-os.png',
                      }}
                      style={{width: 20, aspectRatio: 1, tintColor: 'white'}}
                      resizeMode="contain"
                    />
                    <Image
                      source={{
                        uri: 'https://img.icons8.com/parakeet-line/100/globe.png',
                      }}
                      style={{width: 20, aspectRatio: 1, tintColor: 'white'}}
                      resizeMode="contain"
                    />
                  </View> */}
                  <TouchableOpacity
                    onPress={() => handleSelectProject(item)}
                    style={{
                      // borderWidth: 0.4,
                      borderColor: 'white',
                      padding: 7,
                      borderRadius: 15,
                      marginTop: 10,
                      backgroundColor: 'rgba(255, 255, 255, 0.20)',
                      // borderWidth: 0.5,
                    }}>
                    {/* git log update*/}
                    <Text
                      style={{
                        color: 'white',
                        fontSize: width * 0.03,
                        textAlign: 'center',
                        letterSpacing: 1,
                        fontFamily: Font.Light,
                      }}>
                      View
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>
        )}
      />
    </View>
  );
};

export default Projects;

const styles = StyleSheet.create({});
