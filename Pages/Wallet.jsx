import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import TopicsText from '../utils/TopicsText';
import {useData} from '../Context/Contexter';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../constants/Colors';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faGooglePay} from '@fortawesome/free-brands-svg-icons/faGooglePay';
import Ripple from 'react-native-material-ripple';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const Wallet = () => {
  const {user} = useData();
  const {width, height} = Dimensions.get('window');
  const strategies = [
    {text: 'Daily check in', price: 1},
    {text: 'Enrolled any one course', price: 2},
    {text: 'Complete any one challenge', price: 1},
    {text: 'Spend 45 minutes in Study center', price: 1},
    {text: 'Take one assignment and complete with pass mark', price: 1},
    {text: '', price: 1},
  ];
  const io = 1;
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
          // height: height * 0.3,
          margin: 15,
          borderRadius: 10,
          elevation: 5,
          padding: 20,
          flexDirection: 'column',
          justifyContent: 'space-between',
          rowGap: 30,
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
              // fontWeight: '600',
              fontSize: width * 0.06,
            }}>
            {user?.firstName} {user?.LastName}
          </Text>
        </View>
        <View>
          <Text style={{color: '#bc4b51', fontWeight: '600', letterSpacing: 2}}>
            <Text style={{color: 'black', letterSpacing: 2}}>
              Your Wallet:{' '}
            </Text>
            <Fontawesome name="rupee" color="black" /> 200 /-
          </Text>
          <View style={{flexDirection: 'column', rowGap: 10}}>
            <FontAwesomeIcon icon={faGooglePay} size={40} color="#051923" />
            <Text style={{fontSize: width * 0.03, letterSpacing: 2}}>
              Account Name: Not found
            </Text>
            <Text style={{fontSize: width * 0.03, letterSpacing: 2}}>
              UPI ID or Number: Not found
            </Text>
            <Ripple
              style={{backgroundColor: 'white', padding: 10, borderRadius: 10}}>
              <Text
                style={{
                  textAlign: 'center',
                  letterSpacing: 2,
                  fontSize: width * 0.03,
                }}>
                Change Payment Detail
              </Text>
            </Ripple>
          </View>
        </View>
      </LinearGradient>
      {/* with draw */}
      <View
        style={{paddingHorizontal: 15, flexDirection: 'column', rowGap: 15}}>
        <Text style={{letterSpacing: 2, lineHeight: 35}}>
          After you first earn{' '}
          <Text style={{fontWeight: '600', color: '#f94144'}}>100</Text> or more
          then you can withdraw your money
        </Text>
        {/* radio */}
        <View
          style={{
            borderWidth: 1,
            borderRadius: 20,
            marginVertical: 10,
            // overflow: 'hidden',
            borderColor: Colors.lightGrey,
          }}>
          <Text
            style={{
              position: 'absolute',
              zIndex: 10,
              top: -height * 0.03,
              left: `${io}%`,
            }}>
            <Fontawesome name="rupee" />
            {io}
          </Text>
          <View
            style={{
              height: 15,
              width: `${io}%`,
              backgroundColor:
                io <= 20
                  ? '#ed6a5a'
                  : io >= 21 && io <= 50
                  ? '#ffc43d'
                  : '#06d6a0',
              borderRadius: 20,
            }}
          />
        </View>
        <TouchableOpacity
          disabled={true}
          style={{backgroundColor: '#1a659e', padding: 15, borderRadius: 10}}>
          <Text style={{color: 'white', letterSpacing: 2, textAlign: 'center'}}>
            WithDraw
          </Text>
        </TouchableOpacity>
      </View>
      {/* strategies */}
      <View
        style={{
          paddingHorizontal: 15,
          marginVertical: 15,
          flexDirection: 'column',
          rowGap: 10,
        }}>
        <Text style={{fontSize: width * 0.05, letterSpacing: 2}}>
          Money earning strategies
        </Text>
        <View
          style={{
            borderWidth: 0,
            height: height * 0.3,
            borderRadius: 10,
            backgroundColor: 'white',
            elevation: 2,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            rowGap: 10,
          }}>
          <SimpleLineIcons name="lock" color="#ffd100" size={45} />
          <TouchableOpacity
            style={{backgroundColor: '#577399', padding: 10, borderRadius: 10}}>
            <Text style={{color: 'white', letterSpacing: 2}}>
              Watch add to unlock
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Wallet;

const styles = StyleSheet.create({});
