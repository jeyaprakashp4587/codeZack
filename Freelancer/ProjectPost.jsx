import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';
import PostSkeleton from '../Skeletons/PostSkeleton';
import ProjectDetails from './ProjectDetails';
import {Font} from '../constants/Font';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

const ProjectPost = () => {
  const {width} = Dimensions.get('window');
  const navigation = useNavigation();
  return (
    <View style={{backgroundColor: Colors.white, flex: 1}}>
      {/* header */}
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="explore projects" />
      </View>
      <ScrollView style={{borderWidth: 0}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{rowGap: 10, marginBottom: 10}}
          data={Array.from({length: 4})}
          renderItem={({item}) => <ProjectDetails post={item} />}
        />
      </ScrollView>
      {/* show hire button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('uploadProject')}
        style={{
          borderWidth: 0,
          backgroundColor: Colors.veryDarkGrey,
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
