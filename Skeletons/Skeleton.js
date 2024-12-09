import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {Colors} from '../constants/Colors';

const Skeleton = props => {
  const animatedValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }),
  ).start();

  const opacityInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: opacityInterpolate,
          width: props.width,
          height: props.height,
          backgroundColor: Colors.veryLightGrey,
          borderRadius: props.radius,
          marginTop: props.mt ? props.mt : 1,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // paddingHorizontal: 15,
  },
});

export default Skeleton;
