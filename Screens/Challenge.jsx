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

import {Colors, pageView} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';
import PragraphText from '../utils/PragraphText';
import {useData} from '../Context/Contexter';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCode} from '@fortawesome/free-solid-svg-icons';
import {ScrollView} from 'react-native';
import {Dimensions} from 'react-native';

const Challenge = ({navigation}) => {
  const {selectedChallengeTopic, setselectedChallengeTopic} = useData();
  const {width, height} = Dimensions.get('window');
  // Memoize the challenge data to avoid recalculating the array on every render
  const Challenges = useMemo(
    () => [
      {
        ChallengeName: 'Web Development',
        bgColor: '#7575a3',
        img: 'https://i.ibb.co/qn5dFQL/data.png',
      },
      {
        ChallengeName: 'App Development',
        bgColor: '#8cb3d9',
        img: 'https://i.ibb.co/WcPBv7x/app.png',
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
    // <LinearGradient
    //   colors={["hsl(200, 100%, 96%)", "white", "white", "hsl(336, 100%, 97%)"]}
    //   style={{
    //     backgroundColor: "white",
    //     flex: 1,
    //     paddingHorizontal: width * 0.03,
    //   }}
    //   start={[0, 1]}
    //   end={[1, 0]}
    // >
    <ScrollView style={{paddingHorizontal: 20, backgroundColor: 'white'}}>
      <HeadingText text="Develop Your Skills Here" />
      <View style={{borderWidth: 0, paddingVertical: 20}}>
        {Challenges.map((item, index) => (
          <TouchableOpacity
            onPress={() => HandleSelectChallenges(item)}
            key={index}
            style={{
              width: '100%',
              backgroundColor: item.bgColor,
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              marginBottom: 30,
              elevation: 5,
              flexDirection: 'row',
              columnGap: 20,
            }}>
            <Image
              source={{uri: item.img}}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.veryLightGrey,
              }}
            />
            <PragraphText
              text={item.ChallengeName}
              fsize={19}
              color={Colors.veryLightGrey}
            />
          </TouchableOpacity>
        ))}
        {/* user challenges list */}

        <TouchableOpacity
          onPress={() => {
            setChaToggle(!chToggle);
            navigation.navigate('yourchallenges');
          }}
          style={{
            width: '100%',
            backgroundColor: '#009999',
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginBottom: 30,
            elevation: 5,
            flexDirection: 'row',
            columnGap: 20,
          }}>
          <FontAwesomeIcon icon={faCode} size={40} color="white" />
          <PragraphText text="My Challenges" fsize={19} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
    // </LinearGradient>
  );
};

export default React.memo(Challenge);

const styles = StyleSheet.create({});
