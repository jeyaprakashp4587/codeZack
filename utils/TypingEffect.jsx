import React, {useState, useEffect} from 'react';
import {Text, View, Animated, StyleSheet, Dimensions} from 'react-native';
import {Font} from '../constants/Font';

const {width, height} = Dimensions.get('window'); // Get the window width

const TypingEffect = () => {
  const fullText = 'Welcome To CodeZack, Grow Your Career From Here';
  const [animatedText, setAnimatedText] = useState([]);
  const [letters] = useState(fullText.split(' ')); // Split by space to handle words for wrapping

  useEffect(() => {
    const animations = letters.map((word, index) => {
      // Animations for opacity, translateY, and scale
      const opacity = new Animated.Value(0);
      const translateY = new Animated.Value(30); // Start from below
      const scale = new Animated.Value(0.5); // Start small

      return {
        word,
        opacity,
        translateY,
        scale,
        animation: Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 800, // Duration for fade-in effect
            delay: index * (1000 / letters.length), // Staggered delay
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 800,
            delay: index * (1000 / letters.length),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 800,
            delay: index * (1000 / letters.length),
            useNativeDriver: true,
          }),
        ]),
      };
    });

    setAnimatedText(animations); // Store animations in state

    // Trigger animations after the state is updated
    Animated.stagger(
      100,
      animations.map(item => item.animation),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {animatedText.map((item, index) => (
        <Animated.View
          key={index}
          style={[
            styles.wordContainer,
            {
              opacity: item.opacity,
              transform: [{translateY: item.translateY}, {scale: item.scale}],
            },
          ]}>
          <Text
            style={[
              styles.welcomeText,
              {
                fontSize: width * 0.045, // Responsive font size
              },
            ]}>
            {item.word + ' '}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  wordContainer: {
    flexDirection: 'row',
    marginBottom: 2, // Adjust line spacing
  },
  welcomeText: {
    textAlign: 'center',
    color: 'black',
    letterSpacing: 1,
    fontSize: width * 0.03,
    fontFamily: Font.SemiBold,
  },
});

export default TypingEffect;
