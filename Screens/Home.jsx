import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  Suspense,
} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
  Modal,
  Animated,
  Dimensions,
  InteractionManager,
  RefreshControl,
  ActivityIndicator,
  AppState,
  PermissionsAndroid,
  Vibration,
} from 'react-native';
import {Colors, pageView} from '../constants/Colors';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import HomeSkeleton from '../Skeletons/HomeSkeleton';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBell, faMessage} from '@fortawesome/free-regular-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../Context/Contexter';
import {LinearGradient} from 'react-native-linear-gradient';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {loginApi, profileApi} from '../Api';
const SuggestionWapper = React.lazy(() =>
  import('../components/SuggestionWapper'),
);
// import  from '../components/SuggestionWapper';
import useSocketOn from '../Socket/useSocketOn';
import {SocketData} from '../Socket/SocketContext';
import BannerAdd from '../Adds/BannerAdd';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import useShakeAnimation from '../hooks/useShakeAnimation';
import PragraphText from '../utils/PragraphText';
const Companies = React.lazy(() => import('../components/Companies'));
const Tasks = React.lazy(() => import('../components/Tasks'));
import DailyClaim from '../components/DailyClaim';
// import usehook for show adds
import {
  TestIds,
  useAppOpenAd,
  useRewardedAd,
} from 'react-native-google-mobile-ads';
import useSocketEmit from '../Socket/useSocketEmit';
import Skeleton from '../Skeletons/Skeleton';
import useFCMToken from '../hooks/useFCMToken';
import IdeasWrapper from '../components/IdeasWrapper';
import NotesFeed from '../components/NotesFeed';
const PostFeed = React.lazy(() => import('../components/PostFeed'));

