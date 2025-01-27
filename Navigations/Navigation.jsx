import React from 'react';
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
import YourRewards from '../Pages/YourReward';
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
import {BottomTabBar} from '@react-navigation/bottom-tabs';
import SelectedProject from '../Pages/SelectedProject';

// Tab navigations functions
const {width, height} = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// Tab Navigator functions
const TabNavigation = () => {
  return (
    <View style={{flex: 1}}>
      {/* Tab Navigator */}
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
            height: hp('10%'),
            paddingBottom: 10,
            borderTopWidth: 0,
            // borderWidth: 1,
          },
          tabBarLabelStyle: {
            fontSize: width * 0.027,
            marginTop: -15,
            marginBottom: 5,
            fontFamily: font.poppins,
            color: Colors.mildGrey,
            letterSpacing: 1,
            // backgroundColor: 'transparent',
          },
          tabBarHideOnKeyboard: true,
        }}
        tabBar={props => (
          <>
            {/* <View
              style={{
                borderWidth: 0,
                backgroundColor: 'white',
                height: 'auto',
              }}>
              <BannerAdd /> */}
            {/* </View> */}
            {/* Render the default tab bar */}
            <BottomTabBar {...props} />
          </>
        )}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({color}) => (
              // <FontAwesomeIcon icon={faHome} color={color} size={width * 0.06} />
              <Image
                source={{uri: 'https://i.ibb.co/DD0gmYp/home.png'}}
                style={{
                  width: width * 0.06,
                  height: width * 0.06,
                  tintColor: color, // This will apply a tint to your image if needed
                }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Feed"
          component={PostFeed}
          options={{
            tabBarIcon: ({color}) => (
              <Image
                source={{uri: 'https://i.ibb.co/hHNtxqx/newspaper-folded.png'}}
                style={{
                  width: width * 0.06,
                  height: width * 0.06,
                  tintColor: color, // This will apply a tint to your image if needed
                }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Code"
          component={Challenge}
          options={{
            tabBarIcon: ({color}) => (
              // <MaterialCommunityIcons
              //   name="sword-cross"
              //   size={width * 0.06}
              //   color={color}
              // />
              <Image
                source={{
                  uri: 'https://img.icons8.com/parakeet-line/96/source-code.png',
                }}
                style={{
                  width: width * 0.07,
                  height: width * 0.07,
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
            tabBarIcon: ({color}) => (
              <Image
                source={{uri: 'https://i.ibb.co/WWg5vdF/plus.png'}}
                style={{
                  width: width * 0.06,
                  height: width * 0.06,
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
            tabBarIcon: ({color}) => (
              // <FontAwesomeIcon
              //   icon={faSuitcase}
              //   color={color}
              //   size={width * 0.06}
              // />
              <Image
                source={{
                  uri: 'https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/50/external-suitcase-interface-kiranshastry-lineal-kiranshastry-1.png',
                }}
                style={{
                  width: width * 0.07,
                  height: width * 0.07,
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
            tabBarIcon: ({color}) => (
              // <FontAwesomeIcon icon={faUser} color={color} size={width * 0.06} />

              <Image
                source={{uri: 'https://i.ibb.co/9Vck1rW/people.png'}}
                style={{
                  width: width * 0.07,
                  height: width * 0.07,
                  tintColor: color, // This will apply a tint to your image if needed
                }}
                resizeMode="contain"
              />
            ),
          }}
        />
        {/* Add other screens here */}
      </Tab.Navigator>
    </View>
  );
};

// Stack navigations
const Stack = createNativeStackNavigator();

const StackNavigations = () => {
  return (
    <View style={{flex: 1}}>
      <Stack.Navigator
        // initialRouteName="splash"
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
          name="yourrewards"
          component={YourRewards}
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
  ].includes(currentScreen);
  return (
    <View style={{flex: 1}}>
      {shouldShowBanner && <BannerAdd />}
      <StackNavigations />
    </View>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  bannerContainer: {
    // height: 50, // Adjust the height of your banner ad
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    // bottom: hp('9%'),
    // zIndex: 100,
  },
});
