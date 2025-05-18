import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../constants/Colors';
import {Font} from '../constants/Font';
import FastImage from 'react-native-fast-image';
import Skeleton from '../Skeletons/Skeleton';
import {useNavigation} from '@react-navigation/native';

const GetStart = () => {
  const {width, height} = Dimensions.get('window');
  const [load, setLoad] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 500);
  }, []);
  if (load) {
    return (
      <View
        style={{
          backgroundColor: Colors.veryDarkGrey,
          flex: 1,
          paddingHorizontal: 20,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          rowGap: 20,
        }}>
        <Skeleton width={200} height={35} radius={50} />
        <Skeleton width={200} height={35} radius={50} />
        <Skeleton width={300} height={205} radius={50} />
        <Skeleton width={200} height={15} radius={50} />
        <Skeleton width={220} height={55} radius={50} />
      </View>
    );
  }
  return (
    <View
      style={{
        backgroundColor: Colors.veryDarkGrey,
        flex: 1,
        paddingHorizontal: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 10,
      }}>
      <View>
        <Text
          style={{
            fontFamily: Font.SemiBold,
            color: 'rgb(65, 144, 209)',
            fontSize: width * 0.14,
            textAlign: 'center',
          }}>
          Zacky
        </Text>
        <Text
          style={{
            fontFamily: Font.Medium,
            color: Colors.white,
            fontSize: width * 0.06,
            textAlign: 'center',
            letterSpacing: 0.4,
          }}>
          coding Arena
        </Text>
      </View>
      <FastImage
        source={{
          uri: 'https://i.ibb.co/XrP87C5h/girls-boys-competing-esports-cup-using-pc-winning-cup-gaming-championship-flat-illustration.png',
          priority: FastImage.priority.high,
        }}
        resizeMode="contain"
        style={{width: width * 0.9, aspectRatio: 1}}
      />
      {/* show online active users */}
      <View style={{flexDirection: 'row', alignItems: 'center', columnGap: 5}}>
        <View
          style={{
            width: 10,
            aspectRatio: 1,
            backgroundColor: 'green',
            borderRadius: 50,
          }}
        />
        <Text
          style={{
            fontFamily: Font.Medium,
            color: Colors.white,
            fontSize: width * 0.03,
            textAlign: 'center',
            letterSpacing: 0.4,
          }}>
          online: 20
        </Text>
      </View>
      {/* choose dificulty levels */}
      <TouchableOpacity
        style={{
          backgroundColor: 'rgb(65, 144, 209)',
          width: '80%',
          marginHorizontal: 'auto',
          padding: 10,
          borderRadius: 50,
        }}
        onPress={() => navigation.navigate('matchFixing')}>
        <Text
          style={{
            color: Colors.veryDarkGrey,
            textAlign: 'center',
            fontFamily: Font.Medium,
            letterSpacing: 0.3,
          }}>
          Get Start
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GetStart;

const styles = StyleSheet.create({});
