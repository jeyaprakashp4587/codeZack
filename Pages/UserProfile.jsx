import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {useData} from '../Context/Contexter';
import HeadingText from '../utils/HeadingText';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ripple from 'react-native-material-ripple';
import {Colors, pageView} from '../constants/Colors';
import Posts from '../components/Posts';
import HrLine from '../utils/HrLine';
import axios from 'axios';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {profileApi} from '../Api';
import useSocketEmit from '../Socket/useSocketEmit';
import moment from 'moment';
import {SocketData} from '../Socket/SocketContext';
import Skeleton from '../Skeletons/Skeleton';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import FastImage from 'react-native-fast-image';
import MiniUserSkeleton from '../Skeletons/MiniUserSkeleton';
import PostSkeleton from '../Skeletons/PostSkeleton';

const UserProfile = () => {
  const {width, height} = Dimensions.get('window');
  const {selectedUser, user, setSelectedUser} = useData();
  const navigation = useNavigation();
  const socket = SocketData();
  const emitSocketEvent = useSocketEmit(socket);
  const [existsFollower, setExistsFollower] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state for API calls
  const RBSheetRef = useRef(null);
  // console.log('selected user', selectedUser);
  // check the selected user id for that user is  dev user
  useEffect(() => {
    if (selectedUser === user?._id) {
      navigation.replace('profile');
    }
  }, [selectedUser]);
  // Send notification to user
  const sendNotification = useCallback(() => {
    try {
      if (selectedUser?._id && user?._id) {
        emitSocketEvent('sendNotificationForConnection', {
          ReceiverId: selectedUser._id,
          SenderId: user._id,
          Time: moment().format('YYYY-MM-DDTHH:mm:ss'),
        });
      }
    } catch (error) {}
  }, [selectedUser, user, emitSocketEvent]);

  // Fetch selected user data
  const getSelectedUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${profileApi}/Login/getUser`, {
        userId: selectedUser,
      });
      if (res.data) {
        setSelectedUser(res.data);
      }
    } catch (error) {
      console.error('Error fetching selected user:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedUser, setSelectedUser]);
  // 🔹 Call `getSelectedUser()` when the screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!selectedUser?.firstName) {
        getSelectedUser().then(() => fetchPosts({offsets: 0}));
      }
    }, [selectedUser, setSelectedUser]),
  );

  useEffect(() => {
    if (selectedUser?._id) {
      getAllNetworks().then(data => setMutualFriend(data));
    }
  }, [selectedUser]);

  // Find if the user is already a follower
  const findExistsFollower = useCallback(async () => {
    try {
      const res = await axios.post(
        `${profileApi}/Following/findExistsConnection`,
        {
          ConnectionId: selectedUser?._id,
          userId: user?._id,
        },
      );
      setExistsFollower(res.data === 'Yes');
    } catch (error) {
      console.error('Error checking follower:', error);
    }
  }, [selectedUser, user]);

  // Add follower
  const addFollower = useCallback(async () => {
    try {
      const res = await axios.post(`${profileApi}/Following/addConnection`, {
        ConnectionId: selectedUser?._id,
        userId: user?._id,
      });
      if (res.data === 'Sucess') {
        setExistsFollower(true);
        sendNotification();
      }
    } catch (error) {
      ToastAndroid.show('Error adding connection', ToastAndroid.SHORT);
      console.error('Error adding follower:', error);
    }
  }, [selectedUser, user, sendNotification]);

  // Remove follower
  const removeConnection = useCallback(async () => {
    try {
      const res = await axios.post(
        `${profileApi}/Following/removeConnection/${user?._id}`,
        {
          ConnectionId: selectedUser?._id,
        },
      );
      if (res.data === 'Done') {
        setExistsFollower(false);
      }
    } catch (error) {
      console.error('Error removing connection:', error);
      ToastAndroid.show('Error removing connection', ToastAndroid.SHORT);
    }
  }, [selectedUser, user]);
  // Check if the user is a follower when the selected user changes
  useEffect(() => {
    if (selectedUser?._id) {
      findExistsFollower();
    }
  }, [selectedUser, findExistsFollower]);
  // get user networks members
  const [netWorksList, setNetworksList] = useState([]);
  const [netWorkListPage, setNetWorkListPage] = useState(0);
  const [networkListLoadding, setNetworkListLoading] = useState(false);
  const [hasMoreNetworks, setHasMoreNetworks] = useState(true);
  const getNetworksList = useCallback(async () => {
    RBSheetRef.current.open();
    if (networkListLoadding || !hasMoreNetworks) return; // Prevent duplicate requests
    setNetworkListLoading(true);
    try {
      const res = await axios.get(
        `${profileApi}/Following/getNetworks/${
          selectedUser?._id || selectedUser
        }`,
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
        // console.log(res.data.users);
      }
    } catch (error) {
      console.error('Error fetching networks list:', error);
    } finally {
      setNetworkListLoading(false);
    }
  }, [netWorkListPage]);
  // get all connection id for check mutual

  const getAllNetworks = useCallback(async () => {
    try {
      if (selectedUser?.Connections?.length > 0) {
        const res = await axios.post(`${profileApi}/Following/getMutuals`, {
          selectedUserId: selectedUser?._id,
          userId: user._id,
        });
        if (res.status === 200) {
          return res.data.users;
        }
      }
      return [];
    } catch (error) {
      ToastAndroid.show(
        'Error fetching mutual friends',
        error,
        ToastAndroid.SHORT,
      );
    }
  }, [selectedUser]);
  const [mutualFriend, setMutualFriend] = useState([]);
  // fetch user posts
  const [postLoading, setPostLoading] = useState(false);
  const [offset, setOffset] = useState(0); // Start from 0
  const [hasMore, setHasMore] = useState(true);
  const [selectedUserPost, setSelectedUserPost] = useState([]);
  const fetchPosts = useCallback(
    async ({offsets = offset}) => {
      if (!hasMore || postLoading) return;
      setPostLoading(true);
      try {
        const response = await axios.post(`${profileApi}/Post/getUserPosts`, {
          userId: selectedUser?._id || selectedUser,
          offsets,
        });
        if (response.status === 200) {
          const newPosts = response.data.posts;
          // console.log(response.data);
          if (newPosts.length < 5) {
            setHasMore(false); // No more posts to fetch
          }
          setSelectedUserPost(newPosts);
          setOffset(prevOffset => prevOffset + newPosts.length);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setPostLoading(false);
      }
    },
    [selectedUser],
  );
  // render ui
  if (!selectedUser?.firstName || !selectedUser?.State) {
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
    </View>;
  }
  //
  return (
    <ScrollView
      style={{flex: 1, backgroundColor: 'white'}}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={{paddingHorizontal: width * 0.05}}>
        <HeadingText text="Profile" />
      </View>

      {/* About Section */}
      <View style={{borderWidth: 0}}>
        <FastImage
          source={{
            uri: selectedUser?.Images?.coverImg
              ? selectedUser?.Images?.coverImg
              : 'https://i.ibb.co/Fh1fwGm/2151777507.jpg',
          }}
          priority={FastImage.priority.high}
          style={{width: '100%', height: height * 0.2, resizeMode: 'cover'}}
        />
        <View
          style={{
            top: -50,
            width: '100%',
            flexDirection: 'column',
            rowGap: 5,
            justifyContent: 'flex-start',
            paddingHorizontal: width * 0.05,
            // backgroundColor: 'white',
          }}>
          <FastImage
            source={{
              uri: selectedUser?.Images?.profile
                ? selectedUser?.Images?.profile
                : selectedUser?.Gender === 'male'
                ? 'https://i.ibb.co/3T4mNMm/man.png'
                : 'https://i.ibb.co/3mCcQp9/woman.png',
            }}
            priority={FastImage.priority.high}
            style={{
              width: 100,
              // height: 100,
              borderRadius: 50,
              borderColor: 'white',
              borderWidth: 5,
              resizeMode: 'cover',
              backgroundColor: 'white',
              aspectRatio: 1,
            }}
          />
          {/* online dot indicator */}
          <View
            style={{
              position: 'absolute',
              top: height * 0.112,
              zIndex: 10,
              left: width * 0.23,
              padding: width * 0.017,
              backgroundColor: selectedUser?.onlineStatus ? 'Green' : 'red',
              borderRadius: 50,
              borderWidth: 3,
              borderColor: 'white',
            }}
          />
          {/* User Name and Bio */}
          <Text
            style={{
              color: Colors.veryDarkGrey,
              fontSize: width * 0.06,
              letterSpacing: 1,
            }}>
            {selectedUser?.firstName} {selectedUser?.LastName}
          </Text>
          <Text
            style={{
              color: Colors.mildGrey,
              fontSize: width * 0.04,
              letterSpacing: 1,
            }}>
            {selectedUser?.Bio ? selectedUser.Bio : 'Student'}
          </Text>
          {/* Update User Info Modal */}

          {/* Institute Name and Location */}
          <View style={{height: 5}} />
          <Text
            style={{
              color: Colors.veryDarkGrey,
              fontSize: width * 0.04,
              letterSpacing: 1,
            }}>
            {selectedUser?.InstitudeName}
          </Text>
          <Text
            style={{
              color: Colors.mildGrey,
              fontSize: width * 0.04,
              letterSpacing: 1,
            }}>
            {selectedUser?.District}, {selectedUser?.State}
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
          flexWrap: 'wrap',
        }}>
        <View>
          {existsFollower ? (
            <Ripple
              onPress={() => removeConnection()}
              style={{
                backgroundColor: Colors.violet,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: width * 0.03,
                borderRadius: 5,
                columnGap: 10,
                width: width * 0.4,
              }}>
              <SimpleLineIcons name="user-following" size={20} color="white" />
              <Text
                style={{
                  fontSize: width * 0.04,
                  color: 'white',
                  letterSpacing: 1,
                }}>
                Unfollow
              </Text>
            </Ripple>
          ) : (
            <Ripple
              onPress={addFollower}
              style={{
                backgroundColor: Colors.mildGrey,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: width * 0.03,
                borderRadius: 5,
                columnGap: 10,
                width: width * 0.4,
              }}>
              <SimpleLineIcons name="user-follow" size={20} color="white" />
              <Text
                style={{
                  fontSize: width * 0.04,
                  color: 'white',
                  letterSpacing: 1,
                }}>
                Follow
              </Text>
            </Ripple>
          )}
        </View>
        <Ripple onPress={() => getNetworksList()}>
          <Text
            style={{
              fontWeight: '600',
              color: Colors.mildGrey,
              letterSpacing: 1,
            }}>
            NetWorks
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: Colors.mildGrey,
              fontSize: width * 0.04,
              letterSpacing: 1,
            }}>
            {selectedUser?.Connections?.length}
          </Text>
        </Ripple>
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
            {selectedUser?.PostLength}
          </Text>
        </View>
      </View>
      {/* show mutuals */}
      <View style={{paddingHorizontal: 15}}>
        {/* <Text>{mutualFriend?.length}</Text> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          {mutualFriend?.map((item, index) => (
            <FastImage
              source={{
                uri: item?.Images.profile,
                priority: FastImage.priority.high,
              }}
              style={{
                width: width * 0.1,
                height: height * 0.05,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: 'white',
                marginLeft: index != 0 ? -20 : 0,
                // resizeMode: 'contain',
              }}
            />
          ))}
          <Text style={{fontSize: width * 0.023, marginLeft: 10}}>
            {mutualFriend?.length > 0
              ? `You have ${mutualFriend.length} mutual ${
                  mutualFriend.length === 1 ? 'friend' : 'friends'
                }: ${mutualFriend
                  .map(friend => friend.firstName)
                  .slice(0, 3)
                  .join(', ')}${mutualFriend.length > 3 ? ' and others' : ''}.`
              : 'No mutual friends to show.'}
          </Text>
        </View>
      </View>
      {/* post */}
      <HrLine />
      {/* post */}
      <FlatList
        data={selectedUserPost}
        // keyExtractor={item => item._id}
        style={{borderWidth: 0, paddingBottom: 20}}
        renderItem={({item, index}) => (
          <Posts
            post={item}
            index={index}
            admin={false}
            senderDetails={{
              id: selectedUser?._id,
              Images: {
                profile: selectedUser?.Images?.profile,
              },
              firstName: selectedUser?.firstName,
              LastName: selectedUser?.LastName,
              InstitudeName: selectedUser?.InstitudeName,
            }}
          />
        )}
        nestedScrollEnabled={true}
        ListFooterComponent={
          postLoading ? (
            <PostSkeleton />
          ) : hasMore ? (
            <View style={{paddingHorizontal: 15}}>
              <TouchableOpacity
                onPress={() => {
                  fetchPosts(offset);
                }}
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

      {/* model for show networks list */}
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
        <View style={{padding: 10}}>
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
                width: width * 0.1,
                height: 5,
                backgroundColor: Colors.lightGrey,
                borderRadius: 50,
              }}
            />
            <Text
              style={{
                fontSize: width * 0.03,
                marginBottom: height * 0.03,
                letterSpacing: 2,
                textAlign: 'center',
                color: 'black',
              }}>
              Networks
            </Text>
          </View>
          {selectedUser?.Connections?.length > 0 ? (
            <FlatList
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              data={netWorksList}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('userprofile');
                    setSelectedUser(item.id);
                  }}
                  key={index}
                  style={{
                    flexDirection: 'row',
                    columnGap: 15,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    paddingBottom: 10,
                    // marginHorizontal: 15,
                    borderColor: Colors.veryLightGrey,
                    // justifyContent: "center",
                    marginVertical: 10,
                  }}>
                  <Image
                    source={{uri: item?.profileImg}}
                    style={{
                      width: width * 0.14,
                      height: height * 0.07,
                      borderRadius: 50,
                      resizeMode: 'cover',
                    }}
                  />

                  <Text
                    style={{
                      letterSpacing: 1,
                      color: Colors.mildGrey,
                      flex: 1,
                      // borderWidth: 1,
                    }}>
                    {item?.firstName} {item?.lastName}
                  </Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={
                <View>
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
                          letterSpacing: 1.4,
                          color: Colors.violet,
                          fontWeight: '600',
                        }}>
                        Show more
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              }
            />
          ) : (
            <Text
              style={{
                color: Colors.mildGrey,
                fontSize: width * 0.035,
                letterSpacing: 2,
              }}>
              No Connetions
            </Text>
          )}
        </View>
      </RBSheet>
    </ScrollView>
  );
};

export default React.memo(UserProfile);