// Dimensions for layout
const {width, height} = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const {user, setUser} = useData();
  const [UiLoading, setUiLoading] = useState(false);
  const [suggestDisplay, setSuggestDisplay] = useState(true);
  const [suggestRefresh, setSuggestRefresh] = useState(false);

  const [unseenCount, setUnseenCount] = useState(0);
  const shakeInterpolation = useShakeAnimation(3000);
  const socket = SocketData();
  const [refresh, setRefresh] = useState(false);
  // init firebase notification
  useFCMToken();

  // scroll to top
  const scrollViewRef = useRef(null);
  const [scrollToTop, setScrollToTop] = useState(false);
  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollToTop(offsetY > 400);
  };
  const handleScrollToTop = () => {
    scrollViewRef.current?.scrollTo({y: 0, animated: true});
  };
  // config oneSignal notification
  // config reward add for every three mintes
  const {
    show: showReward,
    isLoaded: loadedReward,
    load: loadReward,
    isClosed: closedReward,
  } = useRewardedAd(
    __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3257747925516984/5831080677',
  );
  // load reward add
  useEffect(() => {
    // setUpOneSignal()
    loadReward();
    // console.log('loading reward add');
  }, [loadReward]);
  // show reward add every 3 minutes
  useEffect(() => {
    const showInterval = setInterval(() => {
      if (loadedReward) {
        // showReward();
      }
    }, 3 * 60 * 1000); // 3 minutes

    // Cleanup interval on component unmount
    return () => {
      clearInterval(showInterval);
    };
  }, [loadedReward, showReward]);
  // Load the next ad when the current one is closed
  useEffect(() => {
    if (closedReward) {
      loadReward();
    }
  }, [closedReward, loadReward]);

  // Hook to manage app open ad state
  const {
    show: showAppopen,
    isLoaded: loadedAppOpen,
    isClosed: closedAppOpen,
    load: loadAppOpen,
  } = useAppOpenAd(
    __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-3257747925516984/6520210341',
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );
  useEffect(() => {
    loadAppOpen();
  }, [loadAppOpen]);
  //  load add
  useEffect(() => {
    const handleAppStateChange = async state => {
      // console.log(`AppState changed to: ${state}`);
      // console.log(`Ad Loaded: ${loadedAppOpen}`);
      if (state === 'active') {
        if (loadedAppOpen) {
          try {
            // console.log('Ad is loaded. Attempting to show the ad...');
            showAppopen();
          } catch (error) {
            // console.error('Error showing AppOpenAd:', error);
          }
        } else {
          // console.log('Ad not loaded. Reloading the ad...');
          loadAppOpen(); // Reload the ad
        }
      }
    };
    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      appStateListener.remove();
    };
  }, [loadedAppOpen, showAppopen, loadAppOpen]);
  useEffect(() => {
    if (closedAppOpen) {
      loadAppOpen();
    }
  }, [closedAppOpen]);
  // Loading ui effect
  const emitSocketEvent = useSocketEmit(socket);
  useEffect(() => {
    setTimeout(() => {
      setUiLoading(true);
      // load add
    }, 500);
  }, []);
  const getCurrentGreeting = useCallback(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

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
  }, [user?._id, setUser]);

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
  }, [user?._id]);
  // socket

  useSocketOn(socket, 'updateNoti', async data => {
    if (data) getNotifications();
  });

  useSocketOn(socket, 'Receive-Noti', async () => {
    await getNotifications();
    // Vibration.vibrate({});
    Vibration.vibrate([0, 200, 100, 200]);
  });

  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      await getNotifications();
      await setProfilePic();
      checkButtonStatus();
    });
  }, []);
  // --- set profile
  const setProfilePic = useCallback(async () => {
    try {
      if (!user?.Images || !user?.Images?.profile) {
        const res = await axios.post(
          `${loginApi}/Profile/setProfile/${user?._id}`,
        );
        if (res.status === 200) {
          setUser(prev => ({...prev, Images: res.data.Images}));
        }
      }
    } catch (error) {
      console.error('Failed to set profile picture:', error);
    }
  }, [user?._id, setUser]);

  const HandlesuggestDisplay = data => {
    setSuggestDisplay(data);
  };
  // render ui after load
  if (!UiLoading) return <HomeSkeleton />;

  return (
    <View style={pageView}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={event => handleScroll(event)}
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
                  width: width * 0.13,
                  height: width * 0.13,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: Colors.mildGrey,
                },
              ]}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 30,
            }}>
            <Text
              onPress={() => navigation.navigate('Wallet')}
              style={{
                position: 'absolute',
                backgroundColor: '#e63946',
                color: 'white',
                zIndex: 10,
                borderRadius: 50,
                padding: 5,
                fontSize: 8,
                top: -height * 0.017,
                right: width * 0.12,
                paddingHorizontal: 8,
              }}>
              <Fontawesome name="rupee" color="white" size={8} />
              {user?.Wallet?.TotalWallet}
            </Text>
            <Animated.View
              style={{
                transform: [
                  {
                    translateX:
                      user?.Wallet?.TotalWallet >= 1 ? shakeInterpolation : 0,
                  },
                ],
              }}>
              <TouchableOpacity
                style={{position: 'relative'}}
                onPress={() => navigation.navigate('Wallet')}>
                <SimpleLineIcons
                  name="wallet"
                  size={25}
                  color={Colors.mildGrey}
                />
              </TouchableOpacity>
            </Animated.View>
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
              <FontAwesomeIcon
                icon={faMessage}
                size={25}
                color={Colors.mildGrey}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* notesFeed */}
        <NotesFeed />
        {/*  header*/}
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
              color: Colors.mildGrey,
              fontSize: width * 0.03,
              lineHeight: 30,
              letterSpacing: 1,
              paddingVertical: 10,
              // fontWeight: "700",
            }}>
            {getCurrentGreeting()} {user?.firstName}!
          </Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', columnGap: 10}}>
            <DailyClaim />
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
              <FontAwesomeIcon color="orange" icon={faBell} size={23} />
            </Pressable>
          </View>
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
            marginBottom: 5,
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
        {/* tasks */}
        <Suspense
          fallback={
            <View style={{margin: 15}}>
              <Skeleton width="100%" height={height * 0.2} radius={10} />
            </View>
          }>
          <Tasks />
        </Suspense>
        {/* companies */}
        <Suspense
          fallback={
            <View style={{margin: 15}}>
              <Skeleton width="100%" height={height * 0.3} radius={10} />
            </View>
          }>
          <View style={{paddingHorizontal: 15}}>
            <PragraphText text="Videos & Preparations" />
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              // paddingHorizontal: 15,
              columnGap: 20,
              borderWidth: 0,
              marginVertical: 15,
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
              display: suggestDisplay ? 'flex' : 'none',
              paddingHorizontal: 15,
            }}>
            <SuggestionWapper
              trigger={HandlesuggestDisplay}
              refresh={suggestRefresh}
            />
          </View>
        </Suspense>
        {/* banner add */}
        <BannerAdd />
        {/* posts */}
        <Suspense
          fallback={
            <View style={{margin: 15}}>
              <Skeleton width="100%" height={height * 0.3} radius={10} />
            </View>
          }>
          <PostFeed />
        </Suspense>
        {/* model load aadd */}
      </ScrollView>
      {/* scroll to top button */}
      {scrollToTop && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: height * 0.05,
            zIndex: 100,
            right: width * 0.035,
          }}>
          <TouchableOpacity
            onPress={() => handleScrollToTop()}
            style={{
              backgroundColor: Colors.violet,
              width: width * 0.16,
              height: height * 0.08,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
              borderWidth: 3,
              borderColor: 'white',
            }}>
            <AntDesign name="totop" size={15} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
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
