import {useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';

const useShakeAnimation = (duration = 4000) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 1,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -1,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      shakeAnimation.setValue(0);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [shakeAnimation, duration]);

  const shakeInterpolation = shakeAnimation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-5, 0, 5],
  });

  return shakeInterpolation;
};

export default useShakeAnimation;
