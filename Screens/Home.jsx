import React, {useState, useEffect, useMemo, useCallback} from 'react';
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
} from 'react-native';
import {Colors, pageView} from '../constants/Colors';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import HomeSkeleton from '../Skeletons/HomeSkeleton';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBell, faMessage} from '@fortawesome/free-regular-svg-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useData} from '../Context/Contexter';
import {LinearGradient} from 'react-native-linear-gradient';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import axios from 'axios';
import Api from '../Api';
import SuggestionWapper from '../components/SuggestionWapper';
import useSocketOn from '../Socket/useSocketOn';
import Posts from '../components/Posts';
import {debounce} from 'lodash';
import {SocketData} from '../Socket/SocketContext';
import BannerAdd from '../Adds/BannerAdd';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ripple from 'react-native-material-ripple';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddWallet from '../hooks/AddWallet';
import useShakeAnimation from '../hooks/useShakeAnimation';
import PragraphText from '../utils/PragraphText';
import Companies from '../components/Companies';
import AddModel from '../Adds/AddModel';
import Carousel from 'react-native-reanimated-carousel';
// import usehook for show adds
import {
  useInterstitialAd,
  TestIds,
  useAppOpenAd,
  useRewardedAd,
} from 'react-native-google-mobile-ads';

// Dimensions for layout
const {width, height} = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const {user, setUser} = useData();
  const [UiLoading, setUiLoading] = useState(false);
  const [suggestDisplay, setSuggestDisplay] = useState(true);
  const [suggestRefresh, setSuggestRefresh] = useState(false);
  const [posts, setPosts] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const shakeInterpolation = useShakeAnimation(3000);
  const socket = SocketData();
  const [refresh, setRefresh] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
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
  // config intrestial add
  const {
    show: showIntrestAdd,
    isLoaded: loadedIntrestAdd,
    load: loadIntrestAdd,
    isClosed: closedIntrestAdd,
    isShowing: showingIntrestAdd,
  } = useInterstitialAd(
    __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3257747925516984/2804627935',
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );
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
  useEffect(() => {
    setTimeout(() => {
      setUiLoading(true);
      // load add
    }, 500);
  }, []);
  // carousel data
  const carouselData = useMemo(
    () => [
      {
        name: 'Learning',
        img: 'https://i.ibb.co/R2YnF4F/learn.png',
        bgColor: '#ffcccc',
        route: 'carrerScreen',
      },
      {
        name: 'Practice',
        img: 'https://i.ibb.co/8mjYHzc/practice.png',
        bgColor: '#cce6ff',
        route: 'Challenges',
      },
      {
        name: 'Achieve',
        img: 'https://i.ibb.co/6mt33RQ/achieve.png',
        bgColor: '#b3ffb3',
        route: 'Post',
      },
    ],
    [],
  );
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
      const res = await axios.post(`${Api}/Login/getUser`, {userId: user?._id});
      if (res.data) {
        setUser(res.data);
        setRefresh(false);
        await getConnectionPosts();
        await getNotifications();
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [user?._id, setUser]);

  const getConnectionPosts = useCallback(async () => {
    try {
      const res = await axios.get(
        `${Api}/Post/getConnectionPosts/${user?._id}`,
      );
      if (res.status === 200) {
        setPosts(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  }, [user?._id]);

  const getNotifications = useCallback(async () => {
    try {
      const res = await axios.get(
        `${Api}/Notifications/getNotifications/${user?._id}`,
      );
      if (res.status === 200) {
        const unseen = res.data.filter(notification => !notification.seen);
        setUnseenCount(unseen.length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [user?._id, useSocketOn]);

  useSocketOn(socket, 'updateNoti', async data => {
    if (data) getNotifications();
  });

  useSocketOn(socket, 'Noti-test', async () => {
    await getNotifications();
  });

  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      await getConnectionPosts();
      await getNotifications();
      await setProfilePic();
      checkButtonStatus();
    });
  }, []);
  // ---
  const debouncedFunctions = useCallback(
    debounce(() => {
      checkButtonStatus();
    }, 300), // 300 ms debounce delay, adjust as needed
    [],
  );

  useFocusEffect(debouncedFunctions);

  const setProfilePic = useCallback(async () => {
    try {
      if (!user?.Images || !user?.Images?.profile) {
        const res = await axios.post(`${Api}/Profile/setProfile/${user?._id}`);
        if (res.data) {
          setUser(res.data);
          // console.log(res.data);
        }
      }
    } catch (error) {
      console.error('Failed to set profile picture:', error);
    }
  }, [user?._id, setUser]);

  const HandlesuggestDisplay = data => {
    setSuggestDisplay(data);
  };
  // ideas wrapper naivagtions
  const debounceNavigation = useCallback(
    debounce(route => navigation.navigate(route), 100),
    [],
  );
  const carrerNav = useCallback(() => debounceNavigation('carrerScreen'), []);
  const courseNav = useCallback(() => debounceNavigation('yourcourse'), []);
  const activityNav = useCallback(
    () => debounceNavigation('youractivities'),
    [],
  );
  const assignmentNav = useCallback(() => {
    debounceNavigation('Assignments');
  }, []);
  // this is for check day
  const checkButtonStatus = async () => {
    const lastCheckIn = await AsyncStorage.getItem('lastCheckIn');
    if (lastCheckIn) {
      const lastCheckInDate = moment(lastCheckIn);
      const now = moment();
      setIsDisabled(lastCheckInDate.isSame(now, 'day'));
    }
  };
  // implement intrestitial add
  useEffect(() => {
    loadIntrestAdd();
    // console.log('loading add');
  }, [loadIntrestAdd]);
  useEffect(() => {
    if (closedIntrestAdd) {
      loadIntrestAdd();
      // console.log('loading next add');
    }
  }, [closedIntrestAdd]);
  //
  const handleCheckIn = useCallback(async () => {
    // setLoading(true);
    if (isDisabled) {
      showIntrestAdd();
      ToastAndroid.show(
        'You have already checked in today.',
        ToastAndroid.SHORT,
      );
      return;
    }
    showIntrestAdd();
    const now = moment().toISOString();
    await AsyncStorage.setItem('lastCheckIn', now);
    const result = await AddWallet(user?._id, 1, setUser);
    if (result === 'ok') {
      ToastAndroid.show('You earned 1 rupee!', ToastAndroid.SHORT);
      setIsDisabled(true);
    } else {
      ToastAndroid.show('Failed to add to wallet.', ToastAndroid.SHORT);
    }
  }, [isDisabled, user, setUser]);
  // ---- Task ----
  const Tasks = useMemo(
    () => [
      {Content: 'Claim Daily Check In', Status: 'pending'},
      {Content: 'Enroll any 2 courses', Status: 'pending'},
      {Content: 'Enroll any ony technology', Status: 'pending'},
      {Content: 'Spend 45 minutes in study area', Status: 'pending'},
      {Content: 'Connect 5 friends with you', Status: 'pending'},
      {Content: 'Complete 10 Challenges', Status: 'pending'},
      {Content: 'Select one interview preparation', Status: 'pending'},
    ],
    [],
  );
  // render ui after load
  if (!UiLoading) return <HomeSkeleton />;

  return (
    <View style={pageView}>
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
          <TouchableOpacity onPress={() => navigation.navigate('message')}>
            <FontAwesomeIcon
              icon={faMessage}
              size={25}
              color={Colors.mildGrey}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/*  header*/}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={refreshUser} />
        }>
        {/* greeding and notification */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            flexWrap: 'wrap',
          }}>
          {/* <Text>
            Intrest Ad Status: {loadedIntrestAdd ? 'Loaded' : 'Not Loaded'}
          </Text>
          <Text>
            AppOpen Ad Status: {loadedAppOpen ? 'Loaded' : 'Not Loaded'}
          </Text>
          <Text>
            Reward Ad Status: {loadedReward ? 'Loaded' : 'Not Loaded'}
          </Text> */}
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
            <Animated.View
              style={{
                transform: [{translateX: isDisabled ? 0 : shakeInterpolation}],
              }}>
              <Ripple
                onPress={() => handleCheckIn()}
                style={{
                  // backgroundColor: '#457b9d',
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  columnGap: 5,
                  borderWidth: 1,
                  borderColor: '#3d405b',
                  height: height * 0.03,
                  paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    color: '#14213d',
                    letterSpacing: 2,
                    fontSize: width * 0.02,
                  }}>
                  Daily Check in
                </Text>
                {isDisabled ? (
                  <Feather name="check" color="#3d405b" />
                ) : (
                  <Text></Text>
                )}
              </Ripple>
            </Animated.View>

            <Pressable
              style={{position: 'relative'}}
              onPress={() => navigation.navigate('notifications')}>
              {/* notificatio badge */}
              <Text
                style={{
                  display: unseenCount > 0 ? 'flex' : 'none',
                  position: 'absolute',
                  top: -height * 0.016,
                  right: -width * 0.0,
                  // height: height * 0.018,
                  width: width * 0.04,
                  fontSize: width * 0.026,
                  textAlign: 'center',
                  color: 'white',
                  backgroundColor: 'red',
                  // padding: 5,
                  borderRadius: 50,
                  zIndex: 10,
                }}>
                {unseenCount}
              </Text>
              <FontAwesomeIcon color="orange" icon={faBell} size={23} />
            </Pressable>
          </View>
        </View>
        {/* seacrch bar */}
        <TouchableOpacity
          onPress={() => navigation.navigate('search')}
          style={{
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginHorizontal: 15,
            borderRadius: 20,
            paddingHorizontal: 10,
            borderColor: Colors.veryLightGrey,
            marginVertical: 10,
          }}>
          <EvilIcons name="search" size={25} color={Colors.lightGrey} />
          <TextInput
            onPress={() => navigation.navigate('search')}
            placeholder="Search"
            style={
              {
                // borderWidth: 1,
                // width: '80%',
              }
            }
          />
        </TouchableOpacity>
        {/* ideas wrapper */}
        <View style={styles.ideasWrapper}>
          <TouchableOpacity style={styles.ideaBox} onPress={carrerNav}>
            <SimpleLineIcons name="book-open" size={25} color="#264653" />
            <Text
              style={[styles.ideaText, {fontSize: width * 0.017}]}
              numberOfLines={1}>
              Career
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={courseNav} style={styles.ideaBox}>
            <AntDesign name="laptop" size={25} color="#2a9d8f" />
            <Text
              numberOfLines={1}
              style={[styles.ideaText, {fontSize: width * 0.017}]}>
              Your Courses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={assignmentNav} style={styles.ideaBox}>
            <SimpleLineIcons name="notebook" size={25} color="#e9c46a" />
            <Text
              numberOfLines={1}
              style={[styles.ideaText, {fontSize: width * 0.017}]}>
              Assignments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ideaBox} onPress={activityNav}>
            <Fontisto name="date" size={25} color="#e76f51" />
            <Text
              style={[styles.ideaText, {fontSize: width * 0.017}]}
              numberOfLines={1}>
              Your Activities
            </Text>
          </TouchableOpacity>
        </View>
        {/* carousel  */}
        <Carousel
          style={{margin: 'auto', marginTop: 10}}
          width={width * 0.9}
          height={height * 0.22}
          data={carouselData}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => navigation.navigate(item.route)}
              style={{
                flex: 1,
                elevation: 2,
                borderRadius: 10,
                overflow: 'hidden',
                margin: 3,
              }}>
              <LinearGradient
                colors={['white', 'white', item.bgColor]}
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                }}
                start={{x: 1, y: 0}}
                end={{x: 0, y: 1}}>
                <Text
                  style={{
                    fontSize: width * 0.06,
                    textTransform: 'capitalize',
                    color: Colors.mildGrey,
                    letterSpacing: 3,
                    paddingLeft: 20,
                    paddingBottom: 20,
                    opacity: 0.7,
                  }}>
                  {item.name}
                </Text>
                <Image
                  source={{uri: item.img}}
                  style={{width: '55%', height: '100%'}}
                />
              </LinearGradient>
            </TouchableOpacity>
          )}
          autoPlay={true}
          autoPlayInterval={2000}
          // vertical={true}
        />
        {/* interviews and video tutorials */}
        <View style={{paddingHorizontal: 15}}>
          <PragraphText text="Videos & Preparations" />
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            columnGap: 20,
            borderWidth: 0,
            marginVertical: 15,
          }}>
          {/* video tutorials */}
          <LinearGradient
            colors={['white', 'white']}
            style={{
              flex: 1,
              padding: 15,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: Colors.veryLightGrey,
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
          {/* interviews & company */}
          <Companies />
        </View>
        {/* friends suggestions */}
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
        {/* banner add */}
        <BannerAdd />
        {/* posts */}
        {/* <FlatList
          data={posts}
          keyExtractor={item => item._id}
          renderItem={({item, index}) => (
            <Posts
              post={item.Posts}
              senderDetails={item.SenderDetails}
              index={index}
              admin={false}
            />
          )}
        /> */}
        {/* model load aadd */}
      </ScrollView>
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
  closeButtonText: {color: 'white', textAlign: 'center', fontSize: 16},
  carouselImage: {width: '80%', height: '80%', resizeMode: 'contain'},
  carouselText: {fontSize: 18, marginTop: 10, fontWeight: 'bold'},
  ideasWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    // borderWidth: 1,
    marginHorizontal: 15,
  },
  ideaBox: {
    width: width * 0.2,
    height: height * 0.1,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    rowGap: 7,
  },
  icon: {
    width: 35,
    height: 35,
  },
  ideaText: {
    color: Colors.veryDarkGrey,
    letterSpacing: 0.5,
    // fontSize: 20,
  },
});

export default Home;
