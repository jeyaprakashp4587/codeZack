import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useData} from '../../Context/Contexter';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Skeleton from '../../Skeletons/Skeleton';
import LinearGradient from 'react-native-linear-gradient';
import {Font} from '../../constants/Font';
import {challengesApi} from '../../Api';
import {Colors} from '../../constants/Colors';
import HeadingText from '../../utils/HeadingText';

const AllProjects = () => {
  const {setSelectedProject} = useData();
  const navigation = useNavigation();
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
            limit: 10,
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
    getAllProjects();
  }, []);

  const handleSelectProject = useCallback(
    async project => {
      try {
        navigation.navigate('selectedProject');
        setSelectedProject(project);
      } catch (error) {}
    },
    [navigation],
  );
  if (projects.length <= 0) {
    return (
      <View
        style={{
          backgroundColor: Colors.white,
          flex: 1,
          paddingHorizontal: 15,
        }}>
        <View>
          <HeadingText text="All Projects" />
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          {Array.from({length: 3}).map((_, index) => (
            <View key={index} style={{marginBottom: 10}}>
              <Skeleton width={width * 0.9} height={200} radius={10} />
            </View>
          ))}
        </View>
      </View>
    );
  }
  return (
    <View
      style={{
        backgroundColor: Colors.white,
        flex: 1,
        paddingHorizontal: 15,
      }}>
      <View>
        <HeadingText text="All Projects" />
      </View>
      <FlatList
        nestedScrollEnabled={true}
        data={projects}
        // horizontal
        estimatedItemSize={250}
        initialNumToRender={3}
        numColumns={2}
        keyExtractor={item => item?._id}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        // contentContainerStyle={{borderWidth: 1}}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          //   borderWidth: 1,
        }}
        renderItem={({item, index}) => (
          <View
            key={index}
            style={{
              borderRadius: 5,
              overflow: 'hidden',
              opacity: 0.9,
              height: height * 0.27,
              elevation: 2,
              margin: 3,
              width: '46%',
              marginBottom: 10,
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
                      fontSize: width * 0.037,
                    }}>
                    {item?.name}
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: Font.SemiBold,
                      fontSize: width * 0.025,
                    }}>
                    Full assets
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleSelectProject(item)}
                    style={{
                      padding: 7,
                      borderRadius: 15,
                      marginTop: 10,
                      backgroundColor: Colors.violet,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: width * 0.033,
                        textAlign: 'center',
                        // letterSpacing: 0.4,
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

export default AllProjects;
