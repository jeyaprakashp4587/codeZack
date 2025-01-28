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
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useData} from '../Context/Contexter';
import {Colors, pageView} from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {profileApi} from '../Api';
import Actitivity from '../hooks/ActivityHook';
import Skeleton from '../Skeletons/Skeleton';
import HeadingText from '../utils/HeadingText';
import Ripple from 'react-native-material-ripple';
import {
  TestIds,
  useInterstitialAd,
  useRewardedAd,
} from 'react-native-google-mobile-ads';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const InterviewPrep = () => {
  const {selectedCompany, user, setUser} = useData();
  const [userMile, setUserMile] = useState(null);
  const {width, height} = Dimensions.get('window');
  const [currentWeek, setCurrentWeek] = useState();
  const [currentQuestion, setCurrentQuestion] = useState();
  const questionCount = useRef(0);
  const [isShowHint, setIsShowHind] = useState(false);
  const AddCout = useRef(0);
  const [saveInfo, setSaveInfo] = useState(false);
  // load and destructure Reward add
  const {
    load: loadReward,
    isClosed: rewardClosed,
    show: showReward,
    isLoaded: rewardIsLoaded,
  } = useRewardedAd(
    __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3257747925516984/5831080677',
    {requestNonPersonalizedAdsOnly: true},
  );

  useEffect(() => {
    loadReward(); // Load rewarded ad on initial render
  }, [loadReward]);

  useEffect(() => {
    if (rewardClosed) {
      loadReward(); // Reload ad if it's closed
    }
  }, [rewardClosed, loadReward]);
  // load reward and destructure Reward add
  const {
    load: loadInterest,
    isClosed: interestClosed,
    show: showInterest,
    isLoaded: interestIsLoaded,
  } = useInterstitialAd(
    __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3257747925516984/2804627935',
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );

  useEffect(() => {
    loadInterest(); // Load interstitial ad on initial render
  }, [loadInterest]);

  useEffect(() => {
    if (interestClosed) {
      loadInterest(); // Reload ad if it's closed
    }
  }, [interestClosed, loadInterest]);
  const increaseCount = useCallback(async () => {
    try {
      setCurrentQuestion(prev => prev + 1);
      setIsShowHind(false);
      setSaveInfo(false);
      questionCount.current += 1;
      AddCout.current += 1;
      // Show interstitial ad every 10 questions
      if (AddCout.current % 10 === 0 && interestIsLoaded) {
        await showInterest();
      }
      // Show rewarded ad every 5 questions (but not on multiples of 10)
      if (
        AddCout.current % 5 === 0 &&
        AddCout.current % 10 !== 0 &&
        rewardIsLoaded
      ) {
        await showReward();
      }
    } catch (error) {
      console.error('Error in increaseCount:', error);
    }
  }, [rewardIsLoaded, interestIsLoaded, showInterest, showReward]);
  const decreaseCount = () => {
    try {
      saveInfo(false);
      setCurrentQuestion(prev => prev - 1);
      setIsShowHind(false);
      questionCount.current -= 1;
    } catch (error) {
      console.log(error);
    }
  };

  // Function to send current question to the server
  const setQuestionLength = useCallback(async () => {
    try {
      // console.log('Current Question:', questionCount.current); // Logs the current value
      const {status, data} = await axios.post(
        `${profileApi}/InterView/setQuestionLength`,
        {
          userId: user?._id,
          companyName: selectedCompany?.company_name || selectedCompany,
          currentQuestion: questionCount.current, // Send the updated value
        },
      );
      if (status === 200) {
        setUser(prev => ({...prev, InterView: data.InterView})); // Update user state
        setSaveInfo(true);
      }
    } catch (error) {
      console.error('Error sending question length:', error); // Log error
    }
  }, []); // Add dependencies to the useCallback

  // Find user milestone for the selected company
  const findCompanyName = async () => {
    const companyName = user?.InterView?.find(
      name => name.companyName === selectedCompany?.company_name,
    );
    if (companyName) {
      setUserMile(companyName);
      // console.log(companyName);
      setCurrentQuestion(companyName?.currentQuestionLength);
      questionCount.current = companyName?.currentQuestionLength;
    }
  };
  const setWeek = weekIndex => {
    if (userMile) {
      const findWeek = selectedCompany?.weeks?.find(
        week => week.week == weekIndex,
      );
      if (findWeek) {
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
    setIsShowHind(true);
  };
  // submit task
  const submitTask = useCallback(async () => {
    if (userMile?.currentWeek - 1 >= 6) {
      console.log('Current Week:', userMile?.currentWeek);
      ToastAndroid.show(
        'Congrats!, you finished your preparations',
        ToastAndroid.SHORT,
      );
      try {
        await Actitivity(
          user?._id,
          `Finished ${
            selectedCompany?.company_name || selectedCompany
          } Prepations`,
        );
      } catch (error) {
        console.error('Error calling Actitivity:', error);
      }
      return;
    }
    try {
      const response = await axios.post(`${profileApi}/InterView/submitTask`, {
        userId: user?._id,
        companyName: selectedCompany?.company_name || selectedCompany,
      });
      if (response.data) {
        // console.log(response.data);
        setWeek(response.data.week);
        setUser(prev => ({...prev, InterView: response.data.userInterView}));
        setCurrentQuestion(0);
      } else {
        throw new Error('Unexpected response from the server');
      }
    } catch (error) {
      console.log(error);
    }
  }, [user, selectedCompany]);
  // render ui
  if (!currentWeek) {
    return (
      <View
        style={{
          flexDirection: 'column',
          rowGap: 10,
          paddingHorizontal: 15,
          backgroundColor: 'white',
          flex: 1,
        }}>
        <Skeleton width="100%" height={50} radius={10} />
        <Skeleton width="100%" height={30} radius={10} />
        <Skeleton width="100%" height={80} radius={10} />
        <Skeleton width="100%" height={height * 0.4} radius={10} />
        <Skeleton width="100%" height={height * 0.4} radius={10} />
      </View>
    );
  }
  // --
  return (
    <View style={pageView}>
      {/* Header */}
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Preparation" />
      </View>
      <View
        style={{
          paddingHorizontal: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{width: width * 0.3, height: height * 0.1}}>
          <Image
            source={{uri: selectedCompany?.companyLogo}}
            style={{width: '100%', height: '100%', resizeMode: 'contain'}}
          />
        </View>
        <Text
          style={{
            color: Colors.mildGrey,
            letterSpacing: 2,
            fontSize: width * 0.034,
          }}>
          Completed Weeks: {userMile?.currentWeek - 1 ?? 0}
        </Text>
      </View>
      {/* sections */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{paddingHorizontal: 15, flexDirection: 'column', rowGap: 10}}>
          <Text
            style={{
              fontWeight: '600',
              letterSpacing: 2,
              fontSize: width * 0.044,
            }}>
            week: {currentWeek?.week ?? 0}
          </Text>
          <Text
            style={{
              fontWeight: '600',
              letterSpacing: 2,
              fontSize: width * 0.03,
            }}>
            Focus Area: {currentWeek?.focus_area}
          </Text>
          <Text
            style={{
              fontWeight: '600',
              letterSpacing: 2,
              color: 'black',
              lineHeight: 20,
              fontSize: width * 0.023,
            }}>
            Topics: {currentWeek?.topics}
          </Text>
        </View>

        {/* questions area */}
        <View style={{paddingHorizontal: 15, marginTop: 20}}>
          <View
            style={{
              // borderWidth: 0.7,
              padding: 20,
              borderColor: Colors.lightGrey,
              borderRadius: 5,
              flexDirection: 'column',
              rowGap: 10,
              elevation: 3,
              backgroundColor: 'white',
            }}>
            <Text
              style={{
                letterSpacing: 2,
                fontWeight: '600',
                lineHeight: 25,
                fontSize: width * 0.034,
              }}>
              {currentQuestion + 1}
              {')'}.Question:{' '}
              {currentWeek?.sample_questions[currentQuestion]?.question}
            </Text>
            {/* this algorithm fror weelk 1 that means  apptitiute*/}
            {currentWeek?.week == 1 && (
              <Text
                style={{
                  letterSpacing: 2,
                  lineHeight: 25,
                  color: '#ff5400',
                  fontSize: width * 0.034,
                }}>
                Answer: {currentWeek?.sample_questions[currentQuestion]?.answer}
              </Text>
            )}
            {/* this algorithm fror week > 1 that means coding*/}
            {currentWeek?.week > 1 && (
              <Text
                style={{
                  letterSpacing: 2,
                  lineHeight: 25,
                  color: Colors.mildGrey,
                  // fontWeight: '600',
                  fontSize: width * 0.034,
                }}>
                Input: {currentWeek?.sample_questions[currentQuestion]?.input}
              </Text>
            )}
            {currentWeek?.week > 1 && (
              <Text
                style={{
                  letterSpacing: 2,
                  lineHeight: 25,
                  color: Colors.mildGrey,
                  // fontWeight: '600',
                  fontSize: width * 0.03,
                }}>
                Output: {currentWeek?.sample_questions[currentQuestion]?.output}
              </Text>
            )}
            {/* this is explanatio is common */}
            <Text
              style={{
                letterSpacing: 1.3,
                lineHeight: 20,
                color: '#1a535c',
                fontWeight: '600',
                fontSize: width * 0.024,
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
                  display: isShowHint ? 'flex' : 'none',
                }}>
                code: {currentWeek?.sample_questions[currentQuestion]?.code}
              </Text>
            )}
            {/* button */}
            <View
              style={{
                flexDirection: 'row',
                // borderWidth: 1,
                borderColor: 'white',
                justifyContent: 'space-between',
              }}>
              {/* previous button setting */}
              {currentQuestion > 0 && (
                <TouchableOpacity
                  onPress={() => decreaseCount()}
                  style={{
                    // backgroundColor: '',
                    padding: 5,
                    borderRadius: 5,
                    borderColor: '#233d4d',
                    // borderWidth: 0.5,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    columnGap: 5,
                    paddingHorizontal: 10,
                  }}>
                  <Ionicons
                    name="arrow-back-circle-outline"
                    size={17}
                    color="#233d4d"
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#233d4d',
                      letterSpacing: 1,
                      fontSize: width * 0.03,
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
                    // backgroundColor: Colors.violet,
                    padding: 7,
                    borderRadius: 5,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    columnGap: 5,
                    borderColor: Colors.violet,
                    // borderWidth: 0.5,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Colors.violet,
                      letterSpacing: 1,
                      fontSize: width * 0.03,
                    }}>
                    Submit
                  </Text>
                  <Ionicons
                    name="rocket-outline"
                    size={17}
                    color={Colors.violet}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => increaseCount()}
                  style={{
                    padding: 7,
                    borderRadius: 5,
                    width: width * 0.25,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    columnGap: 5,
                    // borderWidth: 0.5,
                    borderColor: Colors.violet,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Colors.violet,
                      letterSpacing: 1,
                      fontSize: width * 0.03,
                    }}>
                    Next
                  </Text>
                  <Ionicons
                    name="arrow-forward-circle-outline"
                    size={17}
                    color={Colors.violet}
                  />
                </TouchableOpacity>
              )}
            </View>
            {/* save prgess */}
            <Ripple
              onPress={() => setQuestionLength()}
              style={{
                borderWidth: 0.3,
                borderColor: Colors.lightGrey,
                padding: 10,
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                columnGap: 6,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  letterSpacing: 1,
                  color: saveInfo ? 'green' : Colors.mildGrey,
                  fontSize: width * 0.03,
                  borderWidth: 1,
                  alignSelf: 'center',
                  borderColor: 'white',
                }}>
                {saveInfo ? 'saved' : 'Save your progress'}
              </Text>
              {saveInfo ? (
                <AntDesign name="check" size={width * 0.04} color="green" />
              ) : (
                <SimpleLineIcons name="cloud-upload" size={width * 0.04} />
              )}
            </Ripple>
          </View>
        </View>
        {/* coding webview */}
        {currentWeek?.week > 1 && (
          <View style={{marginTop: 20}}>
            {/* <WebView
              javaScriptEnabled={true}
              style={{height: 600}}
              source={{
                uri: 'https://www.programiz.com/java-programming/online-compiler/',
              }}
            /> */}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default InterviewPrep;

const styles = StyleSheet.create({});
