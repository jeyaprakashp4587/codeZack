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
const {width} = Dimensions.get('window');
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// -------------- //

const App = () => {
  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => {
        console.log('Google Mobile Ads initialized');
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
