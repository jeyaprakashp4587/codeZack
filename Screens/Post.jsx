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
import {Api, profileApi} from '../Api';
import moment from 'moment';
import useSocketEmit from '../Socket/useSocketEmit';
import {SocketData} from '../Socket/SocketContext';
import {launchImageLibrary} from 'react-native-image-picker';
import {TestIds, useRewardedAd} from 'react-native-google-mobile-ads';
import FastImage from 'react-native-fast-image';
import {Font} from '../constants/Font';

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
              return null;
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
      // const storageRef = ref(storage, `Image/${Date.now()}.jpeg`);
      // const response = await fetch(imageUri);
      // const blob = await response.blob();
      // await uploadBytes(storageRef, blob);
      // await updateMetadata(storageRef, {
      //   contentType: 'image/jpeg',
      //   cacheControl: 'public,max-age=31536000',
      // });
      // return await getDownloadURL(storageRef);
      const data = new FormData();
      data.append('file', {
        uri: imageUri,
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
          setUser(prev => ({
            ...prev,
            Posts: res.data.Posts,
            PostLength: res.data.userPostLength,
          }));

          // show add after post upload sucessfully
          if (isLoaded) {
            // show();
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
  }, [isLoaded, show, postText, images, emitEvent]);

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
          marginVertical: 20,
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
            fontSize: width * 0.05,
            letterSpacing: 0.5,
            color: 'black',
            fontFamily: Font.Medium,
          }}>
          {user?.firstName} {user?.LastName}
        </Text>
      </View>
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
              fontFamily: Font.Regular,
            }}
            multiline={true}
            maxLength={200}
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
              letterSpacing: 0.5,
              padding: 10,
              borderColor: Colors.veryLightGrey,
              fontFamily: Font.Regular,
            }}
            placeholderTextColor={Colors.lightGrey}
          />
          {images.length < 5 && (
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
                  letterSpacing: 0.25,
                  fontFamily: Font.SemiBold,
                }}>
                Select Images
              </Text>
              {uploadImgIndi ? (
                <ActivityIndicator color="black" />
              ) : (
                <FontAwesomeIcon
                  icon={faImage}
                  size={width * 0.05}
                  color="black"
                />
              )}
            </TouchableOpacity>
          )}
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
          // onPress={uploadFile}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 10,
            backgroundColor: Colors.violet,
            justifyContent: 'center',
            height: height * 0.06,
            borderRadius: 50,
            marginBottom: 20,
            borderWidth: 0.3,
          }}>
          {uploadIndi ? (
            <ActivityIndicator
              size={20}
              color={Colors.white}
              style={{display: uploadIndi ? 'flex' : 'none'}}
            />
          ) : (
            <Text
              style={{
                fontSize: width * 0.035,
                color: Colors.white,
                letterSpacing: 0.2,
                fontFamily: Font.SemiBold,
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
