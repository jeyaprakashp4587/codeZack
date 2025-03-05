import {Dimensions, FlatList, Image, Text, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import Ripple from 'react-native-material-ripple';
import {debounce} from 'lodash';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../constants/Colors';
import FastImage from 'react-native-fast-image';

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
        color: 'hsl(30, 100%, 94%)',
        icon: 'https://i.ibb.co/gddf19J/programming.png',
      },
      {
        name: 'Your Courses',
        function: courseNav,
        color: 'hsl(278, 83%, 95%)',
        icon: 'https://i.ibb.co/NmNqJpx/certificate.png',
      },
      {
        name: 'Assignments',
        function: assignmentNav,
        color: '#E7F9EE',
        icon: 'https://i.ibb.co/N19pNf3/assignment.png',
      },
      {
        name: 'Your Activities',
        function: activityNav,
        color: 'hsl(200, 86%, 93%)',
        icon: 'https://i.ibb.co/B3CdkDM/calendar.png',
      },
    ],
    [carrerNav, courseNav, activityNav, assignmentNav],
  );

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          // borderWidth: 1,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 15,
        }}>
        <FlatList
          nestedScrollEnabled={true}
          data={IdeaData}
          keyExtractor={item => item._id}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            padding: 2,
          }}
          renderItem={({item, index}) => (
            <Ripple
              style={{
                width: '48%',
                borderRadius: 10,
                height: height * 0.09,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // elevation: 0.8,
                overflow: 'hidden',
                marginBottom: 10,
                backgroundColor: item.color,
              }}
              onPress={() => item.function()}>
              <Text
                style={{
                  textAlign: 'center',
                  color: Colors.veryDarkGrey,
                  letterSpacing: 1,
                  fontSize: width * 0.028,
                  fontWeight: '700',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.name}
              </Text>
              {/* icons */}
              <FastImage
                priority={FastImage.priority.high}
                source={{uri: item.icon}}
                style={{
                  width: 40,
                  height: 40,
                  position: 'absolute',
                  left: width * 0.04,
                  opacity: 0.4,
                }}
              />
            </Ripple>
          )}
        />
      </View>
    </View>
  );
};

export default IdeasWrapper;
