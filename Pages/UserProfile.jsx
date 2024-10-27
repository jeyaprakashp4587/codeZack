import React, {useState, useCallback, useEffect} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import {useData} from '../Context/Contexter';
import HeadingText from '../utils/HeadingText';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ripple from 'react-native-material-ripple';
import {Colors} from '../constants/Colors';
import Posts from '../components/Posts';
import HrLine from '../utils/HrLine';
import axios from 'axios';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Api from '../Api';
import useSocketEmit from '../Socket/useSocketEmit';
import moment from 'moment';
import {SocketData} from '../Socket/SocketContext';

const UserProfile = () => {
  const {width, height} = Dimensions.get('window');
  const {selectedUser, user, setSelectedUser} = useData();
  // console.log(selectedUser);
  const socket = SocketData();
  const emitSocketEvent = useSocketEmit(socket);
  const [render, setRender] = useState(false);
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
    try {
      const res = await axios.post(`${Api}/Login/getUser`, {
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
  useEffect(() => {
    if (!selectedUser?.firstName) {
      getSelectedUser();
    }
  }, [selectedUser, getSelectedUser]);

  // Check if the user is a follower when the selected user changes
  useEffect(() => {
    if (selectedUser?._id) {
      findExistsFollower();
    }
  }, [selectedUser, findExistsFollower]);
  // refresh control
  // Render check
  useEffect(() => {
    setTimeout(() => setLoading(true), 300);
  }, []);
  if (!loading) {
    return null;
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
              : 'https://i.ibb.co/wwGDt0t/2151133955.jpg',
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
                : selectedUser?.Gender === 'Male'
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
        <View>
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
        </View>
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
      {/* post */}
      {/* H */}
      <HrLine />
      {selectedUser?.Posts?.length > 0 && (
        <Text
          style={{
            color: Colors.mildGrey,
            fontSize: width * 0.06,
            letterSpacing: 1,
            paddingHorizontal: 20,
          }}>
          Posts
        </Text>
      )}
      <View>
        {selectedUser?.Posts?.map((post, index) => (
          <Posts post={post} index={index} />
        ))}
      </View>
    </ScrollView>
  );
};

export default React.memo(UserProfile);
