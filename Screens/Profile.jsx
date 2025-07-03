import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  FlatList,
  ToastAndroid,
  Modal,
} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Colors, pageView} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit} from '@fortawesome/free-regular-svg-icons';
import {faSignOut, faTimes} from '@fortawesome/free-solid-svg-icons';
import HrLine from '../utils/HrLine';
import {useData} from '../Context/Contexter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker'; // Updated Image Picker import
import axios from 'axios';
import {loginApi, profileApi} from '../Api';
import Skeleton from '../Skeletons/Skeleton';
import Posts from '../components/Posts';
import RBSheet from 'react-native-raw-bottom-sheet';
import {TouchableRipple} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';
import FastImage from 'react-native-fast-image';
import MiniUserSkeleton from '../Skeletons/MiniUserSkeleton';
import PostSkeleton from '../Skeletons/PostSkeleton';
import {Font} from '../constants/Font';
import truncateText from '../hooks/truncateText';
import SuggestionWapper from '../components/SuggestionWapper';

const Profile = ({navigation}) => {
  const {user, setUser, setSelectedUser} = useData();
  const {width, height} = Dimensions.get('window');
  const [aboutUpdate, setAboutUpdate] = useState(false);
  const [uploadActivityIndi, setUploadActivityIndi] = useState(false);
  const RBSheetRef = useRef();
  // load and destructure intrestial add
  const {load, show, isClosed, isLoaded} = useInterstitialAd(
    __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3257747925516984/9392069002',
    {requestNonPersonalizedAdsOnly: true},
  );
  useEffect(() => {
    // load();
  }, [load]);
  useEffect(() => {
    if (isClosed) {
      load();
    }
  }, [isClosed, load]);
  // function to pick images from the library
  const HandleChangeProfile = useCallback(
    async imageType => {
      try {
        launchImageLibrary(
          {
            mediaType: 'photo',
            maxHeight: 400,
            maxWidth: 400,
            includeExtra: true,
            quality: 1,
            selectionLimit: 1,
          },
          response => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.error('ImagePicker Error: ', response.error);
            } else {
              const uri = response.assets[0]?.uri;
              if (uri) {
                // show add after select image
                if (isLoaded) {
                  // show();
                }
                hostImage(uri, imageType)
                  .then(imageUri => {
                    upload(imageUri, imageType);
                  })
                  .catch(err => setUploadIndicator(false));
              }
            }
          },
        );
      } catch (error) {
        console.log(error);
      }
    },
    [Image, isLoaded, show],
  );
  // Upload image to Firebase Storage
  const [uploadIndicator, setUploadIndicator] = useState(false);
  const hostImage = useCallback(
    async (imageUri, imageType) => {
      setUploadIndicator(imageType);
      try {
        // const storageRef = ref(storage, 'Image/' + Date.now() + '.jpeg');
        // const response = await fetch(imageUri);
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
          uri: imageUri,
          type: 'image/jpeg',
          name: 'Profile.jpg',
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
    },
    [Image],
  );
  // upload to server
  const upload = useCallback(async (ImageUrl, ImageType) => {
    try {
      const res = await axios.post(
        `${profileApi}/Profile/updateProfileImages`,
        {
          ImageUri: ImageUrl,
          ImageType: ImageType,
          userId: user?._id,
        },
      );
      if (res.status === 200) {
        setUser(prev => ({
          ...prev,
          Images: res.data.data, // Update only the Images part in your state
        }));
        setUploadIndicator(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // uplod user data to server
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.LastName || '');
  const [bio, setBio] = useState(user?.Bio || 'I want to become a Winner');

  // Function to handle input changes
  const HandleAboutInput = (field, value) => {
    try {
      switch (field) {
        case 'FirstName':
          setFirstName(value);
          break;
        case 'LastName':
          setLastName(value);
          break;
        case 'Bio':
          setBio(value);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Function to handle update submission
  const HandleUpdate = useCallback(async () => {
    setUploadActivityIndi(true);
    try {
      const response = await axios.post(
        `${profileApi}/Profile/updateProfileData/${user?._id}`,
        {
          FirstName: firstName,
          LastName: lastName,
          Bio: bio,
        },
      );
      if (response.status == 200) {
        setUser(prev => ({
          ...prev,
          firstName: response.data.firstName,
          LastName: response.data.LastName,
          Bio: response.data.Bio,
        }));
        setAboutUpdate(false);
        // show add after update
        if (isLoaded) {
          await show();
        }
        // close the modal after update
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUploadActivityIndi(false);
    }
  }, [isLoaded, show, firstName, lastName, bio]);
  // render skeleton
  useEffect(() => {
    setTimeout(() => setLoading(true), 300);
    fetchPosts({offsets: 0});
  }, []);

  // fetch connections lists
  const [netWorksList, setNetworksList] = useState([]);
  const [netWorkListPage, setNetWorkListPage] = useState(0);
  const [networkListLoadding, setNetworkListLoading] = useState(false);
  const [hasMoreNetworks, setHasMoreNetworks] = useState(true);
  const getNetworksList = useCallback(async () => {
    if (networkListLoadding || !hasMoreNetworks) return; // Prevent duplicate requests
    setNetworkListLoading(true);
    try {
      const res = await axios.get(
        `${profileApi}/Following/getNetworks/${user?._id}`,
        {
          params: {
            skip: netWorkListPage * 10,
            limit: 10,
          },
        },
      );
      if (res.status === 200) {
        setNetworksList(prev => [...prev, ...res.data.users]);
        setNetWorkListPage(prev => prev + 1);
        setHasMoreNetworks(res.data.hasMore);
        setNetworkListLoading(false);
      }
    } catch (error) {
      console.error('Error fetching networks list:', error);
    } finally {
      setNetworkListLoading(false);
    }
  }, [netWorkListPage, user]);

  // fetch user posts
  const [postLoading, setPostLoading] = useState(false);
  const [offset, setOffset] = useState(0); // Start from 0
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(
    async ({offsets = offset}) => {
      if (!hasMore || postLoading) return;
      setPostLoading(true);
      try {
        const response = await axios.post(`${profileApi}/Post/getUserPosts`, {
          userId: user?._id,
          offsets,
        });
        const newPosts = response.data.posts;
        if (newPosts.length < 5) {
          setHasMore(false); // No more posts to fetch
        }
        setUser(prev => ({...prev, Posts: newPosts}));
        setOffset(prevOffset => prevOffset + newPosts.length);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setPostLoading(false);
      }
    },
    [user, offset, hasMore, postLoading],
  );
  // console.log(user?.Posts);
  // snack for asking logout
  const [snackVisible, setSnackVisible] = useState(false);
  const onToggleSnackBar = useCallback(() => setSnackVisible(true), []);
  const onDismissSnackBar = useCallback(() => setSnackVisible(false), []);
  // handle log out
  const handleLogOut = useCallback(async () => {
    try {
      const {status} = await axios.post(
        `${loginApi}/LogIn/signOut/${user?._id}`,
      );
      if (status == 200) {
        AsyncStorage.removeItem('Email');
        navigation.replace('login');
      }
    } catch (error) {
      console.log(err);
      setSnackVisible(false);
      ToastAndroid.show('something error in logout', ToastAndroid.SHORT);
    }
  }, []);
  // Refresh user data
  const [refControl, setRefControl] = useState(false);
  const refreshUser = useCallback(async () => {
    setOffset(0); // Reset the offset
    setPostLoading(true); // Show loading indicator while refreshing
    setRefControl(true);
    try {
      // Fetch user excluding posts
      const res = await axios.post(`${profileApi}/Login/getUser`, {
        userId: user?._id,
      });
      if (res.data && res.status === 200) {
        // Fetch posts separately
        const postsResponse = await axios.post(
          `${profileApi}/Post/getUserPosts`,
          {
            userId: user?._id,
            offsets: 0,
          },
        );
        if (postsResponse?.data?.posts?.length < 5) {
          setHasMore(false); // No more posts to fetch
        }
        // Update user with the fetched posts
        setUser(prev => ({
          ...res.data,
          Posts: postsResponse.data.posts,
        }));
        setPostLoading(false);
        setRefControl(false); // Hide loading indicator
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      setPostLoading(false);
    }
  }, [user, fetchPosts]);
  const [loading, setLoading] = useState(false);
  // render ui loading
  if (!loading) {
    return (
      <View style={pageView}>
        <Skeleton width="100%" height={height * 0.3} radius={10} mt={10} />
        <View
          style={{
            position: 'absolute',
            top: height * 0.22,
            zIndex: 10,
            left: width * 0.11,
          }}>
          <Skeleton
            width={width * 0.26}
            height={height * 0.13}
            radius={50}
            mt={10}
          />
        </View>
        <Skeleton width="100%" height={height * 0.2} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.11} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.11} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.11} radius={10} mt={10} />
      </View>
    );
  }
  // --------
  return (
    <ScrollView
      style={{flex: 1, backgroundColor: 'white'}}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refControl} onRefresh={refreshUser} />
      }>
      {/* Header */}
      <View style={{paddingHorizontal: width * 0.05}}>
        <HeadingText text="Profile" />
      </View>
      {/* About Section */}
      <View style={{borderWidth: 0}}>
        {/* Cover Photo Edit Icon */}
        <TouchableOpacity
          onPress={() => HandleChangeProfile('cover')}
          style={{
            position: 'absolute',
            right: wp('5%'),
            top: hp('4%'),
            zIndex: 10,
          }}>
          <FontAwesomeIcon icon={faEdit} size={20} color="orange" />
        </TouchableOpacity>
        {uploadIndicator === 'cover' ? (
          <Skeleton width="100%" height={200} radius={10} mt={1} />
        ) : (
          <FastImage
            priority={FastImage.priority.high}
            source={{
              uri: user?.Images?.coverImg
                ? user?.Images?.coverImg
                : 'https://i.ibb.co/Fh1fwGm/2151777507.jpg',
            }}
            style={{
              width: '100%',
              height: height * 0.27,
              resizeMode: 'cover',
            }}
          />
        )}
        <View
          style={{
            top: hp('-7%'),
            width: '100%',
            flexDirection: 'column',
            rowGap: 5,
            justifyContent: 'flex-start',
            paddingHorizontal: width * 0.05,
            position: 'relative',
          }}>
          {/* Profile Photo Edit Icon */}
          <TouchableOpacity
            onPress={() => HandleChangeProfile('profile')}
            style={{
              position: 'absolute',
              left: wp('23%'),
              top: height * 0.08,
              zIndex: 10,
            }}>
            <FontAwesomeIcon icon={faEdit} size={20} color="orange" />
          </TouchableOpacity>
          {uploadIndicator === 'profile' ? (
            <Skeleton width={100} height={100} radius={50} mt={1} />
          ) : (
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
                width: width * 0.25,
                // height: 100,
                aspectRatio: 1,
                borderRadius: 50,
                borderColor: 'white',
                borderWidth: 5,
                resizeMode: 'cover',
                backgroundColor: 'white',
              }}
            />
          )}
          {/* About Edit Icon */}
          <TouchableOpacity
            onPress={() => setAboutUpdate(!aboutUpdate)}
            style={{
              position: 'absolute',
              right: wp('5%'),
              top: hp('10%'),
            }}>
            <FontAwesomeIcon icon={faEdit} size={20} />
          </TouchableOpacity>

          {/* User Name and Bio */}
          <Text
            numberOfLines={2}
            style={{
              color: Colors.veryDarkGrey,
              fontSize: width * 0.06,
              letterSpacing: 0.3,
              fontFamily: Font.Regular,
            }}>
            {user?.firstName} {user?.LastName}
          </Text>
          <Text
            style={{
              color: Colors.mildGrey,
              fontSize: width * 0.034,
              letterSpacing: 0.3,
              fontFamily: Font.Regular,
              flexWrap: 'wrap',
              // borderWidth: 1,
              // borderColor: 'black',
              width: '80%',
            }}>
            {user?.Bio ? user?.Bio : 'I want to become a Winner'}
          </Text>
          {/* Update User Info Modal */}
          <Modal
            visible={aboutUpdate}
            style={{flex: 1}}
            collapsable
            transparent>
            <View
              style={{
                justifyContent: 'center',
                flex: 1,
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.28)',
              }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.veryLightGrey,
                  width: '80%',
                  alignSelf: 'center',
                  backgroundColor: 'white',
                  borderRadius: 15,
                  padding: 20,
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  rowGap: 10,
                }}>
                <ActivityIndicator
                  size={40}
                  color={Colors.veryDarkGrey}
                  style={{
                    position: 'absolute',
                    zIndex: 90,
                    alignSelf: 'center',
                    top: '50%',
                    display: uploadActivityIndi ? 'flex' : 'none',
                  }}
                />
                <TouchableOpacity
                  style={{
                    justifyContent: 'flex-end',
                    borderWidth: 0,
                    alignItems: 'flex-end',
                  }}
                  onPress={() => setAboutUpdate(false)}>
                  <FontAwesomeIcon icon={faTimes} size={width * 0.06} />
                </TouchableOpacity>
                <TextInput
                  placeholder="First Name"
                  style={{
                    borderRadius: 3,
                    borderWidth: 0.4,
                    padding: 10,
                    borderColor: Colors.veryDarkGrey,
                    color: Colors.veryDarkGrey,
                    letterSpacing: 0.5,
                    opacity: uploadActivityIndi ? 0.3 : 1,
                    paddingHorizontal: 15,
                    fontFamily: Font.Regular,
                  }}
                  placeholderTextColor={Colors.veryDarkGrey}
                  onChangeText={text => HandleAboutInput('FirstName', text)}
                />
                <TextInput
                  placeholder="Last Name"
                  style={{
                    borderRadius: 3,
                    borderWidth: 0.4,
                    padding: 10,
                    borderColor: Colors.veryDarkGrey,
                    color: Colors.veryDarkGrey,
                    letterSpacing: 0.5,
                    opacity: uploadActivityIndi ? 0.3 : 1,
                    paddingHorizontal: 15,
                    fontFamily: Font.Regular,
                  }}
                  placeholderTextColor={Colors.veryDarkGrey}
                  onChangeText={text => HandleAboutInput('LastName', text)}
                />
                <TextInput
                  placeholder="Bio"
                  style={{
                    borderRadius: 3,
                    borderWidth: 0.4,
                    padding: 10,
                    borderColor: Colors.veryDarkGrey,
                    color: Colors.veryDarkGrey,
                    letterSpacing: 0.5,
                    opacity: uploadActivityIndi ? 0.3 : 1,
                    paddingHorizontal: 15,
                    fontFamily: Font.Regular,
                  }}
                  maxLength={30}
                  multiline={true}
                  placeholderTextColor={Colors.veryDarkGrey}
                  onChangeText={text => HandleAboutInput('Bio', text)}
                />
                <TouchableOpacity
                  onPress={() => HandleUpdate()}
                  style={{
                    padding: 10,
                    borderRadius: 50,
                    borderWidth: 0.5,
                    backgroundColor: Colors.violet,
                  }}>
                  <Text
                    style={{
                      color: Colors.white,
                      textAlign: 'center',
                      letterSpacing: 0.5,
                      fontFamily: Font.SemiBold,
                    }}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* Institute Name and Location */}
          <View style={{height: 5}} />
          <Text
            style={{
              color: Colors.veryDarkGrey,
              fontSize: width * 0.04,
              letterSpacing: 0.3,
              fontFamily: Font.Regular,
            }}>
            {truncateText(user?.InstitudeName, 20)}
            {/* {user?.InstitudeName} */}
          </Text>
          <Text
            style={{
              color: Colors.mildGrey,
              fontSize: width * 0.04,
              letterSpacing: 0.4,
              fontFamily: Font.Regular,
            }}>
            {user?.District}, {user?.State}
          </Text>
        </View>
      </View>
      {/* Following Info */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginVertical: height * -0.02,
          marginBottom: 5,
        }}>
        <TouchableOpacity
          onPress={() => {
            RBSheetRef.current.open();
            getNetworksList();
          }}>
          <Text
            style={{
              // fontWeight: '600',
              color: Colors.veryDarkGrey,
              letterSpacing: 0.3,
              fontFamily: Font.Medium,
            }}>
            Connections
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: Colors.veryDarkGrey,
              fontSize: width * 0.04,
              letterSpacing: 0.3,
              fontFamily: Font.Regular,
            }}>
            {user?.Connections?.length}
          </Text>
        </TouchableOpacity>
        <View>
          <Text
            style={{
              fontWeight: '600',
              color: Colors.veryDarkGrey,
              letterSpacing: 1,
              fontFamily: Font.Medium,
            }}>
            Posts
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: Colors.veryDarkGrey,
              fontSize: width * 0.04,
              letterSpacing: 0.3,
              fontFamily: Font.Regular,
            }}>
            {user?.PostLength}
          </Text>
        </View>
      </View>
      {/* Refer code & qr code */}
      <HrLine />
      {/* Category Cards */}
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          rowGap: 10,
          marginBottom: 20,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('yourcourse')}
          style={{
            padding: 15,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            borderBottomWidth: 0.4,
            borderColor: Colors.veryLightGrey,
          }}>
          <Text
            style={{
              color: Colors.veryDarkGrey,
              // fontWeight: '600',
              // letterSpacing: 0.5,
              fontSize: width * 0.04,
              fontFamily: Font.Medium,
            }}>
            Your Courses
          </Text>
          <AntDesign name="laptop" size={23} color={Colors.veryDarkGrey} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onToggleSnackBar();
          }}
          style={{
            // backgroundColor: Colors.veryLightGrey,
            padding: 15,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            // borderWidth: 0.2,
          }}>
          <Text
            style={{
              color: Colors.veryDarkGrey,
              // fontWeight: '600',
              letterSpacing: 0.3,
              fontSize: width * 0.04,
              fontFamily: Font.Medium,
            }}>
            Log out
          </Text>
          <FontAwesomeIcon
            icon={faSignOut}
            size={20}
            color={Colors.veryDarkGrey}
          />
        </TouchableOpacity>
      </View>
      {/* show connection suggestion, if user dont have connection */}
      {user?.Connections?.length <= 0 && (
        <View style={{marginBottom: 20}}>
          <SuggestionWapper />
        </View>
      )}
      {/* posts */}
      <View style={{paddingBottom: height * 0.08}}>
        <View style={{paddingHorizontal: 15}}>
          {user?.PostLength > 0 && (
            <Text
              style={{
                fontSize: width * 0.06,
                letterSpacing: 0.3,
                color: Colors.veryDarkGrey,
                fontFamily: Font.Medium,
              }}>
              Posts
            </Text>
          )}
        </View>
        {/* show post indicator */}
        {user?.PostLength <= 0 && (
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: 10,
              marginBottom: 10,
            }}>
            <Text
              style={{
                color: Colors.veryDarkGrey,
                fontFamily: Font.Medium,
                fontSize: width * 0.04,
              }}>
              Upload your achivements
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Post')}
              style={{
                backgroundColor: Colors.violet,
                padding: 10,
                paddingHorizontal: 25,
                borderRadius: 100,
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontFamily: Font.Medium,
                  fontSize: width * 0.035,
                }}>
                Post now
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* posts */}
        <FlatList
          data={user?.Posts}
          initialNumToRender={2}
          keyExtractor={item => item._id}
          style={{borderWidth: 0, paddingBottom: 10}}
          renderItem={({item, index}) => (
            <Posts post={item} index={index} admin={true} />
          )}
          nestedScrollEnabled={true}
          ListFooterComponent={
            postLoading ? (
              <PostSkeleton />
            ) : hasMore ? (
              <View style={{paddingHorizontal: 15}}>
                <TouchableOpacity
                  onPress={fetchPosts}
                  style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderRadius: 50,
                    borderColor: Colors.violet,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      letterSpacing: 0.3,
                      color: Colors.violet,
                      // fontWeight: '600',
                      fontFamily: Font.SemiBold,
                    }}>
                    Show more
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  color: 'gray',
                  fontFamily: Font.Medium,
                }}>
                No more posts
              </Text>
            )
          }
        />
      </View>
      {/* RBSheet for show user connection */}
      <RBSheet
        ref={RBSheetRef}
        height={300} // Specify the desired height in pixels
        useNativeDriver={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20, // Optional for rounded corners
            borderTopRightRadius: 20,
            height: height * 0.65, // Alternatively, you can set the height here
          },
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
          },
          draggableIcon: {
            backgroundColor: '#cccccc',
          },
        }}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}>
        <View style={{padding: 20}}>
          {/* model header */}
          <View
            style={{
              // borderWidth: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              rowGap: 10,
              // borderBottomWidth: 1,
              borderColor: Colors.veryLightGrey,
              marginBottom: 10,
            }}>
            {/* bar */}
            <View
              style={{
                width: 50,
                height: 3,
                backgroundColor: Colors.lightGrey,
                borderRadius: 50,
              }}
            />
            <Text
              style={{
                fontSize: width * 0.04,
                marginBottom: height * 0.03,
                letterSpacing: 0.3,
                textAlign: 'center',
                fontFamily: Font.Regular,
              }}>
              Connections
            </Text>
          </View>
          {!netWorksList ? (
            <View style={{flexDirection: 'column', rowGap: 10}}>
              <Skeleton width="95%" height={40} radius={30} />
              <Skeleton width="95%" height={40} radius={30} />
              <Skeleton width="95%" height={40} radius={30} />
              <Skeleton width="95%" height={40} radius={30} />
            </View>
          ) : netWorksList.length <= 0 ? (
            <Text style={{letterSpacing: 0.3, fontFamily: Font.Medium}}>
              No Connections
            </Text>
          ) : (
            <FlatList
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              data={netWorksList}
              initialNumToRender={2}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('userprofile');
                    setSelectedUser(item.id);
                  }}
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                    alignItems: 'center',
                    columnGap: 15,
                    // borderTopWidth: 0.5,
                    paddingVertical: 10,
                    borderColor: Colors.veryLightGrey,
                  }}>
                  <FastImage
                    priority={FastImage.priority.high}
                    source={{uri: item?.profileImg}}
                    style={{
                      width: width * 0.13,
                      borderRadius: 50,
                      aspectRatio: 1,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 3,
                    }}>
                    <Text
                      style={{
                        letterSpacing: 0.3,
                        fontSize: width * 0.035,
                        fontFamily: Font.Regular,
                      }}>
                      {item?.firstName.trim()}
                    </Text>
                    <Text
                      style={{
                        letterSpacing: 0.3,
                        fontSize: width * 0.035,
                        fontFamily: Font.Regular,
                      }}>
                      {item?.lastName}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListFooterComponent={
                <View style={{padding: 20}}>
                  {networkListLoadding &&
                    Array.from({length: 5}).map((_, index) => (
                      <View style={{marginBottom: 10}}>
                        <MiniUserSkeleton />
                      </View>
                    ))}
                  {hasMoreNetworks && !networkListLoadding && (
                    <TouchableOpacity
                      onPress={getNetworksList}
                      style={{
                        padding: 10,
                        borderWidth: 0.5,
                        borderRadius: 50,
                        borderColor: Colors.violet,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          letterSpacing: 0.3,
                          color: Colors.violet,
                          // fontWeight: '600',
                          fontFamily: Font.SemiBold,
                        }}>
                        Show more
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              }
            />
          )}
        </View>
      </RBSheet>
      {/* Model view  for confirm logout*/}
      <Modal
        visible={snackVisible}
        onDismiss={onDismissSnackBar}
        transparent
        collapsable={true}>
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.17)',
          }}>
          <View
            style={{
              backgroundColor: Colors.white,
              padding: 30,
              borderRadius: 10,
              rowGap: 20,
            }}>
            <Text style={{fontFamily: Font.Medium, fontSize: width * 0.04}}>
              Are you sure want to logout
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                columnGap: 20,
              }}>
              <TouchableRipple
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                  borderWidth: 0.7,
                  borderColor: Colors.violet,
                }}
                onPress={() => {
                  setSnackVisible(false);
                }}>
                <Text>Cancel</Text>
              </TouchableRipple>
              <TouchableRipple
                style={{
                  backgroundColor: Colors.violet,
                  paddingVertical: 5,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                }}
                onPress={() => {
                  handleLogOut();
                }}>
                <Text style={{color: 'white'}}>Yes</Text>
              </TouchableRipple>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default React.memo(Profile);

const styles = StyleSheet.create({});
//
//
