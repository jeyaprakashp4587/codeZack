import React from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';
import {Colors} from '../constants/Colors';

const Skeleton = props => {
  const animatedValue = useSharedValue(0);

  React.useEffect(() => {
    animatedValue.value = withRepeat(withTiming(1, {duration: 200}), -1, true);
  }, [animatedValue]);

  const animatedStyle = useAnimatedStyle(() => {
    // Use explicit number conversion to avoid precision errors
    const opacity = interpolate(Number(animatedValue.value), [0, 1], [0.5, 1]);
    return {opacity};
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          animatedStyle,
          {
            width: props.width,
            height: props.height,
            backgroundColor: Colors.veryLightGrey,
            borderRadius: props.radius,
            marginTop: props.mt || 1,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Skeleton;
