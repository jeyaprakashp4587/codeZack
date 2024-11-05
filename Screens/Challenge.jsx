import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  ImageBackground,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Colors, pageView} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';
import PragraphText from '../utils/PragraphText';
import {useData} from '../Context/Contexter';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCode} from '@fortawesome/free-solid-svg-icons';
import {ScrollView} from 'react-native';
import {Dimensions} from 'react-native';
import BannerAdd from '../Adds/BannerAdd';

const Challenge = ({navigation}) => {
  const {setselectedChallengeTopic} = useData();
  const {width, height} = Dimensions.get('window');
  // Memoize the challenge data to avoid recalculating the array on every render
  const Challenges = useMemo(
    () => [
      {
        ChallengeName: 'Web Development',
        bgColor: '#284b63',
      },
      {
        ChallengeName: 'App Development',
        bgColor: '#6b9080',
      },
    ],
    [],
  );
  // Memoize the handler to prevent re-creation on every render
  const HandleSelectChallenges = useCallback(
    item => {
      navigation.navigate('chooseChallenge');
      setselectedChallengeTopic(item.ChallengeName);
    },
    [navigation, setselectedChallengeTopic],
  );

  // State for toggling challenges, initialize with a proper default value
  const [chToggle, setChaToggle] = useState(null);
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Develop Your Skills Here" />
      </View>
      <View
        style={{
          borderWidth: 0,
          paddingVertical: 20,
          paddingHorizontal: 15,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          rowGap: 15,
        }}>
        {Challenges.map((item, index) => (
          <TouchableOpacity
            onPress={() => HandleSelectChallenges(item)}
            key={index}
            style={{
              width: '45%',
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: item.bgColor,
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              elevation: 5,
              flexDirection: 'row',
              padding: 10,
            }}>
            <PragraphText
              text={item.ChallengeName}
              fsize={width * 0.03}
              color={item.bgColor}
            />
          </TouchableOpacity>
        ))}
        {/* java */}
        <TouchableOpacity
          onPress={() => {
            setChaToggle(!chToggle);
            setselectedChallengeTopic('Java');
            navigation.navigate('CoreChallenge');
          }}
          style={{
            width: '45%',
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#f4a261',
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            elevation: 5,
            flexDirection: 'row',
            padding: 10,
          }}>
          <PragraphText text="Java" fsize={width * 0.03} color={'#f4a261'} />
        </TouchableOpacity>
        {/* ptyhon */}
        <TouchableOpacity
          onPress={() => {
            setChaToggle(!chToggle);
            setselectedChallengeTopic('Python');
            navigation.navigate('CoreChallenge');
          }}
          style={{
            // width: width * 0.4,
            width: '45%',
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#2a9d8f',
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            elevation: 5,
            flexDirection: 'row',
            padding: 10,
          }}>
          <PragraphText text="Python" fsize={width * 0.03} color={'#2a9d8f'} />
        </TouchableOpacity>
        {/* c++ */}
        <TouchableOpacity
          onPress={() => {
            setChaToggle(!chToggle);
            setselectedChallengeTopic('C++');
            navigation.navigate('CoreChallenge');
          }}
          style={{
            width: '45%',
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#264653',
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            elevation: 5,
            flexDirection: 'row',
            padding: 10,
          }}>
          <PragraphText text="C++" fsize={width * 0.03} color={'#264653'} />
        </TouchableOpacity>
        {/* user challenges list */}
        <TouchableOpacity
          onPress={() => {
            setChaToggle(!chToggle);
            navigation.navigate('yourchallenges');
          }}
          style={{
            width: '45%',
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#457b9d',
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            elevation: 5,
            flexDirection: 'row',
            padding: 10,
          }}>
          <PragraphText
            text="My Challenges"
            fsize={width * 0.03}
            color={'#457b9d'}
          />
        </TouchableOpacity>
      </View>
      {/* add */}
      <BannerAdd />
    </ScrollView>
  );
};

export default React.memo(Challenge);

const styles = StyleSheet.create({});
