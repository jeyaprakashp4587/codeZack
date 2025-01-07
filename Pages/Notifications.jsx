import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  Button,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, pageView} from '../constants/Colors';
import TopicsText from '../utils/TopicsText';
import HrLine from '../utils/HrLine';
import {functionApi} from '../Api';
import axios from 'axios';
import {useData} from '../Context/Contexter';
import RelativeTime from '../components/RelativeTime';
import {useNavigation} from '@react-navigation/native';
import useSocketEmit from '../Socket/useSocketEmit';
import {SocketData} from '../Socket/SocketContext';
import HeadingText from '../utils/HeadingText';

const Notifications = () => {
  const {user, setSelectedUser, setselectedPost} = useData();
  const {width, height} = Dimensions.get('window');
  const Navigation = useNavigation();
  const [notificationList, setNotificationList] = useState([]);

  // Socket handling
  const socket = SocketData();
  const emitevent = useSocketEmit(socket);
  // Fetch notifications from the API
  const getNotifications = useCallback(async () => {
    try {
      const res = await axios.get(
        `${functionApi}/Notifications/getNotifications/${user?._id}`,
      );
      if (res.data) {
        setNotificationList(res.data);
      } else {
        setNotificationList([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [user?._id, notificationList]);

  // Handle notification click
  const handleNotificationClick = useCallback(
    async item => {
      // console.log(item);
      emitevent('checkNotification', {socketId: user?.SocketId});
      if (!item.seen) {
        try {
          // Mark the notification as seen
          await axios.patch(
            `${functionApi}/Notifications/markAsSeen/${user?._id}/${item.NotificationId}`,
          );
          setNotificationList(prevList =>
            prevList.map(notification =>
              notification._id === item._id
                ? {...notification, seen: true}
                : notification,
            ),
          );
        } catch (error) {
          console.log('Error marking notification as seen:', error);
        }
      }

      // Handle different notification types
      switch (item.NotificationType) {
        case 'connection':
          setSelectedUser(item.NotificationSender);
          Navigation.navigate('userprofile');
          break;
        case 'post':
          setselectedPost(item?.postId);
          Navigation.navigate('Postviewer');
          break;
        // Add other notification types here as needed
        default:
          break;
      }
    },
    [user?._id, Navigation, setSelectedUser, emitevent],
  );

  // Use socket to listen for notification updates
  useEffect(() => {
    if (socket) {
      socket.on('newNotification', getNotifications);
    }
    return () => {
      if (socket) {
        socket.off('newNotification', getNotifications);
      }
    };
  }, [socket, getNotifications]);

  // Fetch notifications when the component mounts
  useEffect(() => {
    getNotifications();
    // console.log(notificationList);
    setNotificationList(user?.Notifications);
  }, []);

  return (
    <View style={pageView}>
      <View style={{paddingHorizontal: 15}}>
        {/* heading */}
        <HeadingText text="Notifications" mb={5} />
        {/* hr line */}
        <HrLine margin={1} width="100%" />
      </View>
      {/* Notifications Sections */}
      {!notificationList || notificationList.length <= 0 ? (
        <View
          style={{
            borderWidth: 0,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 'auto',
            marginHorizontal: 'auto',
          }}>
          <Image
            source={{uri: 'https://i.ibb.co/0scNLNQ/rb-4986.png'}}
            style={{width: width * 0.65, aspectRatio: 1}}
          />
          <Text
            style={{
              fontSize: width * 0.035,
              color: Colors.veryDarkGrey,
              letterSpacing: 1,
              fontWeight: '600',
            }}>
            No Notifications there
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={notificationList}
          style={{marginTop: 10}}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => handleNotificationClick(item)}
              key={index}
              style={{
                padding: 15,
                position: 'relative',
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 20,
                backgroundColor: item?.seen ? 'white' : Colors.veryLightGrey,
                borderBottomWidth: 1,
                borderColor: Colors.lightGrey,
              }}>
              <Image
                source={{
                  uri:
                    item?.senderProfileImage ??
                    'https://i.ibb.co/3T4mNMm/man.png',
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                }}
              />
              <Text
                numberOfLines={2}
                style={{
                  color: Colors.mildGrey,
                  letterSpacing: 1,
                  fontSize: width * 0.033,
                  maxWidth: 180,
                  lineHeight: 22,
                }}>
                {item?.NotificationText}
              </Text>
              {/* show time */}
              <View
                style={{
                  position: 'absolute',
                  bottom: height * 0.007,
                  right: width * 0.05,
                }}>
                <RelativeTime time={item?.Time} />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default React.memo(Notifications);

const styles = StyleSheet.create({});
