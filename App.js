import React, {useEffect} from 'react';
import {Dimensions, StatusBar, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './Navigations/Navigation';
import {SocketProvider} from './Socket/SocketContext';
import {ContextProvider} from './Context/Contexter';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MobileAds from 'react-native-google-mobile-ads';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {withStallion} from 'react-native-stallion';
const {width} = Dimensions.get('window');

const App = () => {
  useEffect(() => {
    MobileAds().initialize();
  }, []);
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
};

export default withStallion(App);

const styles = StyleSheet.create({
  cn: {
    flex: 1,
    width: width,
    backgroundColor: '#ffff',
  },
});
