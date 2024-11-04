import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import TopicsText from '../utils/TopicsText';
import {useData} from '../Context/Contexter';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../constants/Colors';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faGooglePay} from '@fortawesome/free-brands-svg-icons/faGooglePay';
import Ripple from 'react-native-material-ripple';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import axios from 'axios';
import Api from '../Api';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';

const Wallet = () => {
  const {user, setUser} = useData();
  const Navigation = useNavigation();
  const {width, height} = Dimensions.get('window');
  const strategies = [
    {text: 'Daily check in', price: 1},
    {text: 'Enrolled any one course', price: 2},
    {text: 'Complete any one challenge', price: 2},
    {
      text: 'Spend 45 minutes in Study center',
      price: 5,
    },
    {text: 'Take one assignment and pass', price: 5},
    {text: 'Refer Your Friends', price: 5},
  ];
  // withDraw
  const [withdrawAmount, setWitharawAmout] = useState();

  const HandleWithdraw = async () => {
    if (user?.Wallet?.TotalWallet < 100) {
      ToastAndroid.show(
        'Insufficient balance. You need at least 100 to withdraw.',
        ToastAndroid.LONG,
      );
      return;
    } else if (user?.Wallet?.TotalWallet < withdrawAmount) {
      ToastAndroid.show(
        'Your balance is insufficient for the requested amount.',
        ToastAndroid.LONG,
      );
      return;
    }
    try {
      const response = await axios.post(`${Api}/Wallet/withdrawal`, {
        userId: user?._id,
        userName: `${user?.firstName} ${user?.LastName}`,
        accountName: user?.Wallet?.GpayAccount?.GpayAccountName,
        upiId: user?.Wallet?.GpayAccount?.GpayUpiId,
        amount: withdrawAmount,
      });

      if (response.status === 200) {
        setUser(response.data);
        ToastAndroid.show(
          'Withdrawal request sent successfully.',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      console.error('Error during withdrawal:', error);

      // Use a single catch block to handle all errors
      const errorMessage =
        error.response?.data?.message ||
        'Failed to process withdrawal. Please try again.';
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    }
  };

  // const change gpay details
  const [GpayAccountName, setGpayAccountName] = useState();
  const [GpayUpiId, setGpayUpiId] = useState();
  const [updateModelShow, setUpdateModelShow] = useState(false);
  const ChangeGpayDetails = useCallback(async () => {
    // console.log(GpayAccountName);
    if (GpayAccountName && GpayUpiId) {
      const res = await axios.post(
        `${Api}/Wallet/ChangeGpayDetails/${user?._id}`,
        {
          GpayAccountName,
          GpayUpiId,
        },
      );
      if (res.status === 200) {
        setUser(res.data);
        setUpdateModelShow(false);
      }
    } else {
      ToastAndroid.show('Fill the all Fields', ToastAndroid.BOTTOM);
    }
  }, [GpayAccountName, GpayUpiId]);
  return (
    <ScrollView
      style={{flex: 1, backgroundColor: 'white'}}
      showsVerticalScrollIndicator={false}>
      <View style={{paddingHorizontal: 15}}>
        <TopicsText text="Your Wallet" mb={10} />
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
            <Fontawesome name="rupee" color="black" />{' '}
            {user?.Wallet?.TotalWallet}
            /-
          </Text>
          <View style={{flexDirection: 'column', rowGap: 10}}>
            <FontAwesomeIcon icon={faGooglePay} size={40} color="#051923" />
            <Text style={{fontSize: width * 0.03, letterSpacing: 2}}>
              Account Name: {user?.Wallet?.GpayAccount?.GpayAccountName}
            </Text>
            <Text style={{fontSize: width * 0.03, letterSpacing: 2}}>
              UPI ID or Number: {user?.Wallet?.GpayAccount?.GpayUpiId}
            </Text>
            <Ripple
              onPress={() => setUpdateModelShow(true)}
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
        {/* model view  */}
        <Modal style={{flex: 1}} transparent={true} visible={updateModelShow}>
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                width: '70%',
                padding: 20,
                flexDirection: 'column',
                rowGap: 10,
              }}>
              <TouchableOpacity onPress={() => setUpdateModelShow(false)}>
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{alignSelf: 'flex-end'}}
                  color={Colors.mildGrey}
                />
              </TouchableOpacity>
              <TextInput
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor: Colors.veryLightGrey,
                }}
                placeholder="Enter GPay Account Name"
                onChangeText={text => setGpayAccountName(text)}
              />
              <TextInput
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor: Colors.veryLightGrey,
                }}
                placeholder="Enter GPay UPI Id"
                onChangeText={text => setGpayUpiId(text)}
              />
              <Ripple
                onPress={() => ChangeGpayDetails()}
                style={{backgroundColor: '#3d405b', padding: 10}}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    letterSpacing: 2,
                  }}>
                  Update
                </Text>
              </Ripple>
            </View>
          </View>
        </Modal>
      </LinearGradient>
      {/* with draw */}
      <View
        style={{paddingHorizontal: 15, flexDirection: 'column', rowGap: 15}}>
        <Text style={{letterSpacing: 2, lineHeight: 35}}>
          After you first earn{' '}
          <Text style={{fontWeight: '600', color: '#f94144'}}>100</Text> or more
          than you can withdraw your money
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
              left: `${
                user.Wallet.TotalWallet >= 100
                  ? width * 0.22
                  : user.Wallet.TotalWallet
              }%`,
            }}>
            <Fontawesome name="rupee" />
            {user.Wallet.TotalWallet}
          </Text>
          <View
            style={{
              height: 15,
              width: `${
                user.Wallet.TotalWallet >= 100 ? 100 : user.Wallet.TotalWallet
              }%`,
              backgroundColor:
                user.Wallet.TotalWallet <= 20
                  ? '#ed6a5a'
                  : user.Wallet.TotalWallet >= 21 &&
                    user.Wallet.TotalWallet <= 50
                  ? '#ffc43d'
                  : '#06d6a0',
              borderRadius: 20,
            }}
          />
        </View>
        {/* withdraw textipnut */}
        <View style={{flexDirection: 'column', rowGap: 10}}>
          <Text
            style={{
              letterSpacing: 2,
              color: Colors.mildGrey,
              fontSize: width * 0.04,
            }}>
            Withdrawal Rules:
          </Text>
          <Text
            style={{
              letterSpacing: 2,
              color: Colors.mildGrey,
              fontSize: width * 0.03,
            }}>
            • Minimum balance required: 100
          </Text>
          <Text
            style={{
              letterSpacing: 2,
              color: Colors.mildGrey,
              fontSize: width * 0.03,
            }}>
            • Requested amount should not exceed your balance
          </Text>
          <Text
            style={{
              letterSpacing: 2,
              color: Colors.mildGrey,
              fontSize: width * 0.03,
            }}>
            • We will process your withdrawal within 2 days
          </Text>
        </View>
        <TextInput
          placeholder="Enter amount"
          style={{
            borderWidth: 1,
            padding: 10,
            borderColor: Colors.veryLightGrey,
            color: Colors.mildGrey,
          }}
          keyboardType="numeric"
          onChangeText={setWitharawAmout}
        />
        <TouchableOpacity
          onPress={HandleWithdraw}
          style={{backgroundColor: '#1a659e', padding: 15, borderRadius: 10}}>
          <Text style={{color: 'white', letterSpacing: 2, textAlign: 'center'}}>
            WithDraw
          </Text>
        </TouchableOpacity>
      </View>
      {/* withdraw history */}
      {user?.Wallet?.WithdrawHistory.length > 0 && (
        <View style={{paddingHorizontal: 15, marginVertical: 10}}>
          <TopicsText text="Withdraw History" />

          <FlatList
            data={user?.Wallet?.WithdrawHistory}
            renderItem={({item}) => (
              <TouchableOpacity style={{marginBottom: 10}}>
                <Text style={{letterSpacing: 2, color: Colors.mildGrey}}>
                  Withdraw Amount:{' '}
                  <Text style={{color: 'red'}}>{item?.WithdrawAmount}</Text>
                </Text>
                <Text style={{letterSpacing: 2, color: Colors.mildGrey}}>
                  Withdraw status:{' '}
                  <Text style={{color: 'green'}}>{item?.status}</Text>
                </Text>
                <Text style={{letterSpacing: 2, color: Colors.mildGrey}}>
                  Time:
                  <Text style={{color: 'orange'}}>{item?.Time} </Text>
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
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
        {/* unlock add */}
        <View
          style={{
            borderWidth: 0,
            // height: height * 0.3,
            borderRadius: 10,
            backgroundColor: 'white',
            elevation: 2,
            flexDirection: 'column',
            rowGap: 10,
            padding: 15,
          }}>
          <FlatList
            data={strategies}
            renderItem={({item}) => (
              <View
                style={{
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  columnGap: 3,
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: Colors.veryLightGrey,
                  backgroundColor: '#edf2fb',
                  borderRadius: 5,
                  borderWidth: 1,
                }}>
                <Text style={{letterSpacing: 1, color: Colors.mildGrey}}>
                  {item.text}:
                </Text>
                <Fontawesome name="rupee" />
                <Text style={{color: '#22223b'}}>{item.price}</Text>
              </View>
            )}
          />
        </View>
        {/* <View
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
        </View> */}
      </View>
    </ScrollView>
  );
};

export default Wallet;

const styles = StyleSheet.create({});
