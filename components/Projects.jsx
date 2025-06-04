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
  //handle select project and navigate
  const navigation = useNavigation();
  const handleSelectProject = useCallback(
    async project => {
      try {
        navigation.navigate('selectedProject');
        setSelectedProject(project);
      } catch (error) {
        console.log(error);
      }
    },
    [navigation],
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
                colors={['white', 'white', 'rgba(255, 255, 255, 0.12)']}
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
                      letterSpacing: 0.4,
                      color: 'black',
                      fontFamily: Font.SemiBold,
                    }}>
                    {item?.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleSelectProject(item)}
                    style={{
                      // borderWidth: 0.4,
                      // borderColor: 'black',
                      padding: 8,
                      borderRadius: 15,
                      marginTop: 10,
                      // backgroundColor: 'rgba(255, 255, 255, 0.20)',
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
