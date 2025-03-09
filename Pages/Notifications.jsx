import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  ActivityIndicator,
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
import FastImage from 'react-native-fast-image';
import {Font} from '../constants/Font';

const Notifications = () => {
  const {user, setSelectedUser, setselectedPost} = useData();
  const {width, height} = Dimensions.get('window');
  const Navigation = useNavigation();
  const [notificationList, setNotificationList] = useState([]);

  // Socket handling
  const socket = SocketData();
  const emitevent = useSocketEmit(socket);
  // Fetch notifications from the API
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1); // Track total pages

  const getNotifications = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      console.log('Fetching notifications...');

      const res = await axios.get(
        `${functionApi}/Notifications/getNotifications/${user?._id}`,
        {
          params: {page, limit: 10},
        },
      );
      if (
        Array.isArray(res.data.notifications) &&
        res.data.notifications.length > 0
      ) {
        setNotificationList(prev => [...prev, ...res.data.notifications]);
        setPage(prev => prev + 1); // Increment page
        setTotalPages(res.data.totalPages); // Store total pages
        if (page >= res.data.totalPages) {
          setHasMore(false); // No more pages
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
    setLoading(false);
  }, [user?._id, page, hasMore]);

  // Handle notification click
  const handleNotificationClick = useCallback(
    async item => {
      emitevent('checkNotification', {socketId: user?.SocketId});
      if (!item.seen) {
        try {
          // Mark the notification as seen
          const {data} = await axios.patch(
            `${functionApi}/Notifications/markAsSeen/${user?._id}/${item.NotificationId}`,
          );
          setNotificationList(prevList =>
            prevList.map(notification =>
              notification?.NotificationId === item?.NotificationId
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
  // Fetch notifications when the component mounts
  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <View style={pageView}>
      <View style={{paddingHorizontal: 15}}>
        {/* heading */}
        <HeadingText text="Notifications" mb={5} />
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
          <FastImage
            source={{uri: 'https://i.ibb.co/0scNLNQ/rb-4986.png'}}
            style={{width: width * 0.65, aspectRatio: 1}}
            priority={FastImage.priority.high}
          />
          <Text
            style={{
              fontSize: width * 0.035,
              color: Colors.veryDarkGrey,
              letterSpacing: 1,
              // fontWeight: '600',
              fontFamily: 'Poppins-SemiBold',
            }}>
            No Notifications there
          </Text>
        </View>
      ) : (
        <FlatList
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          data={notificationList}
          keyExtractor={item => item.NotificationId}
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
                borderBottomWidth: 0.5,
                borderColor: Colors.lightGrey,
              }}>
              <FastImage
                priority={FastImage.priority.high}
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
                  color: 'black',
                  letterSpacing: 1,
                  fontSize: width * 0.033,
                  maxWidth: 180,
                  lineHeight: 22,
                  // fontWeight: '700',
                  fontFamily: Font.Regular,
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
          ListFooterComponent={
            <View style={{padding: 15}}>
              {loading && (
                <ActivityIndicator size={20} color={Colors.veryDarkGrey} />
              )}
              {hasMore && !loading && (
                <TouchableOpacity
                  onPress={getNotifications}
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
                      // fontWeight: '600',
                      fontFamily: 'Poppins-SemiBold',
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
  );
};

export default React.memo(Notifications);

const styles = StyleSheet.create({});
