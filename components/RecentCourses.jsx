import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import TopicsText from '../utils/TopicsText';
import {useData} from '../Context/Contexter';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../constants/Colors';

const RecentCourses = () => {
  const {width, height} = Dimensions.get('window');
  const {user, setselectedTechnology} = useData();
  const navigation = useNavigation();
  const newCourseIndex = user?.Courses?.length - 1;
  if (user?.Courses?.length <= 0) {
    return null;
  }
  return (
    <View style={{paddingHorizontal: 15, marginVertical: 10}}>
      <Text
        style={{
          fontSize: width * 0.042,
          letterSpacing: 1,
          color: Colors.mildGrey,
          marginBottom: 10,
        }}>
        Recent Course
      </Text>
      <View
        style={{
          padding: 20,
          borderRadius: 5,
          // elevation: ,
          backgroundColor: 'white',
          rowGap: 15,
          borderColor: Colors.veryLightGrey,
          flexDirection: 'column',
          borderWidth: 1,
        }}>
        <Text
          style={{
            fontWeight: '600',
            fontSize: width * 0.03,
            letterSpacing: 1,
          }}>
          {user?.Courses[newCourseIndex]?.Course_Name}
        </Text>
        <FlatList
          data={user.Courses[newCourseIndex]?.Technologies}
          horizontal
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('learn');
                setselectedTechnology({web: item.TechWeb, name: item.TechName});
              }}
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 5,
                marginRight: 20,
              }}>
              <Image
                source={{uri: item?.TechIcon}}
                style={{width: width * 0.1, aspectRatio: 1}}
              />
              <MaterialIcons name="start" />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default RecentCourses;

const styles = StyleSheet.create({});
