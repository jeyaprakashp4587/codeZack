import {Dimensions, FlatList, Image, Text, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import Ripple from 'react-native-material-ripple';
import {debounce} from 'lodash';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../constants/Colors';
import FastImage from 'react-native-fast-image';
import {Font} from '../constants/Font';

const {width, height} = Dimensions.get('window');

const IdeasWrapper = () => {
  const navigation = useNavigation();

  // Debounced navigation function
  const debounceNavigation = useCallback(
    debounce(route => navigation.navigate(route), 100),
    [navigation],
  );

  // Navigation callbacks
  const carrerNav = useCallback(
    () => debounceNavigation('carrerScreen'),
    [debounceNavigation],
  );
  const courseNav = useCallback(
    () => debounceNavigation('yourcourse'),
    [debounceNavigation],
  );
  const activityNav = useCallback(
    () => debounceNavigation('youractivities'),
    [debounceNavigation],
  );
  const assignmentNav = useCallback(
    () => debounceNavigation('Assignments'),
    [debounceNavigation],
  );

  // Data for rendering
  const IdeaData = useMemo(
    () => [
      {
        name: 'Choose your Carrer',
        function: carrerNav,
        color: 'hsla(31, 100.00%, 93.90%, 0.30)',
        icon: 'https://i.ibb.co/gddf19J/programming.png',
      },
      {
        name: 'Your Courses',
        function: courseNav,
        color: 'hsla(277, 84.00%, 95.10%, 0.30)',
        icon: 'https://i.ibb.co/NmNqJpx/certificate.png',
      },
      {
        name: 'Assignments',
        function: assignmentNav,
        color: 'rgba(210, 248, 213, 0.3))',
        icon: 'https://i.ibb.co/N19pNf3/assignment.png',
      },
      {
        name: 'Your Activities',
        function: activityNav,
        color: 'hsla(201, 88.60%, 93.10%, 0.30)',
        icon: 'https://i.ibb.co/B3CdkDM/calendar.png',
      },
    ],
    [carrerNav, courseNav, activityNav, assignmentNav],
  );
  {
    /* <Card icon="💻" title="Choose Your Career" color="bg-[#F0F4FF]" />
  <Card icon="📘" title="Your Courses" color="bg-[#FFF2F8]" />
  <Card icon="📝" title="Assignments" color="bg-[#F0FFF4]" />
  <Card icon="📅" */
  }
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 15,
          // borderWidth: 1,
        }}>
        <FlatList
          nestedScrollEnabled={true}
          data={IdeaData}
          keyExtractor={item => item._id}
          numColumns={2}
          initialNumToRender={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          contentContainerStyle={{rowGap: 10}}
          renderItem={({item, index}) => (
            <Ripple
              style={{
                width: '48%',
                borderRadius: 10,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                backgroundColor: item.color,
                rowGap: 10,
                paddingVertical: 10,
              }}
              onPress={() => item.function()}>
              {/* icons */}
              <FastImage
                priority={FastImage.priority.high}
                source={{uri: item.icon}}
                style={{
                  width: width * 0.1,
                  aspectRatio: 1,
                  opacity: 0.68,
                }}
              />
              <Text
                style={{
                  textAlign: 'center',
                  color: Colors.violet,
                  letterSpacing: 0.3,
                  fontSize: width * 0.03,
                  fontFamily: Font.SemiBold,
                }}>
                {item.name}
              </Text>
            </Ripple>
          )}
        />
      </View>
    </View>
  );
};

export default IdeasWrapper;
