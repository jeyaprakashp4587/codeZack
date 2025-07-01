import React, {useState, useEffect, useCallback, Suspense} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Dimensions,
  RefreshControl,
  Vibration,
  ToastAndroid,
  Button,
  Modal,
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
import {functionApi, loginApi, profileApi} from '../Api';
const PremiumProjects = React.lazy(() => import('../components/Projects'));
const SuggestionWapper = React.lazy(() =>
  import('../components/SuggestionWapper'),
);
import useSocketOn from '../Socket/useSocketOn';
import {SocketData} from '../Socket/SocketContext';
const Companies = React.lazy(() => import('../components/Companies'));
import Skeleton from '../Skeletons/Skeleton';
import useFCMToken from '../hooks/useFCMToken';
import IdeasWrapper from '../components/IdeasWrapper';
import RecentCourses from '../components/RecentCourses';
import FastImage from 'react-native-fast-image';
import {Font} from '../constants/Font';
import {checkAppVersion} from '../hooks/checkAppVersion';
import FreelancerBanner from '../Freelancer/FreelancerBanner';
import {useStallionUpdate, restart} from 'react-native-stallion';

// Dimensions for layout
const {width, height} = Dimensions.get('window');
const Home = () => {
  // ota update setUp
  const [showUpdate, setShowUpdate] = useState(false);
  const {newReleaseBundle, isRestartRequired, currentlyRunningBundle} =
    useStallionUpdate();
  useEffect(() => {
    if (isRestartRequired) {
      setShowUpdate(true);
    }
  }, [isRestartRequired]);

  const {user, setUser} = useData();
  const [UiLoading, setUiLoading] = useState(false);
  const [suggestRefresh, setSuggestRefresh] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const socket = SocketData();
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);
  // Loading ui effect
  useFCMToken();
  useEffect(() => {
    getNotifications();
    checkAppVersion(navigation);
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
  // get notifiation length
  const getNotifications = useCallback(async () => {
    try {
      const {data, status} = await axios.get(
        `${functionApi}/Notifications/getNotificationsLength/${user?._id}`,
      );
      if (status == 200 && data) {
        setUnseenCount(data.notiLength);
      }
    } catch (error) {
      ToastAndroid.show('Failed to fetch notifications');
      console.error('Failed to fetch notifications length:', error);
    }
  }, [user]);
  // update the socket
  useSocketOn(socket, 'updateNoti', async data => {
    if (data) {
      console.log(data.text);
      await getNotifications();
    }
  });
  // receive the socket data from another peer
  useSocketOn(socket, 'Receive-Noti', async () => {
    await getNotifications();
    Vibration.vibrate([0, 200, 100, 200]);
  });
  // render ui after load
  if (!UiLoading) return <HomeSkeleton />;

  return (
    <ScrollView
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={refreshUser} />
      }>
      <View style={{flex: 1, backgroundColor: Colors.white, rowGap: 15}}>
        {/* header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('profile')}>
            <FastImage
              priority={FastImage.priority.high}
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
                  width: width * 0.18,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: Colors.veryLightGrey,
                  aspectRatio: 1,
                },
              ]}
            />
          </TouchableOpacity>
          <Pressable
            style={{
              position: 'relative',
              borderWidth: 1,
              padding: 10,
              borderRadius: 50,
              borderColor: Colors.veryLightGrey,
            }}
            onPress={() => navigation.navigate('notifications')}>
            {/* notificatio badge */}
            <Text
              style={{
                display: unseenCount > 0 ? 'flex' : 'none',
                position: 'absolute',
                top: height * 0.01,
                right: -width * 0.0,
                aspectRatio: 1,
                width: width * 0.03,
                fontSize: width * 0.018,
                textAlign: 'center',
                color: 'white',
                backgroundColor: 'red',
                borderRadius: 50,
                zIndex: 100,
                borderColor: 'white',
                borderWidth: 1,
                left: width * 0.05,
              }}>
              {unseenCount}
            </Text>
            <FontAwesomeIcon
              color={Colors.lightGrey}
              icon={faBell}
              size={width * 0.05}
            />
          </Pressable>
        </View>
        {/* greeding and notification */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            flexWrap: 'wrap',
            // borderWidth: 1,
          }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: width * 0.05,
              lineHeight: 30,
              letterSpacing: 0.3,
              fontFamily: Font.SemiBold,
            }}>
            Hello👋 {user?.firstName}!
          </Text>
        </View>
        {/* search bar */}
        <TouchableOpacity
          onPress={() => navigation.navigate('search')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginHorizontal: 15,
            borderRadius: 25,
            paddingHorizontal: 10,
            height: height * 0.06,
            backgroundColor: '#F6F6F6',
          }}>
          <EvilIcons
            name="search"
            size={width * 0.07}
            color={Colors.veryDarkGrey}
          />
          <TextInput
            onPress={() => navigation.navigate('search')}
            placeholder="Search"
            placeholderTextColor={Colors.veryDarkGrey}
            style={{
              // letterSpacing: 0.5,
              fontFamily: Font.Regular,
              color: Colors.veryDarkGrey,
            }}
          />
        </TouchableOpacity>
        {/* Ideas wrapper */}
        <IdeasWrapper />
        {/* Recent courses */}
        <RecentCourses />
        {/* Freelancer project */}
        <FreelancerBanner />
        {/* premium projects */}
        <Suspense
          fallback={
            <View style={{margin: 15}}>
              <Skeleton width="100%" height={height * 0.2} radius={10} />
            </View>
          }>
          <PremiumProjects />
        </Suspense>
        {/* companies */}
        <Suspense
          fallback={
            <View style={{margin: 15}}>
              <Skeleton width="100%" height={height * 0.2} radius={10} />
            </View>
          }>
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
                marginHorizontal: 15,
              }}>
              <TouchableOpacity
                style={{flexDirection: 'column', rowGap: 10}}
                onPress={() => navigation.navigate('VideoTutorial')}>
                <EvilIcons name="play" size={50} />
                <Text
                  style={{
                    letterSpacing: 0.3,
                    color: Colors.mildGrey,
                    fontFamily: Font.Regular,
                    fontSize: width * 0.035,
                  }}>
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
              <Skeleton width="100%" height={height * 0.2} radius={10} />
            </View>
          }>
          <View
            style={{
              marginBottom: 10,
            }}>
            <SuggestionWapper refresh={suggestRefresh} />
          </View>
        </Suspense>
      </View>
      {/* model for show update */}
      <Modal visible={showUpdate} transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.24)',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              height: '20%',
              width: '100%',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: 10,
            }}>
            <Text
              style={{
                fontSize: width * 0.05,
                fontFamily: Font.SemiBold,
                textAlign: 'center',
              }}>
              A new update is ready!
            </Text>
            <TouchableOpacity
              onPress={() => restart()}
              style={{
                backgroundColor: Colors.violet,
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 100,
              }}>
              <Text style={{color: Colors.white, fontFamily: Font.Regular}}>
                Restart now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
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
