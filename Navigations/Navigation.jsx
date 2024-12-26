import React from 'react';
import {StyleSheet, Dimensions, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../LoginSystem/Login';
import Home from '../Screens/Home';
import Profile from '../Screens/Profile';
import {Colors, font} from '../constants/Colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faBell,
  faHome,
  faPlus,
  faSuitcase,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import Post from '../Screens/Post';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
import {faUser} from '@fortawesome/free-regular-svg-icons';
import Wallet from '../Pages/Wallet';
import CoreChallenges from '../Pages/CoreChallenges';
import CoreChallengeViewer from '../Pages/CoreChallengeViewer';
import VideoTutorials from '../Pages/VideoTutorials';
import InterViewDetails from '../Pages/InterViewDetails';
import InterviewPrep from '../Pages/InterviewPrep';
import Task from '../Pages/Task';
import HeadingText from '../utils/HeadingText';
import PasswordReset from '../LoginSystem/PasswordReset';
import OtpVerification from '../LoginSystem/OtpVerification';
import SetPassword from '../LoginSystem/SetPassword';
import {BlurView} from '@react-native-community/blur';
import PostFeed from '../components/PostFeed';

// Tab navigations functions 
const {width, height} = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// Tab Navigator
const TabNavigation = () => {
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
          height: 80,
          paddingBottom: 10,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: -15,
          marginBottom: 5,
          fontFamily: font.poppins,
          color: Colors.mildGrey,
          letterSpacing: 1,
          backgroundColor: 'transparent',
        },
        tabBarHideOnKeyboard: true,
        // tabBarShowLabel: false,
      }}>
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
        name="Challenges"
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
            <FontAwesomeIcon
              icon={faPlus}
              color={Colors.white}
              size={width * 0.07}
            />
          ),
          tabBarIconStyle: {
            backgroundColor: '#3a6ea5',
            width: 70,
            height: 70,
            borderRadius: 40,
            position: 'absolute',
            top: -35,
            elevation: 1,
            borderWidth: 4,
            borderColor: 'white',
          },
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
    </Tab.Navigator>
  );
};
{
  /* <a href="https://imgbb.com/"><img src="https://i.ibb.co/FYLw2bP/sword.png" alt="sword" border="0"></a>
<a href="https://imgbb.com/"><img src="https://i.ibb.co/Cv25P24/suitcase.png" alt="suitcase" border="0"></a>
<a href="https://imgbb.com/"><img src="https://i.ibb.co/DD0gmYp/home.png" alt="home" border="0"></a> */
}
// Stack navigations
const Stack = createNativeStackNavigator();

const StackNavigations = () => {
  return (
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
        name="Wallet"
        component={Wallet}
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
        name="taskScreen"
        component={Task}
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
    </Stack.Navigator>
  );
};

// Main Navigation Container
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StackNavigations />
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
