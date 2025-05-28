import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';
import PostSkeleton from '../Skeletons/PostSkeleton';
import ProjectDetails from './ProjectDetails';
import {Font} from '../constants/Font';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {profileApi} from '../Api';

const ProjectPost = () => {
  const {width} = Dimensions.get('window');
  const navigation = useNavigation();
  // get all projects from server
  const [projects, setProjects] = useState([]);
  const getAllProjects = useCallback(async () => {
    try {
      const {status, data} = await axios.get(
        `${profileApi}/Freelancing/getAllProjects`,
      );
      if (status === 200) {
        setProjects(data.projects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      ToastAndroid.show('error on get projects', ToastAndroid.SHORT);
    }
  }, []);
  //
  useEffect(() => {
    getAllProjects();
  }, []);
  return (
    <View style={{backgroundColor: Colors.white, flex: 1}}>
      {/* header */}
      <View style={{paddingHorizontal: 15, borderWidth: 0}}>
        <HeadingText text="explore projects" />
      </View>
      <ScrollView
        style={{borderWidth: 0, paddingTop: 10}}
        showsVerticalScrollIndicator={false}>
        {projects.length <= 0 ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // borderWidth: 1,
              flex: 1,
              alignSelf: 'center',
            }}>
            <FastImage
              source={{uri: 'https://i.ibb.co/0scNLNQ/rb-4986.png'}}
              style={{width: width * 0.65, aspectRatio: 1}}
              priority={FastImage.priority.high}
            />
            <Text style={{fontFamily: Font.Medium, fontSize: width * 0.05}}>
              No projects found
            </Text>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{rowGap: 10, marginBottom: 10}}
            data={projects}
            renderItem={({item}) => <ProjectDetails post={item} />}
          />
        )}
      </ScrollView>
      {/* show hire button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('uploadProject')}
        style={{
          borderWidth: 0,
          backgroundColor: Colors.violet,
          padding: 15,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: 10,
        }}>
        <Image
          source={{
            uri: 'https://img.icons8.com/ios/100/hire-me.png',
          }}
          style={{width: 20, aspectRatio: 1, tintColor: Colors.white}}
        />
        <Text
          style={{
            fontFamily: Font.Medium,
            color: Colors.white,
            textAlign: 'center',
            letterSpacing: 0.25,
            fontSize: width * 0.04,
          }}>
          upload your project
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectPost;

const styles = StyleSheet.create({});
