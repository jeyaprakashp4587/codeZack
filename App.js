import React, {useEffect} from 'react';
import {Dimensions, StatusBar, StyleSheet, View} from 'react-native';
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
import {PaperProvider} from 'react-native-paper';
import CodePush from 'react-native-code-push';

const {width} = Dimensions.get('window');
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});
let check = {checkFrequency: CodePush.CheckFrequency.ON_APP_START};

const App = () => {
  useEffect(() => {
    // createNotificationChannel();
    MobileAds()
      .initialize()
      .then(adapter => {
        console.log('Google Mobile Ads initialized');
      });
  }, []);

  return (
    <GestureHandlerRootView>
      <PaperProvider>
        <ContextProvider>
          <SocketProvider>
            <View style={styles.cn}>
              <SafeAreaView style={{flex: 1}}>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
              </SafeAreaView>
            </View>
          </SocketProvider>
        </ContextProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default CodePush(check)(App);

const styles = StyleSheet.create({
  cn: {
    flex: 1,
    width: width,
    backgroundColor: '#ffff',
  },
});
