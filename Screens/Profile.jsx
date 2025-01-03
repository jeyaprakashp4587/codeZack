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
  InteractionManager,
  RefreshControl,
  Dimensions,
  FlatList,
} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Colors, pageView} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit} from '@fortawesome/free-regular-svg-icons';
import {faSignOut} from '@fortawesome/free-solid-svg-icons';
import HrLine from '../utils/HrLine';
import {useData} from '../Context/Contexter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker'; // Updated Image Picker import
import {storage} from '../Firebase/Firebase';
import {
  getDownloadURL,
  ref,
  updateMetadata,
  uploadBytes,
} from 'firebase/storage';
import axios from 'axios';
import {profileApi} from '../Api';
import Skeleton from '../Skeletons/Skeleton';
import Posts from '../components/Posts';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  Divider,
  Modal,
  Portal,
  Snackbar,
  TouchableRipple,
} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Profile = ({navigation}) => {
  const {user, setUser, setSelectedUser} = useData();
  const {width, height} = Dimensions.get('window');
  const [aboutUpdate, setAboutUpdate] = useState(false);
  const [uploadActivityIndi, setUploadActivityIndi] = useState(false);
  const RBSheetRef = useRef();

  // function to pick images from the library
  const HandleChangeProfile = useCallback(
    async imageType => {
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
              hostImage(uri, imageType)
                .then(imageUri => {
                  upload(imageUri, imageType);
                })
                .catch(err => setUploadIndicator(false));
            }
          }
        },
      );
    },
    [Image],
  );
  // Upload image to Firebase Storage
  const [uploadIndicator, setUploadIndicator] = useState(false);
  const hostImage = useCallback(
    async (imageUri, imageType) => {
      setUploadIndicator(imageType);
      try {
        const storageRef = ref(storage, 'Image/' + Date.now() + '.jpeg');
        const response = await fetch(imageUri);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
        await updateMetadata(storageRef, {
          contentType: 'image/jpeg',
          cacheControl: 'public,max-age=31536000',
        });
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    },
    [Image],
  );
  // upload to server
  const upload = useCallback(async (ImageUrl, ImageType) => {
    const res = await axios.post(`${profileApi}/Profile/updateProfileImages`, {
      ImageUri: ImageUrl,
      ImageType: ImageType,
      userId: user?._id,
    });
    if (res.status === 200) {
      setUser(prev => ({
        ...prev,
        Images: res.data.data, // Update only the Images part in your state
      }));
      setUploadIndicator(false);
    }
  }, []);
  // Refresh user data
  const [refControl, setRefControl] = useState(false);
  const refreshUser = async () => {
    setUploadIndicator(false);
    setRefControl(true);
    const res = await axios.post(`${profileApi}/Login/getUser`, {
      userId: user?._id,
    });
    if (res.data) {
      setUser(res.data);
      setRefControl(false);
    }
  };
  // uplod user data to server
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.LastName || '');
  const [bio, setBio] = useState(user?.Bio || 'I want to become a Winner');

  // Function to handle input changes
  const HandleAboutInput = (field, value) => {
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
  };
  // Function to handle update submission
  const HandleUpdate = async () => {
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
        setAboutUpdate(false); // close the modal after update
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUploadActivityIndi(false);
    }
  };
  // fetch connections lists
  const [netWorksList, setNetworksList] = useState([]);
  const getNetworksList = useCallback(async () => {
    const res = await axios.get(
      `${profileApi}/Following/getNetworks/${user?._id}`,
    );
    if (res.status == 200) {
      setNetworksList(res.data.users);
    }
  }, []);
  // fetch user posts
  const [postLoading, setPostLoading] = useState(false); // Loading indicator
  const [offset, setOffset] = useState(5); // Number of posts already fetched
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState(user?.Posts);
  useEffect(() => {
    setPosts(user?.Posts);
  }, []);
  // fecth user posts
  const fetchPosts = async () => {
    if (!hasMore || postLoading) return;
    setPostLoading(true);
    try {
      const response = await axios.post(`${profileApi}/Post/getUserPosts`, {
        userId: user?._id,
        offset,
      });
      const newPosts = response.data;
      if (newPosts.length < 5) {
        setHasMore(false);
      }
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setOffset(prevOffset => prevOffset + newPosts.length);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setPostLoading(false);
    }
  };
  // render skeleton
  useEffect(() => {
    setTimeout(() => setLoading(true), 300);
  }, []);
  // snack for asking logout
  const [snackVisible, setSnackVisible] = useState(false);
  const onToggleSnackBar = () => setSnackVisible(!snackVisible);
  const onDismissSnackBar = () => setSnackVisible(false);
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
            right: width * 0.05,
            top: height * 0.03,
            zIndex: 10,
          }}>
          <FontAwesomeIcon icon={faEdit} size={20} color="orange" />
        </TouchableOpacity>
        {uploadIndicator === 'cover' ? (
          <Skeleton width="100%" height={200} radius={10} mt={1} />
        ) : (
          <Image
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
            top: -50,
            width: '100%',
            flexDirection: 'column',
            rowGap: 5,
            justifyContent: 'flex-start',
            paddingHorizontal: width * 0.05,
          }}>
          {/* Profile Photo Edit Icon */}
          <TouchableOpacity
            onPress={() => HandleChangeProfile('profile')}
            style={{
              position: 'absolute',
              left: width * 0.23,
              top: height * 0.099,
              zIndex: 10,
            }}>
            <FontAwesomeIcon icon={faEdit} size={20} color="orange" />
          </TouchableOpacity>
          {uploadIndicator === 'profile' ? (
            <Skeleton width={100} height={100} radius={50} mt={1} />
          ) : (
            <Image
              source={{
                uri: user?.Images?.profile
                  ? user?.Images?.profile
                  : user?.Gender == 'male'
                  ? 'https://i.ibb.co/3T4mNMm/man.png'
                  : 'https://i.ibb.co/3mCcQp9/woman.png',
              }}
              style={{
                width: 100,
                height: 100,
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
              right: width * 0.05,
              top: height * 0.08,
            }}>
            <FontAwesomeIcon icon={faEdit} size={20} />
          </TouchableOpacity>

          {/* User Name and Bio */}
          <Text
            style={{
              color: Colors.veryDarkGrey,
              fontSize: width * 0.06,
              letterSpacing: 1,
            }}>
            {user?.firstName} {user?.LastName}
          </Text>
          <Text
            style={{
              color: Colors.mildGrey,
              fontSize: width * 0.04,
              letterSpacing: 1,
            }}>
            {user?.Bio ? user?.Bio : 'I want to become a Winner'}
          </Text>
          {/* Update User Info Modal */}
          {aboutUpdate && (
            <View
              style={{
                borderWidth: 1,
                borderColor: Colors.veryLightGrey,
                width: '100%',
                // height: 300,
                position: 'absolute',
                alignSelf: 'center',
                backgroundColor: 'white',
                zIndex: 10,
                top: height * 0.2,
                borderRadius: 10,
                padding: 20,
                flexDirection: 'column',
                justifyContent: 'space-between',
                rowGap: 10,
              }}>
              <ActivityIndicator
                size={60}
                color={Colors.violet}
                style={{
                  position: 'absolute',
                  zIndex: 90,
                  alignSelf: 'center',
                  top: '50%',
                  display: uploadActivityIndi ? 'flex' : 'none',
                }}
              />
              <TextInput
                placeholder="First Name"
                style={{
                  borderRadius: 3,
                  borderWidth: 1,
                  padding: 10,
                  borderColor: Colors.veryLightGrey,
                  color: Colors.mildGrey,
                  letterSpacing: 1,
                  opacity: uploadActivityIndi ? 0.3 : 1,
                  paddingHorizontal: 15,
                }}
                placeholderTextColor={Colors.lightGrey}
                onChangeText={text => HandleAboutInput('FirstName', text)}
              />
              <TextInput
                placeholder="Last Name"
                style={{
                  borderRadius: 3,
                  borderWidth: 1,
                  padding: 10,
                  borderColor: Colors.veryLightGrey,
                  color: Colors.mildGrey,
                  letterSpacing: 1,
                  opacity: uploadActivityIndi ? 0.3 : 1,
                  paddingHorizontal: 15,
                }}
                placeholderTextColor={Colors.lightGrey}
                onChangeText={text => HandleAboutInput('LastName', text)}
              />
              <TextInput
                placeholder="Bio"
                style={{
                  borderRadius: 3,
                  borderWidth: 1,
                  padding: 10,
                  paddingHorizontal: 15,
                  borderColor: Colors.veryLightGrey,
                  color: Colors.mildGrey,
                  letterSpacing: 1,
                  opacity: uploadActivityIndi ? 0.3 : 1,
                }}
                placeholderTextColor={Colors.lightGrey}
                onChangeText={text => HandleAboutInput('Bio', text)}
              />
              <TouchableOpacity
                onPress={() => HandleUpdate()}
                style={{
                  backgroundColor: Colors.violet,
                  padding: 8,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    letterSpacing: 2,
                  }}>
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Institute Name and Location */}
          <View style={{height: 5}} />
          <Text
            style={{
              color: Colors.veryDarkGrey,
              fontSize: width * 0.04,
              letterSpacing: 1,
            }}>
            {user?.InstitudeName}
          </Text>
          <Text
            style={{
              color: Colors.mildGrey,
              fontSize: width * 0.04,
              letterSpacing: 1,
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
              fontWeight: '600',
              color: Colors.mildGrey,
              letterSpacing: 1,
            }}>
            Connections
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: Colors.mildGrey,
              fontSize: width * 0.04,
              letterSpacing: 1,
            }}>
            {user?.Connections?.length}
          </Text>
        </TouchableOpacity>
        <View>
          <Text
            style={{
              fontWeight: '600',
              color: Colors.mildGrey,
              letterSpacing: 1,
            }}>
            Posts
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: Colors.mildGrey,
              fontSize: width * 0.04,
              letterSpacing: 1,
            }}>
            {user?.Posts?.length}
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
          marginVertical: 10,
          // marginBottom: 30,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('yourcourse')}
          style={{
            padding: 15,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            // width: width * 0.9,
            // borderWidth: 0.2,
            width: '100%',
          }}>
          <Text
            style={{
              color: Colors.veryDarkGrey,
              // fontWeight: '600',
              letterSpacing: 1,
              fontSize: width * 0.035,
            }}>
            Your Courses
          </Text>
          <AntDesign name="laptop" size={23} color={Colors.veryDarkGrey} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Wallet')}
          style={{
            padding: 15,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            // borderWidth: 0.2,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: '#e6e6e6',
          }}>
          <Text
            style={{
              color: 'Colors.veryDarkGrey',
              // fontWeight: '600',
              letterSpacing: 1,
              fontSize: width * 0.035,
            }}>
            Your Wallet
          </Text>
          <SimpleLineIcons
            name="wallet"
            size={25}
            color={Colors.veryDarkGrey}
          />
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
              letterSpacing: 1,
              fontSize: width * 0.035,
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
      {/* posts */}
      <View style={{paddingBottom: height * 0.08}}>
        <View style={{paddingHorizontal: 15}}>
          {user?.Posts?.length > 0 && (
            <Text
              style={{
                fontSize: width * 0.06,
                letterSpacing: 1,
                color: Colors.veryDarkGrey,
              }}>
              Posts
            </Text>
          )}
        </View>
        {/* posts */}
        <FlatList
          data={posts > user?.Posts ? posts : user?.Posts}
          keyExtractor={item => item._id}
          style={{borderWidth: 0, paddingBottom: 20}}
          renderItem={({item, index}) => (
            <Posts post={item} index={index} admin={true} />
          )}
          ListFooterComponent={
            postLoading ? (
              <ActivityIndicator size="large" color={Colors.mildGrey} />
            ) : hasMore && user?.Posts?.length > 0 ? (
              <View style={{paddingHorizontal: 15}}>
                <TouchableOpacity
                  onPress={() => fetchPosts()}
                  style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderRadius: 50,
                    borderColor: Colors.violet,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      letterSpacing: 1.4,
                      color: Colors.violet,
                      fontWeight: '600',
                    }}>
                    Show more
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{textAlign: 'center', color: 'gray'}}>
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
              borderBottomWidth: 1,
              borderColor: Colors.veryLightGrey,
              marginBottom: 10,
            }}>
            {/* bar */}
            <View
              style={{
                width: width * 0.15,
                height: 5,
                backgroundColor: Colors.lightGrey,
                borderRadius: 50,
              }}
            />
            <Text
              style={{
                fontSize: width * 0.045,
                marginBottom: height * 0.03,
                letterSpacing: 2,
                textAlign: 'center',
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
          ) : netWorksList.length < 0 ? (
            <Text>No Connections</Text>
          ) : (
            <FlatList
              data={netWorksList}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('userprofile');
                    setSelectedUser(item.id);
                  }}
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                    columnGap: 15,
                  }}>
                  <Image
                    source={{uri: item?.profileImg}}
                    style={{
                      width: width * 0.13,
                      height: height * 0.06,
                      borderRadius: 50,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 5,
                    }}>
                    <Text style={{letterSpacing: 2, fontSize: width * 0.03}}>
                      {item?.firstName}
                    </Text>
                    <Text style={{letterSpacing: 2, fontSize: width * 0.03}}>
                      {item?.lastName}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </RBSheet>
      {/* Model view  for confirm logout*/}
      <Modal
        visible={snackVisible}
        onDismiss={onDismissSnackBar}
        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 20,
          width: '80%',
          alignSelf: 'center',
          borderRadius: 10,
        }}>
        <View style={{flexDirection: 'column', rowGap: 10}}>
          <Text>Are you sure want to logout</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableRipple
              style={{
                // backgroundColor: Colors.violet,
                paddingVertical: 5,
                paddingHorizontal: 10,
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
                AsyncStorage.removeItem('Email');
                navigation.replace('login');
              }}>
              <Text style={{color: 'white'}}>Yes</Text>
            </TouchableRipple>
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
