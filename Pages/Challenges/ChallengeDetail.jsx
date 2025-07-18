import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  ToastAndroid,
  Linking,
  InteractionManager,
} from 'react-native';
import Skeleton from '../../Skeletons/Skeleton';
import {Colors, pageView} from '../../constants/Colors';
import {useData} from '../../Context/Contexter';
import HeadingText from '../../utils/HeadingText';
import TopicsText from '../../utils/TopicsText';
import PragraphText from '../../utils/PragraphText';
import axios from 'axios';
import {challengesApi} from '../../Api';
import {faImage} from '@fortawesome/free-regular-svg-icons';
import Ripple from 'react-native-material-ripple';
import {launchImageLibrary} from 'react-native-image-picker';
import moment from 'moment';
import useSocketEmit from '../../Socket/useSocketEmit';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';
import Actitivity from '../../hooks/ActivityHook';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {TestIds, useRewardedAd} from 'react-native-google-mobile-ads';
import {SocketData} from '../../Socket/SocketContext';
import FastImage from 'react-native-fast-image';
import {Font} from '../../constants/Font';

const {width, height} = Dimensions.get('window');

const ChallengeDetail = () => {
  const {selectedChallenge, user, setSelectedChallenge} = useData();
  const [uploadTut, setUploadTut] = useState(false);
  const [ChallengeStatus, setChallengeStatus] = useState('');
  const [statusButtonToggle, setStatusButtonToggle] = useState(false);
  const [uploadForm, setUploadForm] = useState({GitRepo: '', LiveLink: ''});
  const [imgLoad, setImageLoad] = useState(false);
  const [images, setImages] = useState([]);
  const socket = SocketData();
  // console.log(selectedChallenge);

  // load and destructure Reward add
  const {load, isLoaded, show, isClosed} = useRewardedAd(
    __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3257747925516984/5831080677',
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
  }, [load, isClosed]);
  const emitEvent = useSocketEmit(socket);
  const postText = useMemo(
    () => [
      `Thrilled to announce that I’ve just completed a challenging ${
        selectedChallenge?.ChallengeType
      } project! The task was ${
        selectedChallenge?.ChallengeName || selectedChallenge?.title
      }. Check out the details in the link below!`,
      `Excited to share that I’ve finished a new ${
        selectedChallenge?.ChallengeType
      } challenge! It was called ${
        selectedChallenge?.ChallengeName || selectedChallenge?.title
      }. Check out more info below!`,
      `Happy to say I’ve completed another ${
        selectedChallenge?.ChallengeType
      } project! The challenge was ${
        selectedChallenge?.ChallengeName || selectedChallenge?.title
      }. Here’s the link to know more!`,
      `Proud to announce that I’ve finished the ${
        selectedChallenge?.ChallengeName || selectedChallenge?.title
      } challenge, which was a ${
        selectedChallenge?.ChallengeType
      } project! Check the link below!`,
      `Just wrapped up an amazing ${
        selectedChallenge?.ChallengeType
      } project called ${
        selectedChallenge?.ChallengeName || selectedChallenge?.title
      }! Take a look at the details below!`,
      `Completed a fantastic ${
        selectedChallenge?.ChallengeType
      } challenge today! The project was ${
        selectedChallenge?.ChallengeName || selectedChallenge?.title
      }. Check out more below!`,
      `Feeling accomplished! I’ve just completed the ${
        selectedChallenge?.ChallengeType
      } project named ${
        selectedChallenge?.ChallengeName || selectedChallenge?.title
      }. Have a look at the details below!`,
      `Done with another challenging ${
        selectedChallenge?.ChallengeType
      } project! It was called ${
        selectedChallenge?.ChallengeName || selectedChallenge?.title
      }. Check the link below!`,
      `Finished a tricky ${selectedChallenge?.ChallengeType} challenge named ${
        selectedChallenge?.ChallengeName || selectedChallenge?.title
      }. Check out the details below!`,
      `Successfully completed the ${
        selectedChallenge?.ChallengeName || selectedChallenge?.title
      } project, which was part of a challenging ${
        selectedChallenge?.ChallengeType
      }. Check out the link below!`,
    ],
    [uploadForm.GitRepo],
  );
  const getChallengeAndStatus = useCallback(async () => {
    try {
      console.log('Fetching challenge + status');

      const res = await axios.post(
        `${challengesApi}/Challenges/getChallengeAndStatus/${user?._id}`,
        {
          ChallengeName:
            selectedChallenge?.ChallengeName || selectedChallenge?.title,
          ChallengeType:
            selectedChallenge?.ChallengeType ||
            selectedChallenge?.ChallengeType,
          ChallengeLevel:
            selectedChallenge?.ChallengeLevel || selectedChallenge?.level,
        },
      );

      if (res.data && res.status === 200) {
        const {challenge, status} = res.data;

        if (status === 'pending' || status === 'completed') {
          setStatusButtonToggle(true);
          setChallengeStatus(status);
          console.log('Challenge Status:', status);
        }
        if (challenge) {
          setSelectedChallenge(challenge);
          console.log('Fetched Challenge:', challenge);
        }
      }
    } catch (error) {
      console.error('Error fetching challenge and status:', error);
    }
  }, [selectedChallenge, user?._id]);

  const uploadSnap = async imgUri => {
    setImageLoad(true);
    try {
      // const storageRef = ref(storage, `Image/${Date.now()}.jpeg`);
      // const response = await fetch(imgUri);
      // const blob = await response.blob();
      // await uploadBytes(storageRef, blob);
      // await updateMetadata(storageRef, {
      //   contentType: 'image/jpeg',
      //   cacheControl: 'public,max-age=31536000',
      // });
      // const downloadURL = await getDownloadURL(storageRef);
      // return downloadURL;
      const data = new FormData();
      data.append('file', {
        uri: imgUri,
        type: 'image/jpeg',
        name: 'Post.jpg',
      });
      data.append('upload_preset', 'ml_default');
      data.append('api_key', '1z2Ft0vr7dBtH4BW1fuDhZXHox8');
      let res = await fetch(
        'https://api.cloudinary.com/v1_1/dogo7hkhy/image/upload',
        {
          method: 'POST',
          body: data,
        },
      );
      let result = await res.json();
      return await result.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setImageLoad(false);
    }
  };

  // Updated function to select image using react-native-image-picker
  const selectSnapImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 4,
      });

      if (!result.didCancel && result.assets) {
        const uploadedImages = await Promise.all(
          result.assets.map(async asset => {
            return await uploadSnap(asset.uri);
          }),
        );
        setImages(prev => [...prev, ...uploadedImages]);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };
  const isHttpsURL = url => {
    const httpsRegex = /^https:\/\//;
    return httpsRegex.test(url);
  };

  const HandleUpload = useCallback(async () => {
    if (!uploadForm.GitRepo) {
      ToastAndroid.show(
        'Please fill in all fields and select images',
        ToastAndroid.SHORT,
      );
      return;
    }
    if (!isHttpsURL(uploadForm.GitRepo)) {
      ToastAndroid.show('Invalid GitHub repository link', ToastAndroid.SHORT);
      return;
    }
    if (uploadForm.LiveLink && !isHttpsURL(uploadForm.LiveLink)) {
      ToastAndroid.show('Invalid live link', ToastAndroid.SHORT);
      return;
    }
    try {
      const res = await axios.post(
        `${challengesApi}/Challenges/uploadChallenge/${user?._id}`,
        {
          GitRepo: uploadForm.GitRepo,
          LiveLink: uploadForm.LiveLink,
          SnapImage: images,
          ChallengeName:
            selectedChallenge?.title || selectedChallenge?.ChallengeName,
          level: selectedChallenge?.level,
        },
      );

      if (res.status === 200 && res.data === 'completed') {
        setChallengeStatus('completed');
        ToastAndroid.show('Wow! you made it', ToastAndroid.SHORT);
        await handleUploadPost();
        try {
          Actitivity(
            user?._id,
            `${
              selectedChallenge?.title || selectedChallenge?.ChallengeName
            } Completed`,
          );
          if (isLoaded) {
            show();
          }
        } catch (error) {
          console.log(error, 'while doing activity');
        }
      }
    } catch (error) {
      console.error('Error uploading challenge:', error);
      ToastAndroid.show('Upload failed. Please try again.', ToastAndroid.SHORT);
    }
  }, [uploadForm.GitRepo, images, user, selectedChallenge]);

  const handleUploadPost = useCallback(async () => {
    try {
      const res = await axios.post(`${challengesApi}/Post/uploadPost`, {
        userId: user?._id,
        Images: images,
        postText: postText[Math.floor(Math.random() * postText.length)],
        postLink: uploadForm.LiveLink ?? uploadForm.GitRepo,
        Time: moment().format('YYYY-MM-DDTHH:mm:ss'),
      });
      if (res.status === 200) {
        emitEvent('PostNotiToConnections', {
          Time: moment().format('YYYY-MM-DDTHH:mm:ss'),
          postId: res.data?.postId,
        });
      } else {
        Alert.alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(
        'Upload error:',
        error.response ? error.response.data : error.message,
      );
      Alert.alert('Upload failed. Please check your connection.');
    }
  }, [uploadForm.GitRepo, images, user, selectedChallenge]);
  const HandleStart = useCallback(
    async chName => {
      setStatusButtonToggle(true);
      setChallengeStatus('pending');

      try {
        if (isLoaded) {
          show();
        }

        const challengeType =
          selectedChallenge?.technologies?.[0]?.name ?? 'Unknown';
        const challengeImage = selectedChallenge?.sample_image ?? '';
        const challengeLevel = selectedChallenge?.level ?? '';

        const res = await axios.post(
          `${challengesApi}/Challenges/addChallenge`,
          {
            userId: user._id,
            ChallengeName: chName,
            ChallengeType: challengeType,
            ChallengeImage: challengeImage,
            ChallengeLevel: challengeLevel,
          },
        );

        if (res.status === 200 && res.data) {
          setUploadTut(true);
        }
      } catch (error) {
        console.error('Error starting challenge:', error);
      }
    },
    [user, selectedChallenge, isLoaded],
  );

  useEffect(() => {
    let isActive = true;
    const interaction = InteractionManager.runAfterInteractions(async () => {
      if (isActive) {
        await getChallengeAndStatus();
      }
    });

    return () => {
      isActive = false;
      interaction.cancel?.();
    };
  }, []);

  const HandleText = (name, text) => {
    setUploadForm(prev => ({...prev, [name]: text}));
  };
  // ask help
  const sendWhatsAppMessage = () => {
    const phoneNumber = '9025167302';
    const message = `Hello! My name is ${
      user?.firstName + user?.LastName
    } I need help with the "${
      selectedChallenge?.ChallengeName || selectedChallenge?.title
    }" challenge.`;
    const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message,
    )}`;

    // Check if WhatsApp is installed
    Linking.canOpenURL(whatsappURL)
      .then(supported => {
        if (supported) {
          Linking.openURL(whatsappURL);
        } else {
          Alert.alert(
            'WhatsApp not installed',
            'Please install WhatsApp to contact support.',
          );
        }
      })
      .catch(error => console.error('Error opening WhatsApp:', error));
  };
  // handle get asset url
  const handleGetAsset = useCallback(async assetLink => {
    try {
      show();
      Linking.openURL(assetLink);
    } catch (error) {
      ToastAndroid.show('error on get assets', ToastAndroid.SHORT);
    }
  }, []);
  // ask help
  const [refreshing, setRefreshing] = useState(false);
  const HandleRefresh = useCallback(() => {
    setRefreshing(true);
    getChallengeAndStatus().finally(() => setRefreshing(false));
  }, []);

  // ------ //
  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        paddingHorizontal: 15,
      }}>
      <HeadingText text="Challenge Details" />
      <ScrollView
        style={{flex: 1, marginBottom: 20}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            onRefresh={() => HandleRefresh()}
            refreshing={refreshing}
          />
        }>
        {selectedChallenge?.sample_image || selectedChallenge?.level ? (
          <View style={{flexDirection: 'column', rowGap: 10, marginTop: 25}}>
            {selectedChallenge?.level === 'newbie' ? (
              <Text
                style={{
                  fontFamily: Font.Regular,
                  fontSize: width * 0.035,
                  // letterSpacing: 0.3,
                }}>
                We Don't have ui design for{' '}
                <Text
                  style={{
                    color: Colors.violet,
                    fontFamily: Font.SemiBold,
                    fontSize: width * 0.05,
                  }}>
                  {selectedChallenge?.level}
                </Text>{' '}
                Level Challenges
              </Text>
            ) : (
              <View
                style={{
                  borderWidth: 0,
                  height: height * 0.3,
                  elevation: 3,
                  backgroundColor: 'white',
                  margin: 5,
                  borderRadius: 5,
                }}>
                <FastImage
                  source={{
                    uri: selectedChallenge?.sample_image,
                  }}
                  priority={FastImage.priority.high}
                  style={{
                    width: '100%',
                    height: '100%',
                    // borderWidth: 1,
                  }}
                  resizeMode="center"
                />
              </View>
            )}
            <TopicsText
              text={selectedChallenge?.title}
              fszie={width * 0.06}
              mb={5}
              fontWeight={600}
              color="black"
              ln={40}
              lp={0}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: Colors.violet,
                  fontFamily: Font.Regular,
                  textTransform: 'uppercase',
                }}>
                {selectedChallenge?.level} Xp{'('}
                {selectedChallenge?.level === 'newbie'
                  ? 10
                  : selectedChallenge?.level === 'junior'
                  ? 20
                  : selectedChallenge?.level === 'expert'
                  ? 30
                  : 40}
                {')'}
              </Text>
            </View>
            {/* tools and assets */}
            <View style={{flexDirection: 'row', columnGap: 10}}>
              {selectedChallenge?.technologies?.map((i, index) => (
                <FastImage
                  key={index}
                  source={{uri: i.icon}}
                  style={{
                    width: width * 0.09,
                    aspectRatio: 1,
                  }}
                  resizeMode="contain"
                />
              ))}
            </View>
            <View>
              {selectedChallenge?.rules?.map((rule, index) => (
                <Text
                  key={index}
                  style={{
                    fontSize: width * 0.035,
                    color: Colors.veryDarkGrey,
                    // letterSpacing: 0.25,
                    marginBottom: 10,
                    lineHeight: 20,
                  }}>
                  {index + 1}.{')'} {rule}
                </Text>
              ))}
            </View>
            {/* get ui design */}
            <TouchableOpacity
              onPress={() => handleGetAsset(selectedChallenge?.asset)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 5,
                borderColor: Colors.veryDarkGrey,
                borderRadius: 5,
                borderWidth: 0.3,
                justifyContent: 'center',
                padding: 10,
              }}>
              <Text
                style={{
                  fontSize: width * 0.035,
                  color: Colors.veryDarkGrey,
                  // letterSpacing: 0.3,
                  fontFamily: Font.SemiBold,
                }}>
                Get ui design
              </Text>
            </TouchableOpacity>
            {/* support wrapper */}
            <View
              style={{
                flexDirection: 'column',
                rowGap: 20,
                borderWidth: 1,
                padding: 20,
                borderRadius: 5,
                borderColor: Colors.veryLightGrey,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: width * 0.034,
                  // letterSpacing: 0.3,
                  lineHeight: 27,
                  fontFamily: Font.Regular,
                }}>
                "Need Help with a Coding Error or Anything Else? Contact Our
                Technical Engineer on WhatsApp!"
              </Text>
              <Ripple
                onPress={sendWhatsAppMessage}
                style={{
                  backgroundColor: '#52b788',
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  columnGap: 10,
                  borderRadius: 5,
                }}>
                <FontAwesome name="whatsapp" color="white" size={15} />
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    // letterSpacing: 0.3,
                    fontFamily: Font.Regular,
                  }}>
                  Feel Free to ask
                </Text>
              </Ripple>
            </View>
            {/* support wrapper */}
            {statusButtonToggle ? (
              <TouchableOpacity
                style={{
                  borderWidth: 0.4,
                  padding: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                  backgroundColor: Colors.violet,
                }}>
                <Text
                  style={{
                    fontSize: width * 0.04,
                    // letterSpacing: 1,
                    color: 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {ChallengeStatus}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => HandleStart(selectedChallenge.title)}
                style={{
                  borderWidth: 0.4,
                  padding: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                  backgroundColor: Colors.violet,
                }}>
                <Text
                  style={{
                    fontSize: width * 0.04,
                    // letterSpacing: 1,
                    color: 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Start challenge
                </Text>
              </TouchableOpacity>
            )}
            {ChallengeStatus == 'pending' && (
              <TouchableOpacity
                onPress={() => setUploadTut(!uploadTut)}
                style={{
                  borderWidth: 0.4,
                  padding: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                  borderColor: Colors.violet,
                  display: uploadTut ? 'none' : 'flex',
                }}>
                <Text
                  style={{
                    color: Colors.veryDarkGrey,
                    fontSize: width * 0.04,
                    // letterSpacing: 0.3,
                    fontFamily: Font.Medium,
                  }}>
                  How to upload the project?
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={{rowGap: 20}}>
            <Skeleton width="100%" height={height * 0.3} radius={10} />
            <Skeleton width="100%" height={height * 0.1} radius={10} />
            <Skeleton width="100%" height={height * 0.02} radius={10} />
            <Skeleton width="100%" height={height * 0.02} radius={10} />
            <Skeleton width="100%" height={height * 0.1} radius={10} />
            <Skeleton width="100%" height={height * 0.08} radius={10} />
          </View>
        )}
        {uploadTut ? (
          <View
            style={{
              paddingBottom: 20,
              marginTop: 20,
              flexDirection: 'column',
              rowGap: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TopicsText
                text="Tutorials"
                mb={2}
                color="black"
                fszie={width * 0.045}
              />
              <TouchableOpacity onPress={() => setUploadTut(!uploadTut)}>
                <Text
                  style={{
                    textDecorationLine: 'underline',
                    // letterSpacing: 1,
                    fontFamily: Font.Medium,
                  }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TopicsText text="Step 1" mb={2} fszie={width * 0.035} />
              <PragraphText
                text="* Create the account in GitHub"
                padding={4}
                fsize={width * 0.03}
              />
            </View>
            <View>
              <TopicsText text="Step 2" mb={2} fszie={width * 0.035} />
              <PragraphText
                fsize={width * 0.03}
                padding={4}
                text="* Create the repository and Upload the project files into repository"
              />
              <WebView
                style={{height: height * 0.25, width: '100%'}}
                source={{
                  html: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/IUhzs7egibA?si=7o-bBQacxlyyDtyB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
                }}
              />
            </View>
            <View>
              <TopicsText text="Step 3" mb={2} fszie={width * 0.035} />
              <PragraphText
                text="*Host the project in github"
                padding={4}
                fsize={width * 0.03}
              />
              <WebView
                style={{width: '100%', height: height * 0.25}}
                source={{
                  html: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/vaRxVb60cAk?si=5knicccJqCK42UUJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
                }}
              />
            </View>
            <View>
              <TopicsText text="Step 4" fszie={width * 0.035} mb={2} />
              <PragraphText
                fsize={width * 0.03}
                text="* Upload the all links and details"
                padding={2}
              />
            </View>
          </View>
        ) : null}
        {ChallengeStatus == 'pending' ? (
          <View
            style={{
              marginVertical: 30,
              rowGap: 10,
            }}>
            <Text
              style={{
                fontSize: width * 0.044,
                fontFamily: Font.SemiBold,
              }}>
              Upload Your Challenge
            </Text>
            <TextInput
              placeholder="Enter Your Project Repository"
              style={{
                borderWidth: 1,
                padding: 15,
                fontSize: width * 0.037,
                borderColor: Colors.veryLightGrey,
                borderRadius: 5,
                fontFamily: Font.Regular,
              }}
              placeholderTextColor={Colors.mildGrey}
              onChangeText={text => HandleText('GitRepo', text)}
            />
            <TextInput
              onChangeText={text => HandleText('LiveLink', text)}
              placeholder="Enter Your Project LiveLink"
              style={{
                borderWidth: 1,
                padding: 15,
                fontSize: width * 0.037,
                borderColor: Colors.veryLightGrey,
                borderRadius: 5,
                fontFamily: Font.Regular,
              }}
              placeholderTextColor={Colors.mildGrey}
            />
            <TouchableOpacity
              onPress={selectSnapImage}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 5,
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: Colors.veryLightGrey,
                borderRadius: 5,
                padding: 5,
              }}>
              {imgLoad ? (
                <ActivityIndicator
                  size={width * 0.05}
                  color={Colors.mildGrey}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faImage}
                  size={width * 0.04}
                  color={Colors.mildGrey}
                />
              )}
              <Text
                style={{
                  padding: 8,
                  fontFamily: Font.Medium,
                  color: Colors.mildGrey,
                }}>
                Upload images
              </Text>
            </TouchableOpacity>
            {/* show oupload image */}
            {images.length > 0 ? (
              <FlatList
                horizontal
                initialNumToRender={2}
                data={images}
                renderItem={({item}) => (
                  <FastImage
                    source={{uri: item, priority: FastImage.priority.high}}
                    style={{
                      width: width * 0.5,
                      height: height * 0.3,
                      marginRight: 10,
                      borderRadius: 10,
                    }}
                  />
                )}
              />
            ) : null}
            {/*  */}
            <Ripple
              onPress={() => HandleUpload()}
              style={{
                width: '100%',
                backgroundColor: Colors.violet,
                padding: 10,
                borderRadius: 5,
                height: height * 0.065,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: width * 0.04,
                  color: 'white',
                  // letterSpacing: 1,
                  textAlign: 'center',
                  fontFamily: Font.Medium,
                }}>
                Upload
              </Text>
            </Ripple>
          </View>
        ) : ChallengeStatus == 'completed' ? (
          <Text></Text>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  pageView: {
    ...pageView,
  },
});

export default React.memo(ChallengeDetail);
