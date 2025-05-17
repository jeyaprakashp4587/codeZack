import React, {useEffect, useState} from 'react';
import {StyleSheet, Dimensions, Image, View} from 'react-native';
import {
  NavigationContainer,
  useNavigationState,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../LoginSystem/Login';
import Home from '../Screens/Home';
import Profile from '../Screens/Profile';
import {Colors, font} from '../constants/Colors';
import Post from '../Screens/Post';
import Challenge from '../Screens/Challenge';
import MessageScreen from '../Screens/MessageScreen';
import SignUp from '../LoginSystem/SignUp';
import Carrer from '../Pages/Carrer';
import SelectedCourse from '../Pages/SelectedCourse';
import LearnPage from '../Pages/LearnPage';
import CourseDetails from '../Pages/CourseDetails';
import ChooseChallenge from '../Pages/ChooseChallenge';
import ChallengeDetail from '../Pages/ChallengeDetail';
import YourCourses from '../Pages/YourCourses';
import Placement from '../Screens/Placement';
import SplashScreen from '../Splashscreen/SplashScreen';
import YourChallenges from '../Pages/YourChallenges';
import YourActivity from '../Pages/YourActivity';
import UserProfile from '../Pages/UserProfile';
import Notifications from '../Pages/Notifications';
import SearchScreen from '../Pages/SearchScreen';
import Assignment from '../Pages/Assignments';
import PostViewer from '../Pages/PostViewer';
import ChallengeViewer from '../Pages/ChallengeViewer';
import AssignmentPlayGround from '../Pages/AssignmentPlayGround';
import CoreChallenges from '../Pages/CoreChallenges';
import CoreChallengeViewer from '../Pages/CoreChallengeViewer';
import VideoTutorials from '../Pages/VideoTutorials';
import InterViewDetails from '../Pages/InterViewDetails';
import InterviewPrep from '../Pages/InterviewPrep';
import HeadingText from '../utils/HeadingText';
import PasswordReset from '../LoginSystem/PasswordReset';
import OtpVerification from '../LoginSystem/OtpVerification';
import SetPassword from '../LoginSystem/SetPassword';
import PostFeed from '../components/PostFeed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AllUsersPage from '../Pages/AllUsersPage';
import BannerAdd from '../Adds/BannerAdd';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SelectedProject from '../Pages/SelectedProject';
import {Font} from '../constants/Font';
import useSocketOn from '../Socket/useSocketOn';
import {SocketData} from '../Socket/SocketContext';
import ChallengesBanner from '../components/ChallengesBanner';
import UpdatePage from '../components/UpdatePage';
import InterviewSucess from '../Pages/InterviewSucess';
import IntroScreen from '../Pages/IntroScreen';

// Tab navigations functions
const {width, height} = Dimensions.get('window');
const Tab = createBottomTabNavigator();
// Tab Navigator functions
const TabNavigation = () => {
  const socket = SocketData();
  const navigationState = useNavigationState(state => state);
  // create sockets for get badges
  const [feedBadge, setFeedBadge] = useState(false);
  const [homeBadge, setHomeBadge] = useState(false);
  useSocketOn(socket, 'getFeedBadge', async data => {
    if ('Feed' != navigationState?.routes[navigationState?.index]?.name) {
      setFeedBadge(true);
    }
  });
  useSocketOn(socket, 'getHomeBadge', async data => {
    if ('Home' != navigationState?.routes[navigationState?.index]?.name) {
      setHomeBadge(true);
    }
  });
  // clear socket badge when user focus particular screen
  useEffect(() => {
    const currentScreen =
      navigationState?.routes?.[navigationState.index]?.name;
    if (currentScreen == 'Tab') setFeedBadge(false);
    if (currentScreen == 'Tab') setHomeBadge(false);
  }, [navigationState]);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarIconStyle: {
          color: Colors.lightGrey,
        },
        tabBarActiveTintColor: Colors.violet,
        tabBarInactiveTintColor: Colors.mildGrey,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: width * 0.021,
          color: Colors.mildGrey,
          letterSpacing: 1,
          fontFamily: Font.Regular,
        },
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Image
              source={{
                uri: focused
                  ? 'https://img.icons8.com/ios-filled/50/home.png'
                  : 'https://i.ibb.co/DD0gmYp/home.png',
              }}
              style={{
                width: width * 0.06,
                height: width * 0.06,
                tintColor: color,
              }}
              resizeMode="contain"
            />
          ),
          tabBarBadge: homeBadge ? '' : null,
          tabBarBadgeStyle: {
            backgroundColor: 'red',
            borderWidth: 3,
            borderColor: 'white',
            position: 'absolute',
            top: 0,
          },
        }}
      />
      <Tab.Screen
        name="Feed"
        component={PostFeed}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Image
              source={{
                uri: focused
                  ? 'https://img.icons8.com/external-nawicon-glyph-nawicon/128/external-newspaper-communication-nawicon-glyph-nawicon.png'
                  : 'https://i.ibb.co/hHNtxqx/newspaper-folded.png',
              }}
              style={{
                width: focused ? width * 0.06 : width * 0.06,
                aspectRatio: 1,
                tintColor: color,
              }}
              resizeMode="contain"
            />
          ),
          tabBarBadge: feedBadge ? '' : null,
          tabBarBadgeStyle: {
            backgroundColor: 'red',
            borderWidth: 3,
            borderColor: 'white',
            position: 'absolute',
            top: 0,
          },
        }}
      />
      <Tab.Screen
        name="Code"
        component={Challenge}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Image
              source={{
                uri: focused
                  ? 'https://img.icons8.com/deco-glyph/100/source-code.png'
                  : 'https://img.icons8.com/parakeet-line/96/source-code.png',
              }}
              style={{
                width: focused ? width * 0.075 : width * 0.07,
                aspectRatio: 1,
                tintColor: color, // This will apply a tint to your image if needed
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={Post}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Image
              source={{
                uri: focused
                  ? 'https://img.icons8.com/ios-filled/100/plus-2-math.png'
                  : 'https://i.ibb.co/WWg5vdF/plus.png',
              }}
              style={{
                width: focused ? width * 0.07 : width * 0.06,
                aspectRatio: 1,
                tintColor: color, // This will apply a tint to your image if needed
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={Placement}
        options={{
          tabBarIcon: ({color, focused}) => (
            // <FontAwesomeIcon
            //   icon={faSuitcase}
            //   color={color}
            //   size={width * 0.06}
            // />
            <Image
              source={{
                uri: focused
                  ? 'https://img.icons8.com/external-kiranshastry-solid-kiranshastry/128/external-suitcase-interface-kiranshastry-solid-kiranshastry-1.png'
                  : 'https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/50/external-suitcase-interface-kiranshastry-lineal-kiranshastry-1.png',
              }}
              style={{
                width: focused ? width * 0.08 : width * 0.07,
                aspectRatio: 1,
                tintColor: color, // This will apply a tint to your image if needed
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({color, focused}) => (
            // <FontAwesomeIcon icon={faUser} color={color} size={width * 0.06} />

            <Image
              source={{
                uri: focused
                  ? 'https://img.icons8.com/ios-glyphs/100/user--v1.png'
                  : 'https://i.ibb.co/9Vck1rW/people.png',
              }}
              style={{
                width: focused ? width * 0.085 : width * 0.07,
                aspectRatio: 1,
                tintColor: color, // This will apply a tint to your image if needed
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Stack navigations
const Stack = createNativeStackNavigator();

const StackNavigations = () => {
  return (
    <View style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName="splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen
          name="splash"
          component={SplashScreen}
          options={{headerShadow: false}}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{headerShadow: false}}
        />
        <Stack.Screen
          name="Tab"
          component={TabNavigation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="profile"
          component={Profile}
          options={{headerShadow: false}}
        />
        <Stack.Screen
          name="signup"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="message"
          component={MessageScreen}
          options={{headerShadow: false}}
        />
        <Stack.Screen
          name="carrerScreen"
          component={Carrer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="course"
          component={SelectedCourse}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="learn"
          component={LearnPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="courseDetails"
          component={CourseDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="chooseChallenge"
          component={ChooseChallenge}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="challengeDetail"
          component={ChallengeDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="notifications"
          component={Notifications}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="yourcourse"
          component={YourCourses}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="search"
          component={SearchScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="placement"
          component={Placement}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="yourchallenges"
          component={YourChallenges}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="youractivities"
          component={YourActivity}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="userprofile"
          component={UserProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Assignments"
          component={Assignment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Postviewer"
          component={PostViewer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChallengeViewer"
          component={ChallengeViewer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AssignmentPlayGround"
          component={AssignmentPlayGround}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="CoreChallenge"
          component={CoreChallenges}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CoreChallengeViewer"
          component={CoreChallengeViewer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VideoTutorial"
          component={VideoTutorials}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InterviewDetail"
          component={InterViewDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InterviewPreparation"
          component={InterviewPrep}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="passwordReset"
          component={PasswordReset}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="otpVerification"
          component={OtpVerification}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="setPassword"
          component={SetPassword}
          options={{headerShown: false}}
        />
        {/* go back operator */}
        <Stack.Screen
          name="goBack"
          component={HeadingText}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="postFeed"
          component={PostFeed}
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="allUserPage"
          component={AllUsersPage}
          options={{
            headerShown: false,
            // animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="selectedProject"
          component={SelectedProject}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="challengeBanner"
          component={ChallengesBanner}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="updatePageScreen"
          component={UpdatePage}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="interviewSucess"
          component={InterviewSucess}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="introScreen"
          component={IntroScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

// Main Navigation Container
const AppNavigator = () => {
  const navigationState = useNavigationState(state => state);
  const currentScreen = navigationState?.routes[navigationState?.index]?.name;
  const shouldShowBanner = ![
    'login',
    'signup',
    'splash',
    'otpVerification',
    'setPassword',
    'passwordReset',
    'updatePageScreen',
  ].includes(currentScreen);
  return (
    <View style={{flex: 1}}>
      {/* {shouldShowBanner && <BannerAdd />} */}
      <StackNavigations />
    </View>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  bannerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
