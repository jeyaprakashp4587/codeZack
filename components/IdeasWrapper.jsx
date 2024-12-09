import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import Ripple from 'react-native-material-ripple';
import {Colors} from '../constants/Colors';
import {debounce} from 'lodash';
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
// ---
const IdeasWrapper = () => {
  const navigation = useNavigation();
  // ideas wrapper naivagtions
  const debounceNavigation = useCallback(
    debounce(route => navigation.navigate(route), 100),
    [],
  );
  const carrerNav = useCallback(() => debounceNavigation('carrerScreen'), []);
  const courseNav = useCallback(() => debounceNavigation('yourcourse'), []);
  const activityNav = useCallback(
    () => debounceNavigation('youractivities'),
    [],
  );
  const assignmentNav = useCallback(() => {
    debounceNavigation('Assignments');
  }, []);
  return (
    // <View style={{flex: 1}}>
    <View style={styles.ideasWrapper}>
      <View style={{backgroundColor: 'white'}}>
        <Ripple style={styles.ideaBox} onPress={carrerNav}>
          <Image
            style={styles.icon}
            source={{uri: 'https://i.ibb.co/gddf19J/programming.png'}}
          />
        </Ripple>

        {/* <SimpleLineIcons name="book-open" size={25} color="#264653" /> */}
        <Text style={styles.ideaText} numberOfLines={1}>
          Courses
        </Text>
      </View>
      <View style={{backgroundColor: 'white'}}>
        <Ripple onPress={courseNav} style={styles.ideaBox}>
          <Image
            style={styles.icon}
            source={{uri: 'https://i.ibb.co/NmNqJpx/certificate.png'}}
          />
        </Ripple>

        {/* <AntDesign name="laptop" size={25} color="#2a9d8f" /> */}
        <Text numberOfLines={1} style={styles.ideaText}>
          Your Courses
        </Text>
      </View>
      <View>
        {/* <SimpleLineIcons name="notebook" size={25} color="#e9c46a" /> */}
        <Ripple onPress={assignmentNav} style={styles.ideaBox}>
          <Image
            style={styles.icon}
            source={{uri: 'https://i.ibb.co/N19pNf3/assignment.png'}}
          />
        </Ripple>

        <Text numberOfLines={1} style={styles.ideaText}>
          Assignments
        </Text>
      </View>
      <View>
        {/* <Fontisto name="date" size={25} color="#e76f51" /> */}
        <Ripple onPress={activityNav} style={styles.ideaBox}>
          <Image
            style={styles.icon}
            source={{uri: 'https://i.ibb.co/B3CdkDM/calendar.png'}}
          />
        </Ripple>
        <Text style={styles.ideaText} numberOfLines={1}>
          Your Activities
        </Text>
      </View>
    </View>
    // </View>
  );
};

export default IdeasWrapper;

const styles = StyleSheet.create({
  ideasWrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  ideaBox: {
    width: width * 0.2,
    height: height * 0.1,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    rowGap: 10,
  },
  icon: {
    width: '70%',
    height: '70%',
    opacity: 0.78,
  },
  ideaText: {
    color: Colors.mildGrey,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: height * 0.01,
    fontSize: width * 0.025,
    fontWeight: '400',
  },
});
