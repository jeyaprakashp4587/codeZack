import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import HeadingText from '../utils/HeadingText';
import {Colors, pageView} from '../constants/Colors';
import Moment from 'moment';
import axios from 'axios';
import {functionApi} from '../Api';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Skeleton from '../Skeletons/Skeleton';
import FastImage from 'react-native-fast-image';
import {Font} from '../constants/Font';

const Placement = () => {
  const {width, height} = Dimensions.get('window');
  const [jobs, setjobs] = useState([]);
  const nav = useNavigation();
  const getAllJobs = useCallback(async () => {
    const res = await axios.get(`${functionApi}/Jobs/getAllJobs`);
    if (res.status == 200) {
      setjobs(res.data.jobs[0]?.Jobs);
    } else if (res.status(404)) {
      setjobs([]);
    }
  }, []);
  useEffect(() => {
    getAllJobs();
  }, [getAllJobs]);

  const openURL = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Cannot open URL: ${url}`);
    }
  };
  // render skeleon
  if (!jobs) {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <View style={{paddingHorizontal: 15}}>
          <HeadingText text="Jobs" />
        </View>
        <View style={{flexDirection: 'column', rowGap: 10, margin: 15}}>
          <Skeleton width="100%" height={height * 0.3} radius={20} />
          <Skeleton width="100%" height={height * 0.3} radius={20} />
          <Skeleton width="100%" height={height * 0.3} radius={20} />
        </View>
      </View>
    );
  }
  if (jobs.length <= 0) {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <View style={{paddingHorizontal: 15}}>
          <HeadingText text="Jobs" />
        </View>
        <View style={{flexDirection: 'column', rowGap: 10, margin: 15}}>
          <Text
            style={{
              fontSize: width * 0.035,
              color: Colors.veryDarkGrey,
              letterSpacing: 1,
              fontWeight: '600',
              fontFamily: Font.Regular,
            }}>
            No Jobs
          </Text>
        </View>
      </View>
    );
  }
  //  ---
  return (
    <View style={pageView}>
      {/* header */}
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Jobs" />
      </View>
      <View
        style={{
          paddingHorizontal: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 10,
        }}>
        <Text
          style={{
            fontSize: width * 0.045,
            fontWeight: '600',
            color: Colors.veryDarkGrey,
            letterSpacing: 1,
            fontFamily: Font.Medium,
          }}>
          Recommended Jobs{' '}
        </Text>
        <Text
          style={{
            borderColor: Colors.mildGrey,
            paddingHorizontal: 15,
            textAlign: 'center',
            borderRadius: 10,
            borderWidth: 1,
            fontSize: width * 0.035,
            fontFamily: Font.Medium,
            height: 20,
          }}>
          {jobs?.length}
        </Text>
      </View>
      {/* job lists */}
      <FlatList
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        initialNumToRender={2}
        data={jobs}
        renderItem={({item, index}) => (
          <View
            key={index}
            style={{
              // borderWidth: 1,
              padding: 10,
              borderColor: Colors.lightGrey,
              borderRadius: 10,
              flexDirection: 'column',
              rowGap: 10,
              marginHorizontal: 15,
              elevation: 2,
              backgroundColor: 'white',
              marginVertical: 8,
            }}>
            <LinearGradient
              colors={[item?.BgColor, 'white']}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              style={{
                backgroundColor: item?.BgColor,
                borderRadius: 10,
                padding: 10,
                flexDirection: 'column',
                rowGap: 7,
                borderColor: item?.BgColor,
                // elevation: 4,
              }}>
              {/* head */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  // borderWidth: 1,
                  borderColor: item?.BgColor,
                }}>
                <Text
                  style={{
                    backgroundColor: 'white',
                    textAlign: 'center',
                    // width: '40%',
                    padding: 5,
                    borderRadius: 20,
                    letterSpacing: 2,
                    paddingHorizontal: 10,
                    fontFamily: Font.Regular,
                    fontSize: width * 0.03,
                  }}>
                  {item?.Date}
                </Text>
              </View>
              {/* company details */}
              <View
                style={{
                  flexDirection: 'row',
                  // borderWidth: 1,
                  justifyContent: 'space-between',
                  borderColor: item?.BgColor,
                  alignItems: 'center',
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: width * 0.04,
                      fontFamily: Font.Medium,
                      letterSpacing: 0.3,
                    }}>
                    {item?.CompanyName}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '400',
                      fontSize: width * 0.045,
                      fontFamily: Font.SemiBold,
                    }}>
                    {item?.JobTitle}
                  </Text>
                </View>
                <View>
                  <FastImage
                    priority={FastImage.priority.high}
                    source={{uri: item?.CompanyLogo}}
                    style={{width: 50, height: 50, resizeMode: 'contain'}}
                    resizeMode="contain"
                  />
                </View>
              </View>
              {/* job types */}
              <View
                style={{
                  flexDirection: 'row',
                  // borderWidth: 1,
                  columnGap: 10,
                  borderColor: item?.BgColor,
                }}>
                {item?.JobType?.map((i, index) => (
                  <Text
                    key={index}
                    style={{
                      // borderWidth: 1,
                      borderRadius: 20,
                      borderColor: Colors.mildGrey,
                      // paddingHorizontal: 10,
                      paddingVertical: 2,
                      color: Colors.mildGrey,
                      fontFamily: Font.Medium,
                      letterSpacing: 0.3,
                    }}>
                    {i}
                  </Text>
                ))}
              </View>

              {/* location */}
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: width * 0.035,
                  letterSpacing: 0.3,
                  // color: Colors.mildGrey,
                  fontFamily: Font.Medium,
                }}>
                {item?.JobLocation}
              </Text>
            </LinearGradient>

            {/* bottom wrapper */}
            <TouchableOpacity
              onPress={() => openURL(item?.url)}
              style={{
                // backgroundColor: 'black',
                padding: 15,
                borderRadius: 10,
                borderColor: Colors.lightGrey,
                // borderWidth: 1,
              }}>
              <Text
                style={{
                  // color: 'white',
                  textAlign: 'center',
                  fontWeight: '600',
                  letterSpacing: 1,
                  fontSize: width * 0.032,
                  // textDecorationLine: 'underline',
                  textDecorationColor: 'red',
                }}>
                Apply Now
              </Text>
              <View
                style={{
                  width: width * 0.16,
                  backgroundColor: item?.BgColor,
                  height: 10,
                  position: 'absolute',
                  top: height * 0.03,
                  alignSelf: 'center',
                  zIndex: -10,
                }}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default Placement;

const styles = StyleSheet.create({});
