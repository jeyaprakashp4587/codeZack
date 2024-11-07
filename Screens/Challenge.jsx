import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  ImageBackground,
  FlatList,
} from 'react-native';
import HeadingText from '../utils/HeadingText';
import PragraphText from '../utils/PragraphText';
import {useData} from '../Context/Contexter';
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
  const CoreChallenges = useMemo(() => [
    {
      challengeName: 'Java',
      color: '#f4a261',
      web: 'https://www.programiz.com/java-programming/online-compiler/',
    },
    {
      challengeName: 'Python',
      color: '#2a9d8f',
      web: 'https://www.programiz.com/python-programming/online-compiler/',
    },
    {
      challengeName: 'C++',
      color: '#264653',
      web: 'https://www.programiz.com/cpp-programming/online-compiler/',
    },
  ]);
  const handleCoreChallenge = useCallback(item => {
    setselectedChallengeTopic(item);
    navigation.navigate('CoreChallenge');
  });
  // Memoize the handler to prevent re-creation on every render
  const HandleSelectChallenges = useCallback(
    item => {
      navigation.navigate('chooseChallenge');
      setselectedChallengeTopic(item?.ChallengeName);
    },
    [navigation, setselectedChallengeTopic],
  );

  // State for toggling challenges, initialize with a proper default value
  const [chToggle, setChaToggle] = useState(null);
  return (
    <ScrollView
      style={{backgroundColor: 'white'}}
      showsVerticalScrollIndicator={false}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Develop Your Skills Here" />
      </View>
      <View
        style={{
          borderWidth: 0,
          paddingVertical: 20,
          paddingHorizontal: 15,
          flexDirection: 'column',
          rowGap: 15,
        }}>
        {Challenges.map((item, index) => (
          <TouchableOpacity
            onPress={() => HandleSelectChallenges(item)}
            key={index}
            style={{
              width: '100%',
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: item.bgColor,
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              elevation: 2,
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
      </View>
      {/* add */}
      <BannerAdd />
      {/* core challenges */}
      <View
        style={{
          borderWidth: 0,
          paddingVertical: 20,
          paddingHorizontal: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <FlatList
          data={CoreChallenges}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.challengeName}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => handleCoreChallenge(item)}
              style={{
                width: '100%',
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: item.color,
                height: 100,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                // elevation: 2,
                flexDirection: 'row',
                padding: 10,
                marginBottom: 15,
              }}>
              <PragraphText
                text={item.challengeName}
                fsize={width * 0.03}
                color={item.color}
              />
            </TouchableOpacity>
          )}
        />
      </View>
      {/* user challenges list */}
      <TouchableOpacity
        onPress={() => {
          setChaToggle(!chToggle);
          navigation.navigate('yourchallenges');
        }}
        style={{
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#457b9d',
          height: 100,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          elevation: 2,
          flexDirection: 'row',
          padding: 10,
          marginHorizontal: 15,
        }}>
        <PragraphText
          text="My Challenges"
          fsize={width * 0.03}
          color={'#457b9d'}
        />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default React.memo(Challenge);

const styles = StyleSheet.create({});
