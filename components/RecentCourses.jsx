import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import TopicsText from '../utils/TopicsText';
import {useData} from '../Context/Contexter';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../constants/Colors';
import FastImage from 'react-native-fast-image';

const RecentCourses = () => {
  const {width, height} = Dimensions.get('window');
  const {user, setselectedTechnology} = useData();
  const navigation = useNavigation();
  const [newCourseIndex, setNewCourseIndex] = useState(null);
  useEffect(() => {
    if (user?.Courses) {
      const index =
        user.Courses[user.Courses.length - 1]?.Technologies?.length <= 0
          ? user?.Courses?.length - 2
          : user?.Courses?.length - 1;
      setNewCourseIndex(index);
    }
  }, [user?.Courses]);

  if (user?.Courses?.length <= 0) {
    return null;
  }
  return (
    <View style={{paddingHorizontal: 15, marginVertical: 10}}>
      <Text
        style={{
          fontSize: width * 0.042,
          letterSpacing: 1,
          color: 'black',
          marginBottom: 10,
          fontWeight: '700',
        }}>
        Recent Course
      </Text>
      <View style={{borderRadius: 5, overflow: 'hidden'}}>
        <ImageBackground
          source={require('../assets/gend.jpg')}
          style={{
            padding: 20,
            rowGap: 10,
          }}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: width * 0.035,
              letterSpacing: 1,
              color: 'white',
            }}>
            {user?.Courses[newCourseIndex]?.Course_Name}
          </Text>
          <FlatList
            nestedScrollEnabled={true}
            data={user.Courses[newCourseIndex]?.Technologies}
            horizontal
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('learn');
                  setselectedTechnology({
                    web: item.TechWeb,
                    name: item.TechName,
                  });
                }}
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  columnGap: 5,
                  marginRight: 20,
                }}>
                <FastImage
                  priority={FastImage.priority.high}
                  source={{uri: item?.TechIcon}}
                  style={{width: width * 0.1, aspectRatio: 1}}
                />
                <MaterialIcons name="start" color="white" />
              </TouchableOpacity>
            )}
          />
        </ImageBackground>
      </View>
    </View>
  );
};

export default RecentCourses;

const styles = StyleSheet.create({});
