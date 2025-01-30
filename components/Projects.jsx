import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {challengesApi} from '../Api';
import {useData} from '../Context/Contexter';
import axios from 'axios';
import {Colors} from '../constants/Colors';
import Ripple from 'react-native-material-ripple';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  TestIds,
  useInterstitialAd,
  useRewardedAd,
} from 'react-native-google-mobile-ads';
import Skeleton from '../Skeletons/Skeleton';

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
  // Reload the ad after it is closed
  useEffect(() => {
    if (isClosed) {
      load();
    }
  }, [isClosed, load]);

  //   handle select project and navigate
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
          marginBottom: 10,
          flexDirection: 'row',
          columnGap: 10,
          borderWidth: 1,
        }}>
        <Skeleton width={width * 0.6} height={height * 0.14} radius={20} />
        <Skeleton width={width * 0.6} height={height * 0.14} radius={20} />
      </View>
    );
  }
  return (
    <View>
      <FlatList
        nestedScrollEnabled={true}
        data={projects}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <View
            style={{
              borderWidth: 1,
              marginLeft: index == 0 && 15,
              marginRight: 15,
              padding: 15,
              flexDirection: 'column',
              rowGap: 10,
              borderRadius: 5,
              // elevation: 1,
              backgroundColor: 'white',
              margin: 5,
              justifyContent: 'space-between',
              borderColor: Colors.veryLightGrey,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 20,
              }}>
              <View style={{rowGap: 5}}>
                {/* discount label*/}
                {item?.Discount && (
                  <Text
                    style={{
                      backgroundColor: '#ff6666',
                      paddingHorizontal: 10,
                      paddingVertical: 1,
                      color: 'white',
                      fontSize: width * 0.024,
                      borderRadius: 20,
                      alignSelf: 'flex-start',
                      fontWeight: '600',
                      letterSpacing: 1,
                    }}>
                    20%
                  </Text>
                )}
                <Text style={{fontWeight: '600', letterSpacing: 1}}>
                  {item?.name}
                </Text>
                <Text
                  style={{
                    fontSize: width * 0.03,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                  }}>
                  Rs: {item?.Technologies[0]?.Price} /-
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: 10,
                  }}>
                  <Image
                    source={{
                      uri: 'https://i.ibb.co/FDtYbfG/icons8-technical-support-80.png',
                    }}
                    style={{
                      width: width * 0.06,
                      aspectRatio: 1,
                    }}
                  />
                  <Text
                    style={{
                      letterSpacing: 1,
                      fontSize: width * 0.02,
                      color: Colors.mildGrey,
                    }}
                    numberOfLines={2}>
                    24x7 Technical Support
                  </Text>
                </View>
              </View>
              <View>
                <Image
                  source={{uri: item?.img}}
                  style={{width: width * 0.13, aspectRatio: 1}}
                />
              </View>
            </View>
            <LinearGradient
              style={{borderRadius: 5}}
              colors={['#fff9f3', '#eef7fe']}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 1}}>
              <Ripple
                onPress={() => handleSelectProject(item)}
                style={{
                  padding: 7,
                  borderRadius: 25,
                  borderColor: Colors.violet,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: width * 0.03,
                    letterSpacing: 1,
                    color: Colors.mildGrey,
                  }}>
                  Coming Soon
                </Text>
              </Ripple>
            </LinearGradient>
          </View>
        )}
      />
    </View>
  );
};

export default Projects;

const styles = StyleSheet.create({});
