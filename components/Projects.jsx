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
import Skeleton from '../Skeletons/Skeleton';
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
        {
          params: {
            limit: 3,
            page: 0,
          },
        },
      );
      if (status === 200 && data) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  }, []);

  // call the function using useeffect
  useEffect(() => {
    setLoading(true);
    getAllProjects().finally(() => {
      setLoading(false);
    });
  }, []);
  //handle select project and navigate
  const navigation = useNavigation();
  const handleSelectProject = useCallback(
    async project => {
      try {
        navigation.navigate('selectedProject');
        setSelectedProject(project);
      } catch (error) {}
    },
    [navigation],
  );

  if (projects?.length <= 0) {
    return (
      <View
        style={{
          marginBottom: 5,
          flexDirection: 'row',
          columnGap: 10,
          paddingHorizontal: 15,
        }}>
        <Skeleton width={width * 0.6} height={height * 0.2} radius={20} />
        <Skeleton width={width * 0.6} height={height * 0.2} radius={20} />
      </View>
    );
  }
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 15,
          // borderWidth: 1,
          marginBottom: 10,
        }}>
        <Text
          style={{
            fontFamily: Font.Medium,
            fontSize: width * 0.041,
            letterSpacing: 0.25,
          }}>
          Web-dev projects
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('allProjects');
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
      <FlatList
        nestedScrollEnabled={true}
        data={projects}
        horizontal
        estimatedItemSize={250}
        initialNumToRender={2}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <View
            style={{
              borderRadius: 5,
              overflow: 'hidden',
              width: width * 0.7,
              marginRight: 10,
              opacity: 0.9,
              marginLeft: index == 0 && 15,
              height: height * 0.22,
              elevation: 2,
              margin: 3,
            }}>
            <ImageBackground
              source={{uri: item?.img}}
              resizeMode="cover"
              style={{flex: 1}}>
              <LinearGradient
                colors={['white', 'white', 'rgba(255, 255, 255, 0)']}
                start={{x: 1, y: 1}}
                end={{x: 1, y: 0}}
                style={{
                  flex: 1,
                  padding: 20,
                  justifyContent: 'flex-end',
                  paddingBottom: 10,
                }}>
                <View
                  style={{
                    rowGap: 2,
                    // borderWidth: 2,
                  }}>
                  <Text
                    style={{
                      // letterSpacing: 0.4,
                      color: 'black',
                      fontFamily: Font.SemiBold,
                      fontSize: width * 0.04,
                    }}>
                    {item?.name}
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: Font.SemiBold,
                      fontSize: width * 0.03,
                    }}>
                    Full assets
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleSelectProject(item)}
                    style={{
                      padding: 9,
                      borderRadius: 15,
                      marginTop: 10,
                      backgroundColor: Colors.violet,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: width * 0.033,
                        textAlign: 'center',
                        letterSpacing: 0.4,
                        fontFamily: Font.Medium,
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
