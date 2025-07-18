import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import {useData} from '../../Context/Contexter';
import HeadingText from '../../utils/HeadingText';
import {Colors} from '../../constants/Colors';
import FastImage from 'react-native-fast-image';
import {TestIds, useRewardedAd} from 'react-native-google-mobile-ads';
import {Font} from '../../constants/Font';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

const SelectedProject = () => {
  const {selectedProject} = useData();
  const {width, height} = Dimensions.get('window');
  const {load, show, isLoaded, isEarnedReward, isClosed} = useRewardedAd(
    __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3257747925516984/2148003800',
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
  const [downloadIndi, setDownloadIndi] = useState(false);
  const handleBuyProject = useCallback(async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version < 30) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Storage permission is required.');
          return;
        }
      }

      if (isLoaded) {
        await show();
      }
      if (isEarnedReward) {
        const localPath = `${RNFS.DownloadDirectoryPath}/${selectedProject?.name}.zip`;
        setDownloadIndi(true);
        const downloadResult = await RNFS.downloadFile({
          fromUrl: `https://drive.google.com/uc?export=download&id=${selectedProject?.driveId}`,
          toFile: localPath,
          background: true,
          discretionary: true,
          progress: true,
          progressDivider: 100,
        }).promise;

        setDownloadIndi(false);
        ToastAndroid.show('Downloaded successfully', ToastAndroid.SHORT);
        setTimeout(() => {
          FileViewer.open(localPath)
            .then(() => {})
            .catch(error => {
              Alert.alert(
                'Can’t Open File 😕',
                'Looks like your device doesn’t have a compatible app to open this file.\n\n👉 Please go to your Download folder and open it manually.',
                [{text: 'OK'}],
              );
            });
        }, 1000);
      }
    } catch (error) {
      setDownloadIndi(false);
      ToastAndroid.show(`Download Failed ${error}`, ToastAndroid.LONG);
    }
  }, [isLoaded, selectedProject]);

  const [adCount, setAdCount] = useState(0);
  // Watch add to unlock get assets
  const watchAdd = useCallback(async () => {
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
            lineHeight: 25,
            letterSpacing: 0.7,
            color: Colors.mildGrey,
            fontFamily: Font.Medium,
          }}>
          Note! "If you get this project, our skilled software engineers will
          provide full support from scratch to completion. This project assets,
          including UI design, color schemes, and images, will be prepared and
          provided.
        </Text>
        <View style={{borderWidth: 0}}>
          {selectedProject?.Technologies?.map((tech, index) => (
            <View
              key={index}
              style={{
                borderWidth: 0,
                // padding: 15,
                marginBottom: 20,
                // elevation: 2,
                backgroundColor: 'white',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: width * 0.04,
                  // letterSpacing: 0.5,
                  color: Colors.veryDarkGrey,
                  marginBottom: 10,
                  fontFamily: Font.SemiBold,
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
                      fontFamily: Font.Medium,
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
              <TouchableOpacity
                style={{
                  // padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                  backgroundColor: Colors.violet,
                  borderColor: Colors.violet,
                  borderWidth: 0.6,
                  height: height * 0.065,
                }}
                onPress={() => handleBuyProject()}>
                {downloadIndi ? (
                  <ActivityIndicator size={25} color={Colors.white} />
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      // letterSpacing: 1,
                      fontSize: width * 0.035,
                      color: Colors.white,
                      fontFamily: Font.Medium,
                    }}>
                    Get Project
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default SelectedProject;

const styles = StyleSheet.create({});
