import React, {useState, useCallback, useEffect} from 'react';
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
import Api from '../Api';
import useSocketEmit from '../Socket/useSocketEmit';
import moment from 'moment';
import {SocketData} from '../Socket/SocketContext';
import Skeleton from '../Skeletons/Skeleton';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faL, faTimes} from '@fortawesome/free-solid-svg-icons';
import BannerAdd from '../Adds/BannerAdd';

const UserProfile = () => {
  const {width, height} = Dimensions.get('window');
  const {selectedUser, user, setSelectedUser} = useData();
  const navigation = useNavigation();
  const socket = SocketData();
  const emitSocketEvent = useSocketEmit(socket);
  const [existsFollower, setExistsFollower] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state for API calls

  // Send notification to user
  const sendNotification = useCallback(() => {
    if (selectedUser?._id && user?._id) {
      emitSocketEvent('sendNotificationForConnection', {
        ReceiverId: selectedUser._id,
        SenderId: user._id,
        Time: moment().format('YYYY-MM-DDTHH:mm:ss'),
      });
    }
  }, [selectedUser, user, emitSocketEvent]);

  // Fetch selected user data
  const getSelectedUser = useCallback(async () => {
    setLoading(false);
    try {
      const res = await axios.post(`${Api}/Login/getUser`, {
        userId: selectedUser,
      });
      if (res.data) {
        setLoading(true);
        setSelectedUser(res.data);
      }
    } catch (error) {
      console.error('Error fetching selected user:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedUser, setSelectedUser]);

  // Find if the user is already a follower
  const findExistsFollower = useCallback(async () => {
    try {
      const res = await axios.post(`${Api}/Following/findExistsConnection`, {
        ConnectionId: selectedUser?._id,
        userId: user?._id,
      });
      setExistsFollower(res.data === 'Yes');
    } catch (error) {
      console.error('Error checking follower:', error);
    }
  }, [selectedUser, user]);

  // Add follower
  const addFollower = useCallback(async () => {
    try {
      const res = await axios.post(`${Api}/Following/addConnection`, {
        ConnectionId: selectedUser?._id,
        userId: user?._id,
      });
      if (res.data === 'Sucess') {
        setExistsFollower(true);
        sendNotification();
      }
    } catch (error) {
      console.error('Error adding follower:', error);
    }
  }, [selectedUser, user, sendNotification]);

  // Remove follower
  const removeConnection = useCallback(async () => {
    try {
      const res = await axios.post(
        `${Api}/Following/removeConnection/${user?._id}`,
        {
          ConnectionId: selectedUser?._id,
        },
      );
      if (res.data === 'Done') {
        setExistsFollower(false);
      }
    } catch (error) {
      console.error('Error removing connection:', error);
    }
  }, [selectedUser, user]);

  // Fetch user data only once when the component is mounted
  useFocusEffect(
    useCallback(() => {
      if (!selectedUser?.firstName) {
        getSelectedUser();
      }
    }, [selectedUser]),
  );
  // Check if the user is a follower when the selected user changes
  useEffect(() => {
    if (selectedUser?._id) {
      findExistsFollower();
    }
  }, [selectedUser, findExistsFollower]);
  // get user networks members
  const [netWorksList, setNetworksList] = useState();
  const [showNetWorkModel, setShowNetWorkModel] = useState(false);
  const getNetworksList = useCallback(async () => {
    cd;
    setShowNetWorkModel(true);
    if (selectedUser?.Connections?.length > 0) {
      const res = await axios.get(
        `${Api}/Following/getNetworks/${selectedUser?._id}`,
      );
      if (res.status == 200) {
        setNetworksList(res.data);
        // console.log(res.data);
      }
    }
  }, [showNetWorkModel]);

  if (!loading) {
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
        <Image
          source={{
            uri: selectedUser?.Images?.coverImg
              ? selectedUser?.Images?.coverImg
              : 'https://i.ibb.co/Fh1fwGm/2151777507.jpg',
          }}
          style={{width: '100%', height: 220, resizeMode: 'cover'}}
        />
        <View
          style={{
            top: -50,
            width: '100%',
            flexDirection: 'column',
            rowGap: 5,
            justifyContent: 'flex-start',
            paddingHorizontal: width * 0.05,
          }}>
          <Image
            source={{
              uri: selectedUser?.Images?.profile
                ? selectedUser?.Images?.profile
                : selectedUser?.Gender === 'male'
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
            {selectedUser?.Bio ? selectedUser.Bio : 'I want to become a Winner'}
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
            {selectedUser?.Posts?.length}
          </Text>
        </View>
      </View>
      {/* banner */}
      <BannerAdd />
      {/* post */}
      <HrLine />
      {selectedUser?.Posts?.length > 0 ? (
        selectedUser?.Posts?.map((post, index) => (
          <Posts
            post={post}
            index={index}
            senderDetails={{
              firstName: selectedUser?.firstName,
              LastName: selectedUser?.LastName,
              InstitudeName: selectedUser?.InstitudeName,
              Images: {
                profile: selectedUser?.Images?.profile,
              },
            }}
          />
        ))
      ) : (
        <Text
          style={{
            color: Colors.mildGrey,
            textAlign: 'center',
            fontSize: width * 0.04,
          }}>
          No Posts Yet
        </Text>
      )}
      {/* model for show networks list */}
      <Modal
        transparent={true}
        visible={showNetWorkModel}
        animationType="slide"
        style={{
          flex: 1,
        }}>
        <View
          style={{
            borderWidth: 1,
            position: 'absolute',
            bottom: 0,
            height: '50%',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            width: '100%',
            backgroundColor: 'white',
            borderColor: Colors.lightGrey,
            padding: 20,
          }}>
          {/* close button */}
          <TouchableOpacity
            onPress={() => setShowNetWorkModel(false)}
            style={{
              position: 'absolute',
              right: width * 0.1,
              top: height * 0.025,
              zIndex: 20,
            }}>
            <FontAwesomeIcon icon={faTimes} size={20} color={Colors.mildGrey} />
          </TouchableOpacity>
          {selectedUser?.Connections?.length > 0 ? (
            <FlatList
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
                    marginHorizontal: 15,
                    borderColor: Colors.veryLightGrey,
                    // justifyContent: "center",
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
            />
          ) : (
            <Text
              style={{color: Colors.mildGrey, fontSize: 20, letterSpacing: 2}}>
              No Connetions
            </Text>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

export default React.memo(UserProfile);
