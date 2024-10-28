import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import TopicsText from '../utils/TopicsText';
import {useData} from '../Context/Contexter';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../constants/Colors';

const Wallet = () => {
  const {user} = useData();
  const {width, height} = Dimensions.get('window');
  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{paddingHorizontal: 15}}>
        <TopicsText text="Your Wallet" />
      </View>
      {/* user profile */}
      <LinearGradient
        colors={[Colors.violet, 'white']}
        style={{
          borderWidth: 0,
          height: height * 0.3,
          margin: 15,
          borderRadius: 10,
          elevation: 5,
          padding: 20,
        }}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 10}}>
          <Image
            source={{uri: user?.Images?.profile}}
            style={{
              width: 55,
              height: 55,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: 'white',
            }}
          />
          <Text
            style={{
              letterSpacing: 2,
              color: 'white',
              fontWeight: '600',
              fontSize: width * 0.06,
            }}>
            {user?.firstName} {user?.LastName}
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default Wallet;

const styles = StyleSheet.create({});
