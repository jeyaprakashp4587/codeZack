import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import {useData} from '../Context/Contexter';
import HeadingText from '../utils/HeadingText';
import {Colors} from '../constants/Colors';
import FastImage from 'react-native-fast-image';
import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';
import {Font} from '../constants/Font';
import RNFS from 'react-native-fs';

const SelectedProject = () => {
  const {selectedProject} = useData();
  const {width, height} = Dimensions.get('window');
  const {load, isLoaded, show, isClosed, isEarnedReward} = useInterstitialAd(
    __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3257747925516984/2804627935',
    {
      requestNonPersonalizedAdsOnly: false,
    },
  );
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (isClosed) {
      load();
    }
  }, [isClosed]);
  // handle buy project
  const driveUrl =
    'https://drive.google.com/uc?export=download&id=1_DDhYfERJIl4S9BUDuNFiFskZYkoliNE';
  const fileName = 'my_folder.zip';
  const localPath = `${RNFS.DownloadDirectoryPath}/${fileName}`; // Saves in Downloads

  const handleBuyProject = useCallback(async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Storage permission is required.');
        return;
      }
    }

    const options = {
      fromUrl: driveUrl,
      toFile: localPath,
      background: true,
      discretionary: true,
    };
    RNFS.downloadFile(options)
      .promise.then(() => {
        Alert.alert('Download Complete', 'Folder downloaded successfully!');
      })
      .catch(error => {
        Alert.alert('Download Failed', error.message);
      });
  }, []);
  const [adCount, setAdCount] = useState(5);
  const watchAdd = useCallback(async () => {
    if (isLoaded) {
      await show();
    }
    if (isEarnedReward) setAdCount(prev => prev - 1);
  }, [isLoaded, isClosed, isEarnedReward, adCount]);
  return (
    <ScrollView
      style={{flex: 1, backgroundColor: 'white'}}
      showsVerticalScrollIndicator={false}>
      {/* header */}
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text={selectedProject?.name} />
      </View>
      {/* contact */}
      <View
        style={{
          borderWidth: 0,
          paddingHorizontal: 15,
          flexDirection: 'column',
          rowGap: 20,
        }}>
        <FastImage
          priority={FastImage.priority.high}
          source={{uri: selectedProject?.img}}
          style={{
            width: width * 0.9,
            alignSelf: 'center',
            height: height * 0.3,
          }}
          resizeMode="center"
        />
        <Text
          style={{
            fontSize: width * 0.03,
            lineHeight: 20,
            letterSpacing: 1,
            // fontWeight: '600',
            color: Colors.mildGrey,
            fontFamily: 'Poppins-Regular',
          }}>
          Note! "If you purchase this project, our skilled software engineers
          will provide full support from scratch to completion. This project
          assets, including UI design, color schemes, and images, will be
          prepared and provided by our expert technicians once your payment is
          successfully processed. We're here to ensure a seamless and
          professional experience throughout your project journey!"
        </Text>
        {/* selct tech */}
        <Text
          style={{
            color: Colors.veryDarkGrey,
            fontWeight: '600',
            fontSize: width * 0.045,
            letterSpacing: 0.5,
            fontFamily: 'Poppins-SemiBold',
          }}>
          Select your Technology
        </Text>
        <View>
          {selectedProject?.Technologies?.map((tech, index) => (
            <View
              key={index}
              style={{
                borderWidth: 0,
                padding: 15,
                marginBottom: 20,
                elevation: 2,
                backgroundColor: 'white',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: width * 0.035,
                  letterSpacing: 1,
                  fontWeight: '600',
                  color: Colors.veryDarkGrey,
                  marginBottom: 10,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                Project Type: {tech?.TechType}
              </Text>
              {tech?.Techs?.map((tool, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    borderColor: Colors.veryLightGrey,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                    borderBottomWidth: 0.5,
                    paddingBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: Colors.mildGrey,
                      letterSpacing: 1,
                      fontSize: width * 0.03,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {tool?.TechName}
                  </Text>
                  <FastImage
                    priority={FastImage.priority.high}
                    source={{uri: tool?.TechImg}}
                    style={{width: width * 0.06, aspectRatio: 1}}
                  />
                </View>
              ))}
              {/* price */}
              <Text
                style={{
                  // fontWeight: '900',
                  color: Colors.violet,
                  letterSpacing: 1,
                  fontSize: width * 0.03,
                  marginBottom: 10,
                  fontFamily: 'Poppins-Medium',
                }}>
                Watch {adCount} Ads to unlock
              </Text>
              {/* buttons */}
              {adCount <= 0 ? (
                <TouchableOpacity
                  style={{
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    backgroundColor: 'white',
                  }}
                  onPress={() => handleBuyProject()}>
                  <Text
                    style={{
                      textAlign: 'center',
                      letterSpacing: 1,
                      fontSize: width * 0.035,
                      color: Colors.mildGrey,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    Get Project
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={watchAdd}
                  style={{
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    backgroundColor: 'white',
                    backgroundColor: Colors.violet,
                  }}>
                  {isLoaded ? (
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: width * 0.036,
                        letterSpacing: 1,
                        color: 'white',
                      }}>
                      Watch add
                    </Text>
                  ) : (
                    <ActivityIndicator color="white" size={20} />
                  )}
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default SelectedProject;

const styles = StyleSheet.create({});
