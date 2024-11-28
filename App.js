import React, {useEffect} from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
  LogBox,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './Navigations/Navigation';
import {SocketProvider} from './Socket/SocketContext';
import {ContextProvider} from './Context/Contexter';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MobileAds from 'react-native-google-mobile-ads';
import {OneSignal, LogLevel} from 'react-native-onesignal';
import axios from 'axios';
import {loginApi} from './Api';
// --- //
const {width} = Dimensions.get('window');
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const App = () => {
  // inintialze google admob
  useEffect(() => {
    MobileAds()
      .initialize()
      .then(adapter => {
        console.log('Google Mobile Ads initialized');
      });
  }, []);
  // config onesignal
  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Debug);
    OneSignal.initialize('861087e8-fa92-422a-9185-a129ca3e86d2');
    OneSignal.Notifications.requestPermission(true);
    OneSignal.Notifications.addEventListener('click', event => {
      console.log('Notification clicked:', event);
      Alert.alert('Notification Clicked', JSON.stringify(event));
    });
  }, []);
  return (
    <GestureHandlerRootView>
      <ContextProvider>
        <SocketProvider>
          <View style={styles.cn}>
            <SafeAreaView style={{flex: 1}}>
              <AppNavigator />
              <StatusBar backgroundColor="white" barStyle="dark-content" />
            </SafeAreaView>
          </View>
        </SocketProvider>
      </ContextProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  cn: {
    flex: 1,
    width: width,
    backgroundColor: '#ffff',
  },
});
