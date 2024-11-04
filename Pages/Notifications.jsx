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
import Api from '../Api';
import axios from 'axios';
import {useData} from '../Context/Contexter';
import RelativeTime from '../components/RelativeTime';
import {useNavigation} from '@react-navigation/native';
import useSocketEmit from '../Socket/useSocketEmit';
import {SocketData} from '../Socket/SocketContext';

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
        `${Api}/Notifications/getNotifications/${user?._id}`,
      );
      if (res.data) {
        console.log(res.data);
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
            `${Api}/Notifications/markAsSeen/${user?._id}/${item.NotificationId}`,
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
  }, []);

  // -----
  return (
    <View style={pageView}>
      <View style={{paddingHorizontal: 20}}>
        {/* heading */}
        <TopicsText text="Notifications" mb={5} />
        {/* hr line */}
        <HrLine margin={1} width="100%" />
      </View>

      {/* Notifications Sections */}
      {!notificationList || notificationList.length <= 0 ? (
        <Text
          style={{
            fontSize: width * 0.05,
            color: Colors.violet,
            letterSpacing: 2,
            marginTop: 10,
            paddingHorizontal: 15,
          }}>
          No Notifications There
        </Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={notificationList}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => handleNotificationClick(item)}
              key={index}
              style={{
                // borderWidth: 1,
                padding: width * 0.06,
                borderRadius: 7,
                marginTop: 15,
                marginBottom: 10,
                position: 'relative',
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 20,
                backgroundColor: item?.seen ? 'white' : Colors.veryLightGrey,
                // flexWrap: "wrap",
                elevation: 3,
                marginHorizontal: 5,
              }}>
              <Image
                source={{uri: item?.senderProfileImage}}
                style={{
                  width: width * 0.14,
                  height: height * 0.07,
                  borderRadius: 50,
                }}
              />
              <Text
                numberOfLines={2}
                style={{
                  color: Colors.mildGrey,
                  letterSpacing: 1,
                  fontSize: width * 0.033,
                  maxWidth: 250,
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
