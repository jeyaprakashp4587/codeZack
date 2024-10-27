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
  StatusBar,
  ImageBackground,
} from 'react-native';
import {Colors, pageView} from '../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeSkeleton from '../Skeletons/HomeSkeleton';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBell, faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../Context/Contexter';
import {Dimensions, InteractionManager} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {RefreshControl} from 'react-native';
import axios from 'axios';
import Api from '../Api';
import SuggestionWapper from '../components/SuggestionWapper';
import useSocketOn from '../Socket/useSocketOn';
import Ripple from 'react-native-material-ripple';
import Posts from '../components/Posts';
import {debounce} from 'lodash';
import {SocketData} from '../Socket/SocketContext';
// import Carousel from 'react-native-snap-carousel';
import Carousel from 'react-native-reanimated-carousel';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import BannerAdd from '../Adds/BannerAdd';
// code -----------

const {width, height} = Dimensions.get('window');
const Home = () => {
  const navigation = useNavigation();
  const {user, setUser} = useData();
  const [load, setLoad] = useState(false);
  const [suggestDisplay, setSuggestDisplay] = useState(true);
  const [suggestRefresh, setSuggestRefresh] = useState(false);
  const [posts, setPosts] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  // const { sendLocalNotification } = NotificationsHook();
  const socket = SocketData();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoad(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
    if (currentHour < 20) return 'Good Evening';
    return 'Good Night';
  }, []);

  const refreshUser = useCallback(async () => {
    setRefresh(true);
    try {
      setSuggestRefresh(true);
      const res = await axios.post(`${Api}/Login/getUser`, {
        userId: user?._id,
      });
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
        // console.log(res.data);
        setPosts(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  }, [user?._id]);

  const getNotifications = useCallback(async () => {
    try {
      if (user?.Notifications.length < 0) {
        // console.log(user?.Notifications.length);
      }
      const res = await axios.get(
        `${Api}/Notifications/getNotifications/${user?._id}`,
      );
      if (res.status == 200) {
        const unseen = res?.data?.filter(notification => !notification.seen);
        setUnseenCount(unseen.length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [user?._id, useSocketOn]);
  useEffect(() => {
    navigation.addListener('focus', () => {
      getNotifications();
    });
  }, [navigation]);
  useSocketOn(socket, 'updateNoti', async data => {
    console.log(data);
    if (data) {
      getNotifications();
    }
  });
  useSocketOn(socket, 'Noti-test', async data => {
    // console.log(data);
    // await sendLocalNotification(data);
    await getNotifications();
  });

  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      await getConnectionPosts();
      await getNotifications();
      await setProfilePic();
    });
  }, [getConnectionPosts, getNotifications]);

  const setProfilePic = useCallback(async () => {
    try {
      const res = await axios.post(`${Api}/Profile/setProfile/${user?._id}`);
      if (res.data) {
        setUser(res.data);
      }
    } catch (error) {
      console.error('Failed to set profile picture:', error);
    }
  }, [user?._id, setUser]);
  // -- //
  const HandlesuggestDisplay = data => {
    setSuggestDisplay(data);
  };
  // ideas warapper navigations
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
  // -----------//
  if (!load) {
    return <HomeSkeleton />;
  }
  // --------- //
  return (
    <View style={pageView}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('profile')}>
          <Image
            source={{
              uri: user?.Images?.profile
                ? user?.Images?.profile
                : user?.Gender == 'Male'
                ? 'https://i.ibb.co/3T4mNMm/man.png'
                : 'https://i.ibb.co/3mCcQp9/woman.png',
            }}
            style={[
              styles.profileImage,
              {
                width: width * 0.12,
                height: width * 0.12,
                borderRadius: 50,
                borderWidth: 1,
                // borderColor: "#404040",
              },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('search')}
          style={[styles.searchButton, {flex: 1, marginHorizontal: 10}]}>
          {/* <EvilIcons name="search" size={30} color={Colors.lightGrey} /> */}
          <FontAwesomeIcon icon={faSearch} size={20} color={Colors.lightGrey} />
          <TextInput
            onPress={() => navigation.navigate('search')}
            placeholder="Search"
            style={styles.searchInput}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('message')}>
          <AntDesign name="message1" size={24} color={Colors.lightGrey} />
        </TouchableOpacity>
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
          }}>
          <Text
            style={{
              color: Colors.mildGrey,
              fontSize: width * 0.04,
              lineHeight: 30,
              letterSpacing: 1,
              paddingVertical: 10,
              // fontWeight: "700",
            }}>
            {getCurrentGreeting()} {user?.firstName}!
          </Text>

          <Ripple
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
          </Ripple>
        </View>
        {/* ideas wrapper */}
        <View style={styles.ideasWrapper}>
          <TouchableOpacity style={styles.ideaBox} onPress={carrerNav}>
            <Image
              source={{uri: 'https://i.ibb.co/pX2r3T0/carrer.png'}}
              style={[styles.icon, {tintColor: '#ff9999'}]}
            />
            <Text
              style={[styles.ideaText, {fontSize: width * 0.02}]}
              numberOfLines={1}>
              Career
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={courseNav} style={styles.ideaBox}>
            <Image
              source={{uri: 'https://i.ibb.co/QcnJZSz/learning.png'}}
              style={[styles.icon, {tintColor: '#8600b3'}]}
            />
            <Text
              numberOfLines={1}
              style={[styles.ideaText, {fontSize: width * 0.02}]}>
              Your Course
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={assignmentNav}
            style={styles.ideaBox}
            // onPress={() => userSuggestions()}
          >
            <Image
              source={{uri: 'https://i.ibb.co/5n0FQH4/submit.png'}}
              style={[styles.icon, {tintColor: '#006622'}]}
            />
            <Text
              numberOfLines={1}
              style={[styles.ideaText, {fontSize: width * 0.02}]}>
              Assignment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ideaBox} onPress={activityNav}>
            <Image
              source={{uri: 'https://i.ibb.co/dtmzjnb/calendar.png'}}
              style={[styles.icon, {tintColor: '#0077b3'}]}
            />
            <Text
              style={[styles.ideaText, {fontSize: width * 0.02}]}
              numberOfLines={1}>
              Your Activity
            </Text>
          </TouchableOpacity>
        </View>
        {/* carousel  */}
        <Carousel
          width={Math.round(width * 1)}
          height={Math.round(height * 0.22)}
          style={{marginVertical: 10}}
          data={carouselData}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => navigation.navigate(item.route)}
              style={{
                flex: 1,
                // elevation: 2,
                borderRadius: 10,
                overflow: 'hidden',
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
                    fontSize: Math.round(width * 0.06),
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
                  style={{width: '80%', height: '100%'}}
                />
              </LinearGradient>
            </TouchableOpacity>
          )}
          autoPlay={true}
          autoPlayInterval={2000}
        />
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
      </ScrollView>
      {/* <FlatList
        data={posts} // Data for FlatList
        keyExtractor={item => item._id} // Key for each post
        renderItem={({item, index}) => (
          <Posts
            post={item.Posts} // Pass post data as props
            senderDetails={item.SenderDetails}
            index={index} // Pass index
            admin={false} // Optionally pass if the user is admin
            // updateLikeCount={updateLikeCount} // Function to update like count
          />
        )}
      /> */}
    </View>
  );
};

export default React.memo(Home);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  profileImage: {
    borderRadius: 50,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: Colors.veryLightGrey,
  },
  searchInput: {
    color: Colors.lightGrey,
    fontSize: 16,
    paddingHorizontal: 10,
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  ideasWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    paddingHorizontal: 15,
    // borderWidth: 1,
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
