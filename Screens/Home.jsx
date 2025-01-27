import React, {useState, useEffect, useCallback, Suspense} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  Dimensions,
  RefreshControl,
  AppState,
  Vibration,
} from 'react-native';
import {Colors, pageView} from '../constants/Colors';
import HomeSkeleton from '../Skeletons/HomeSkeleton';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBell, faMessage} from '@fortawesome/free-regular-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../Context/Contexter';
import {LinearGradient} from 'react-native-linear-gradient';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import axios from 'axios';
import {loginApi, profileApi} from '../Api';
const PremiumProjects = React.lazy(() => import('../components/Projects'));
const SuggestionWapper = React.lazy(() =>
  import('../components/SuggestionWapper'),
);
import useSocketOn from '../Socket/useSocketOn';
import {SocketData} from '../Socket/SocketContext';
import PragraphText from '../utils/PragraphText';
const Companies = React.lazy(() => import('../components/Companies'));
import Skeleton from '../Skeletons/Skeleton';
import useFCMToken from '../hooks/useFCMToken';
import IdeasWrapper from '../components/IdeasWrapper';
import RecentCourses from '../components/RecentCourses';
import AppOpenAd from '../Adds/AppOpenAdd';
// Dimensions for layout
const {width, height} = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const {user, setUser} = useData();
  const [UiLoading, setUiLoading] = useState(false);
  const [suggestRefresh, setSuggestRefresh] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const socket = SocketData();
  const [refresh, setRefresh] = useState(false);
  // init firebase notification
  useFCMToken();
  // app open add
  AppOpenAd();
  // set user online status
  const setOnlineStatus = useCallback(
    async status => {
      try {
        const res = await axios.post(
          `${profileApi}/Profile/setOnlineStatus/${user?._id}`,
          {
            status: status,
          },
        );
        if (res.status === 200) {
          setUser(prev => ({...prev, onlineStatus: res.data.onlineStatus}));
        }
      } catch (error) {
        console.error('Failed to update online status:', error);
      }
    },
    [profileApi, setUser],
  );
  // Loading ui effect
  useEffect(() => {
    getNotifications();
    setTimeout(() => {
      setUiLoading(true);
      // load add
    }, 500);
  }, []);
  // refresh user
  const refreshUser = useCallback(async () => {
    setRefresh(true);
    try {
      setSuggestRefresh(true);
      const res = await axios.post(`${loginApi}/Login/getUser`, {
        userId: user?._id,
      });
      if (res.data) {
        setUser(res.data);
        setRefresh(false);
        await getNotifications();
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);
  // get notifiation
  const getNotifications = useCallback(async () => {
    try {
      const res = await axios.get(
        `${loginApi}/Notifications/getNotifications/${user?._id}`,
      );
      if (res.status === 200) {
        const unseen = res.data.filter(notification => !notification.seen);
        setUnseenCount(unseen.length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [user]);
  // socket
  // update the socket
  useSocketOn(socket, 'updateNoti', async data => {
    console.log('log');

    if (data) getNotifications();
  });
  // receive the socket data from another peer
  useSocketOn(socket, 'Receive-Noti', async () => {
    await getNotifications();
    // Vibration.vibrate({});
    Vibration.vibrate([0, 200, 100, 200]);
  });
  // render ui after load
  if (!UiLoading) return <HomeSkeleton />;

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={refreshUser} />
        }>
        {/* header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('profile')}>
            <Image
              source={{
                uri: user?.Images?.profile
                  ? user?.Images?.profile
                  : user?.Gender == 'male'
                  ? 'https://i.ibb.co/3T4mNMm/man.png'
                  : 'https://i.ibb.co/3mCcQp9/woman.png',
              }}
              style={[
                styles.profileImage,
                {
                  width: width * 0.16,
                  // height: width * 0.13,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: Colors.mildGrey,
                  aspectRatio: 1,
                },
              ]}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 15,
            }}>
            <Pressable
              style={{position: 'relative'}}
              onPress={() => navigation.navigate('notifications')}>
              {/* notificatio badge */}
              <Text
                style={{
                  display: unseenCount > 0 ? 'flex' : 'none',
                  position: 'absolute',
                  top: -height * 0.01,
                  right: -width * 0.0,
                  height: height * 0.018,
                  width: width * 0.04,
                  fontSize: width * 0.026,
                  textAlign: 'center',
                  color: 'white',
                  backgroundColor: 'red',
                  // padding: 5,
                  borderRadius: 50,
                  zIndex: 100,
                  borderColor: 'white',
                  borderWidth: 1,
                }}>
                {unseenCount}
              </Text>
              <FontAwesomeIcon
                color="orange"
                icon={faBell}
                size={width * 0.055}
              />
            </Pressable>
            {/* message batch */}
            {/* <Text
            onPress={() => navigation.navigate('message')}
            style={{
              position: 'absolute',
              backgroundColor: '#e63946',
              color: 'white',
              zIndex: 10,
              borderRadius: 50,
              fontSize: 7,
              top: -height * 0.017,
              right: -width * 0.009,
              padding: 5,
              paddingHorizontal: 8,
              // textAlign: 'center',
            }}>
            1
          </Text> */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('message');
              }}>
              <Image
                source={{uri: 'https://i.ibb.co/V9h4w1s/send.png'}}
                style={{width: width * 0.055, aspectRatio: 1}}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* greeding and notification */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            flexWrap: 'wrap',
          }}>
          <Text
            style={{
              // color: Colors.white,
              fontSize: width * 0.03,
              lineHeight: 30,
              letterSpacing: 1,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              fontWeight: '600',
            }}>
            Hello👋 {user?.firstName}!
          </Text>
        </View>
        {/* search bar */}
        <TouchableOpacity
          onPress={() => navigation.navigate('search')}
          style={{
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginHorizontal: 15,
            borderRadius: 25,
            paddingHorizontal: 10,
            borderColor: Colors.veryLightGrey,
            marginVertical: 10,
            height: height * 0.06,
          }}>
          <EvilIcons
            name="search"
            size={width * 0.07}
            color={Colors.lightGrey}
          />
          <TextInput
            onPress={() => navigation.navigate('search')}
            placeholder="Search"
            placeholderTextColor={Colors.lightGrey}
            style={{letterSpacing: 1}}
          />
        </TouchableOpacity>
        {/* Ideas wrapper */}
        <IdeasWrapper />
        {/* Recent courses */}
        <RecentCourses />
        {/* premium projects */}
        <Suspense
          fallback={
            <View style={{margin: 15}}>
              <Skeleton width="100%" height={height * 0.3} radius={10} />
            </View>
          }>
          <View style={{paddingHorizontal: 15}}>
            <PragraphText text="Premium projects" />
          </View>
          <PremiumProjects />
        </Suspense>
        {/* companies */}
        <Suspense
          fallback={
            <View style={{margin: 15}}>
              <Skeleton width="100%" height={height * 0.3} radius={10} />
            </View>
          }>
          <View style={{paddingHorizontal: 15}}>
            <PragraphText text="Tutorials & Preparations" />
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderWidth: 0,
            }}>
            {/* interviews & company */}
            <Companies />
            {/* video tutorials */}
            <LinearGradient
              colors={['white', 'white']}
              style={{
                flex: 1,
                padding: 15,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: Colors.veryLightGrey,
                // paddingHorizontal: 15,
                marginHorizontal: 15,
              }}>
              <TouchableOpacity
                style={{flexDirection: 'column', rowGap: 10}}
                onPress={() => navigation.navigate('VideoTutorial')}>
                <EvilIcons name="play" size={50} />
                <Text style={{letterSpacing: 2, color: Colors.mildGrey}}>
                  Watch Tutorials
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Suspense>
        {/* friends suggestions */}
        <Suspense
          fallback={
            <View style={{margin: 15}}>
              <Skeleton width="100%" height={height * 0.3} radius={10} />
            </View>
          }>
          <View
            style={{
              paddingHorizontal: 15,
              marginBottom: 10,
            }}>
            <SuggestionWapper refresh={suggestRefresh} />
          </View>
        </Suspense>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
  },
  profileImage: {resizeMode: 'cover'},
  headerIcons: {flexDirection: 'row', gap: 10},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentWrapper: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalSubheading: {
    color: Colors.mildGrey,
    letterSpacing: 2,
    fontSize: width * 0.04,
  },
  modalContent: {
    fontSize: width * 0.03,
    letterSpacing: 2,
    color: Colors.lightGrey,
    paddingVertical: 10,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
});

export default Home;
