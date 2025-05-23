import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

const TypingEffectDots = ({color}) => {
  const dotAnimations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    dotAnimations.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      {dotAnimations.map((anim, index) => (
        <Animated.Text
          key={index}
          style={{
            transform: [{translateY: anim}],
            color: color ?? 'white',
            marginHorizontal: 5,
            fontSize: 40,
          }}>
          .
        </Animated.Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    borderColor: 'red',
  },
});

export default TypingEffectDots;
