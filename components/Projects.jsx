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
import PragraphText from '../utils/PragraphText';
import {Colors} from '../constants/Colors';
import Ripple from 'react-native-material-ripple';

const Projects = () => {
  const {user} = useData();
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
  return (
    <View>
      <FlatList
        data={projects}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={{
              //   borderWidth: 1,
              marginLeft: index == 0 && 15,
              marginRight: 15,
              padding: 15,
              flexDirection: 'column',
              rowGap: 10,
              borderRadius: 5,
              elevation: 2,
              backgroundColor: 'white',
              margin: 5,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 10,
              }}>
              <View style={{rowGap: 5}}>
                {/* discount label*/}
                {item?.Discount && (
                  <Text
                    style={{
                      backgroundColor: 'red',
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
                <Text>Rs: {item?.Technologies[0]?.Price} /-</Text>
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
            <Ripple
              style={{
                borderWidth: 0.5,
                padding: 5,
                borderRadius: 5,
                borderColor: Colors.mildGrey,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: width * 0.03,
                  letterSpacing: 1,
                  color: Colors.mildGrey,
                }}>
                Let's Explore
              </Text>
              {/* <View
                style={{
                  width: width * 0.15,
                  borderBottomWidth: 3,
                  alignSelf: 'center',
                  borderBottomColor: Colors.violet,
                  borderRadius: 50,
                }}
              /> */}
            </Ripple>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Projects;

const styles = StyleSheet.create({});
