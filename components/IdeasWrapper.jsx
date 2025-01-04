import {Dimensions, Image, Text, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import Ripple from 'react-native-material-ripple';
import {debounce} from 'lodash';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../constants/Colors';

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
        color: 'hsl(12, 76%, 96%)',
        icon: 'https://i.ibb.co/gddf19J/programming.png',
      },
      {
        name: 'Your Courses',
        function: courseNav,
        color: 'hsl(41, 76%, 95%)',
        icon: 'https://i.ibb.co/NmNqJpx/certificate.png',
      },
      {
        name: 'Assignments',
        function: assignmentNav,
        color: 'hsl(120, 100%, 98%)',
        icon: 'https://i.ibb.co/N19pNf3/assignment.png',
      },
      {
        name: 'Your Activities',
        function: activityNav,
        color: 'hsl(200, 92%, 95%)',
        icon: 'https://i.ibb.co/B3CdkDM/calendar.png',
      },
    ],
    [carrerNav, courseNav, activityNav, assignmentNav],
  );

  return (
    <View style={{flex: 1, marginVertical: 15}}>
      <View
        style={{
          flexDirection: 'row',
          // borderWidth: 1,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          marginHorizontal: 15,
        }}>
        {IdeaData.map((item, index) => (
          <LinearGradient
            start={index % 2 === 0 ? {x: 1, y: 0} : {x: 0, y: 0}}
            end={index % 2 === 0 ? {x: 0, y: 1} : {x: 1, y: 1}}
            colors={['white', item.color, 'white']}
            style={{
              width: '47%',
              borderRadius: 10,
              height: height * 0.09,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 1.5,
              overflow: 'hidden',
            }}>
            <Ripple
              style={{width: '100%', height: '100%', justifyContent: 'center'}}
              onPress={() => item.function()}>
              <Text
                style={{
                  textAlign: 'center',
                  color: Colors.veryDarkGrey,
                  letterSpacing: 1,
                  fontSize: width * 0.028,
                  fontWeight: '600',
                }}>
                {item.name}
              </Text>
              {/* icons */}
              <Image
                source={{uri: item.icon}}
                style={{
                  width: 40,
                  height: 40,
                  // tintColor: Colors.veryLightGrey,
                  position: 'absolute',
                  left: width * 0.04,
                  opacity: 0.2,
                }}
              />
            </Ripple>
          </LinearGradient>
        ))}
      </View>
    </View>
  );
};

export default IdeasWrapper;
