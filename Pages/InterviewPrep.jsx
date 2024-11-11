import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useData} from '../Context/Contexter';
import {Colors, pageView} from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useInterstitialAd from '../Adds/useInterstitialAd';
import WebView from 'react-native-webview';
import BannerAdd from '../Adds/BannerAdd';
import axios from 'axios';
import Api from '../Api';

const InterviewPrep = () => {
  const {selectedCompany, user, setUser} = useData();
  const [userMile, setUserMile] = useState(null);
  const {width, height} = Dimensions.get('window');
  const [currentWeek, setCurrentWeek] = useState();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isShowHint, setIsShowHind] = useState(false);
  const {isLoaded, loadAd, showAd} = useInterstitialAd();
  // Find user milestone for the selected company
  const findCompanyName = async () => {
    const companyName = user?.InterView?.find(
      name => name.companyName === selectedCompany?.company_name,
    );
    if (companyName) {
      setUserMile(companyName);
    }
  };
  // Set the current week based on user milestone
  const setWeek = weekIndex => {
    if (userMile) {
      const findWeek = selectedCompany?.weeks?.find(
        week => week.week == weekIndex,
      );
      if (findWeek) {
        console.log(weekIndex);
        console.log('find week', findWeek);
        setCurrentWeek(findWeek);
      }
    }
  };
  // Fetch user milestone when `selectedCompany` or `user` changes
  useEffect(() => {
    findCompanyName();
  }, [selectedCompany, user]);
  // Set current week whenever `userMile` updates
  useEffect(() => {
    setWeek(userMile?.currentWeek);
  }, [userMile]);
  // show hint
  const showHint = () => {
    if (isLoaded) {
      showAd().then(data => {
        if (data.success) {
          setIsShowHind(true);
        } else {
          ToastAndroid.show(data.message, ToastAndroid.SHORT);
        }
      });
    }
  };
  // submit task
  const submitTask = useCallback(async () => {
    try {
      const response = await axios.post(`${Api}/InterView/submitTask`, {
        userId: user?._id,
        companyName: selectedCompany?.company_name || selectedCompany,
      });
      if (response.data) {
        console.log(response.data);
        setWeek(response.data);
        setCurrentQuestion(0);
      } else {
        throw new Error('Unexpected response from the server');
      }
    } catch (error) {
      console.log(error);
    }
  }, [user, selectedCompany]);

  return (
    <View style={pageView}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderWidth: 1,
          borderColor: 'white',
        }}>
        <View style={{width: width * 0.3, height: height * 0.1}}>
          <Image
            source={{uri: selectedCompany?.companyLogo}}
            style={{width: '100%', height: '100%', resizeMode: 'contain'}}
          />
        </View>
        <Text style={{color: Colors.mildGrey, letterSpacing: 2}}>
          Completed Weeks: {userMile?.currentWeek - 1 ?? 0}
        </Text>
      </View>
      {/* sections */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{paddingHorizontal: 15, flexDirection: 'column', rowGap: 10}}>
          <Text style={{fontWeight: '600', letterSpacing: 2}}>
            week: {currentWeek?.week ?? 0}
          </Text>
          <Text style={{fontWeight: '600', letterSpacing: 2}}>
            Focus Area: {currentWeek?.focus_area}
          </Text>
          <Text
            style={{
              fontWeight: '600',
              letterSpacing: 2,
              color: Colors.violet,
              lineHeight: 25,
            }}>
            Topics: {currentWeek?.topics}
          </Text>
        </View>
        {/* Banner add */}
        <BannerAdd />
        {/* questions area */}
        <View style={{paddingHorizontal: 15, marginTop: 20}}>
          <View
            style={{
              borderWidth: 1,
              padding: 20,
              borderColor: Colors.lightGrey,
              borderRadius: 5,
              flexDirection: 'column',
              rowGap: 20,
            }}>
            <Text
              style={{
                letterSpacing: 2,
                fontWeight: '600',
                lineHeight: 25,
              }}>
              {currentQuestion + 1}
              {')'}.Question:{' '}
              {currentWeek?.sample_questions[currentQuestion]?.question}
            </Text>
            {/* this algorithm fror weelk 1 that means  apptitiute*/}
            {currentWeek?.week == 1 && (
              <Text
                style={{letterSpacing: 2, lineHeight: 25, color: '#ff5400'}}>
                Answer: {currentWeek?.sample_questions[currentQuestion]?.answer}
              </Text>
            )}
            {/* this algorithm fror week > 1 that means coding*/}
            {currentWeek?.week > 1 && (
              <Text
                style={{
                  letterSpacing: 2,
                  lineHeight: 25,
                  color: '#197278',
                  fontWeight: '600',
                }}>
                Input: {currentWeek?.sample_questions[currentQuestion]?.input}
              </Text>
            )}
            {currentWeek?.week > 1 && (
              <Text
                style={{
                  letterSpacing: 2,
                  lineHeight: 25,
                  color: '#ee964b',
                  fontWeight: '600',
                }}>
                Output: {currentWeek?.sample_questions[currentQuestion]?.output}
              </Text>
            )}
            {/* this is explanatio is common */}
            <Text
              style={{
                letterSpacing: 2,
                lineHeight: 25,
                color: '#1a535c',
                fontWeight: '600',
              }}>
              Explanation:{' '}
              {currentWeek?.sample_questions[currentQuestion]?.explanation}
            </Text>
            {/* hint only for coding */}
            {currentWeek?.week > 1 && (
              <TouchableOpacity
                onPress={showHint}
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: 'white',
                  alignItems: 'center',
                  columnGap: 5,
                }}>
                <Ionicons name="bulb-outline" color="#ffca3a" size={20} />
                <Text>Hint</Text>
              </TouchableOpacity>
            )}
            {/* show code  */}
            {currentWeek?.week > 1 && (
              <Text
                style={{
                  letterSpacing: 2,
                  lineHeight: 25,
                  color: '#001233',
                  fontWeight: '600',
                  display: isShowHint ? 'flex' : 'none',
                }}>
                code: {currentWeek?.sample_questions[currentQuestion]?.code}
              </Text>
            )}
            {/* button */}
            <View
              style={{
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: 'white',
                justifyContent: 'space-between',
              }}>
              {/* previous button setting */}
              {currentQuestion > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setCurrentQuestion(prev => prev - 1);
                    setIsShowHind(false);
                  }}
                  style={{
                    backgroundColor: '#233d4d',
                    padding: 10,
                    borderRadius: 5,
                    width: width * 0.25,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Colors.white,
                      letterSpacing: 1,
                    }}>
                    previous
                  </Text>
                </TouchableOpacity>
              )}
              {/* next and submit button setting */}
              {currentQuestion == currentWeek?.sample_questions?.length - 1 ? (
                <TouchableOpacity
                  onPress={submitTask}
                  style={{
                    backgroundColor: '#fe7f2d',
                    padding: 10,
                    borderRadius: 5,
                    width: width * 0.25,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Colors.white,
                      letterSpacing: 1,
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setCurrentQuestion(prev => prev + 1);
                    setIsShowHind(false);
                  }}
                  style={{
                    backgroundColor: '#fe7f2d',
                    padding: 10,
                    borderRadius: 5,
                    width: width * 0.25,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Colors.white,
                      letterSpacing: 1,
                    }}>
                    Next
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        {/* coding webview */}
        {currentWeek?.week > 1 && (
          <View style={{marginTop: 20}}>
            <WebView
              javaScriptEnabled={true}
              style={{height: 600}}
              source={{
                uri: 'https://www.programiz.com/java-programming/online-compiler/',
              }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default InterviewPrep;

const styles = StyleSheet.create({});
