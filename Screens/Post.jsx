import React, {useCallback, useEffect, useState} from 'react';
import {useRef} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
  Text,
  ToastAndroid,
} from 'react-native';
import {Colors, pageView} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';
import {useData} from '../Context/Contexter';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faImage} from '@fortawesome/free-regular-svg-icons';
import Ripple from 'react-native-material-ripple';
import {ActivityIndicator} from 'react-native';
import {
  getDownloadURL,
  ref,
  updateMetadata,
  uploadBytes,
} from 'firebase/storage';
import {storage} from '../Firebase/Firebase';
import axios from 'axios';
import {profileApi} from '../Api';
import moment from 'moment';
import useSocketEmit from '../Socket/useSocketEmit';
import {SocketData} from '../Socket/SocketContext';
import {launchImageLibrary} from 'react-native-image-picker';
import {TestIds, useRewardedAd} from 'react-native-google-mobile-ads';
import FastImage from 'react-native-fast-image';

const Post = () => {
  const {user, setUser} = useData();
  const {width, height} = Dimensions.get('window');
  const postText = useRef('');
  const postLink = useRef('');
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const [images, setImages] = useState([]);
  const [uploadText, setUploadText] = useState('Upload');
  const [uploadIndi, setUploadIndi] = useState(false);
  const [uploadImgIndi, setUploadImgIndi] = useState(false);
  const [hostImageIndi, setHostImageIndi] = useState(false);
  const socket = SocketData();
  const [refreshCon, setRefreshCon] = useState(false);
  const emitEvent = useSocketEmit(socket);
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
  // close add section
  const handlePostText = text => {
    postText.current = text;
  };
  //dmk  vff fbf
  const handlePostLink = text => {
    postLink.current = text;
  };
  const isValidURL = url => {
    const regex = /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)(\/[\w\-./?%&=]*)?$/;
    return regex.test(url);
  };
  // Select images from the library using react-native-image-picker
  const selectImage = async () => {
    try {
      setHostImageIndi(false);
      setUploadImgIndi(true);
      const options = {
        mediaType: 'photo',
        selectionLimit: 5,
      };
      const result = await launchImageLibrary(options);
      // Check if user canceled the image selection
      if (result.didCancel) {
        setHostImageIndi(false);
        setUploadImgIndi(false);
        // console.log('Image selection canceled by the user.');
        return;
      }
      if (result.errorMessage) {
        throw new Error(result.errorMessage);
      }
      if (result?.assets) {
        const uploadedImages = await Promise.all(
          result.assets.map(async asset => {
            try {
              return await hostImage(asset.uri);
            } catch (error) {
              console.error(`Error uploading image: ${asset.uri}`, error);
              return null; // Handle individual image upload failures
            }
          }),
        );
        const successfulUploads = uploadedImages.filter(
          image => image !== null,
        );
        if (successfulUploads.length > 0) {
          setImages(prev => [...prev, ...successfulUploads]);
        }

        setHostImageIndi(true);
      }
    } catch (error) {
      //  console.error('Error during image selection or upload:', error);
    } finally {
      // Ensure loading indicators are turned off regardless of success or failure
      setUploadImgIndi(false);
    }
  };

  // Upload image to Firebase
  const hostImage = useCallback(async imageUri => {
    try {
      const storageRef = ref(storage, `Image/${Date.now()}.jpeg`);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      await updateMetadata(storageRef, {
        contentType: 'image/jpeg',
        cacheControl: 'public,max-age=31536000',
      });
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }, []);

  // Handle post upload
  const handleUpload = useCallback(async () => {
    if (!postText.current) {
      ToastAndroid.show('Please fill in all fields.', ToastAndroid.SHORT);
      setUploadIndi(false);
      return;
    }
    if (postLink.current && !isValidURL(postLink.current)) {
      ToastAndroid.show(
        'Invalid URL. Please enter a valid link.',
        ToastAndroid.SHORT,
      );
      setUploadIndi(false);
      return;
    }
    setUploadIndi(true);
    if (postText.current) {
      try {
        const res = await axios.post(`${profileApi}/Post/uploadPost`, {
          userId: user?._id,
          Images: images,
          postText: postText.current,
          postLink: postLink.current,
          Time: moment().format('YYYY-MM-DDTHH:mm:ss'),
        });

        if (res.status == 200) {
          setUploadText('Uploaded');
          emitEvent('PostNotiToConnections', {
            Time: moment().format('YYYY-MM-DDTHH:mm:ss'),
            postId: res.data?.postId,
          });
          ToastAndroid.show('Uploaded Successfully', ToastAndroid.SHORT);
          setUser(prev => ({...prev, Posts: res.data.Posts}));

          // show add after post upload sucessfully
          if (isLoaded) {
            await show();
          }
          // console.log(res.data.Posts);
          refreshFields();
        } else {
          setUploadText('upload');
          Alert.alert('Something went wrong. Please try again.');
        }
      } catch (error) {
        setUploadText('upload');
        ToastAndroid.show(
          'Upload failed. Please check your connection.',
          ToastAndroid.SHORT,
        );
      } finally {
        setUploadIndi(false);
      }
    }
  }, [isLoaded, show, postText, images]);

  // Refresh input fields
  const refreshFields = () => {
    setRefreshCon(true);
    setTimeout(() => setRefreshCon(false), 200);
    inputRef1.current.clear();
    inputRef2.current.clear();
    setImages([]);
    setUploadText('Upload');
  };
  //  --------------- //
  return (
    <ScrollView
      style={[pageView, {rowGap: 10}]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshCon}
          onRefresh={() => refreshFields()}
        />
      }>
      {/* heading Text  fj*/}
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Post" />
      </View>
      {/* profile */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 10,
          paddingHorizontal: 15,
          marginTop: 20,
        }}>
        <FastImage
          priority={FastImage.priority.high}
          source={{
            uri: user?.Images?.profile
              ? user?.Images?.profile
              : user?.Gender == 'male'
              ? 'https://i.ibb.co/3T4mNMm/man.png'
              : 'https://i.ibb.co/3mCcQp9/woman.png',
          }}
          style={{
            width: 60,
            aspectRatio: 1,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: Colors.veryLightGrey,
          }}
        />
        <Text
          style={{
            fontSize: width * 0.045,
            letterSpacing: 1.4,
            color: 'black',
            fontFamily: 'Poppins-Medium',
          }}>
          {user?.firstName} {user?.LastName}
        </Text>
      </View>
      {/* text */}
      <Text
        style={{
          fontSize: width * 0.025,
          textAlign: 'center',
          letterSpacing: 1,
          color: 'black',
          paddingVertical: 20,
          // fontWeight: '600',
          fontFamily: 'Poppins-SemiBold',
        }}>
        ShowCase your Achivement to the World
      </Text>
      {/* inputs wrapper */}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 15}}>
        <View style={{rowGap: 30}}>
          <TextInput
            placeholder="Type Something..."
            style={{
              color: Colors.mildGrey,
              borderBottomWidth: 1,
              padding: 10,
              borderColor: Colors.veryLightGrey,
              letterSpacing: 1,
            }}
            ref={inputRef1}
            onChangeText={handlePostText}
            placeholderTextColor={Colors.lightGrey}
          />
          <TextInput
            ref={inputRef2}
            placeholder="Share Links (eg: git link or project link)"
            onChangeText={handlePostLink}
            style={{
              color: Colors.mildGrey,
              borderBottomWidth: 1,
              letterSpacing: 1,
              padding: 10,
              borderColor: Colors.veryLightGrey,
            }}
            placeholderTextColor={Colors.lightGrey}
          />
          <TouchableOpacity
            onPress={selectImage}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 10,
              backgroundColor: Colors.white,
              justifyContent: 'center',
              height: height * 0.06,
              borderRadius: 50,
              borderWidth: 0.3,
            }}>
            <Text
              style={{
                fontSize: width * 0.035,
                color: 'black',
                letterSpacing: 1,
                // fontWeight: '700',
                fontFamily: 'Poppins-Medium',
              }}>
              Select Images
            </Text>
            {uploadImgIndi ? (
              <ActivityIndicator size={15} color="black" />
            ) : (
              <FontAwesomeIcon
                icon={faImage}
                size={width * 0.05}
                color="black"
              />
            )}
          </TouchableOpacity>
        </View>
        {/* show selected images  */}
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={{
            // borderWidth: 1,
            height: 'auto',
            marginTop: 20,
          }}>
          {images?.length > 0 ? (
            images?.map((img, index) => (
              <View
                style={{
                  width: width * 0.5,
                  height: height * 0.3,
                  marginRight: 10,
                  marginBottom: 10,
                }}
                key={index}>
                <FastImage
                  priority={FastImage.priority.high}
                  source={{uri: img}}
                  resizeMode="contain"
                  style={{
                    width: width * 0.5,
                    height: height * 0.3,
                    borderRadius: 10,
                  }}
                />
                {/* layer */}
              </View>
            ))
          ) : (
            <View
              style={{
                display: hostImageIndi ? 'none' : 'flex',
                backgroundColor: 'white',
                width: '100%',
                height: '100%',
                position: 'absolute',
                // borderWidth: 1,
                opacity: 0.5,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size={50} color={Colors.mildGrey} />
            </View>
          )}
        </ScrollView>
        {/* post Button */}
        <Ripple
          onPress={handleUpload}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 10,
            backgroundColor: 'white',
            justifyContent: 'center',
            height: height * 0.06,
            borderRadius: 50,
            marginBottom: 20,
            borderWidth: 0.3,
          }}>
          {uploadIndi ? (
            <ActivityIndicator
              size={30}
              color="black"
              style={{display: uploadIndi ? 'flex' : 'none'}}
            />
          ) : (
            <Text
              style={{
                fontSize: width * 0.035,
                color: 'black',
                letterSpacing: 1.4,
                fontFamily: 'Poppins-Medium',
                // fontWeight: '700',
              }}>
              {uploadText}
            </Text>
          )}
        </Ripple>
      </ScrollView>
    </ScrollView>
  );
};

export default React.memo(Post);
