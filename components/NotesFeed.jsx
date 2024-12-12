import React, {useRef, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Animated,
  Modal,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../constants/Colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import Ripple from 'react-native-material-ripple';

const NotesFeed = () => {
  const {width, height} = Dimensions.get('window');
  const scrollAnimation = useRef(new Animated.Value(0)).current;
  const [shouldScroll, setShouldScroll] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const containerWidth = height * 0.08; // Width matching the image height
  const [showNotesModel, setShowNotesModel] = useState(false);
  // Start the animation only if the text overflows
  useEffect(() => {
    if (shouldScroll) {
      Animated.loop(
        Animated.timing(scrollAnimation, {
          toValue: 1,
          duration: 8000, // Adjust for speed of scrolling
          useNativeDriver: true,
        }),
      ).start();
    }
  }, [shouldScroll, scrollAnimation]);

  // Interpolation for text translation
  const translateX = scrollAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -textWidth], // Scroll the full text width
  });

  return (
    <View style={{paddingLeft: 15, marginVertical: 15, flexDirection: 'row'}}>
      <Ripple
        style={{
          height: height * 0.09,
          aspectRatio: 1,
          borderRadius: 50,
          borderWidth: 2,
          borderColor: Colors.lightGrey,
          marginRight: 10,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 5,
        }}>
        <Text
          style={{
            fontSize: width * 0.019,
            textAlign: 'center',
            letterSpacing: 1,
          }}>
          Add Yours Notes
        </Text>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: 'white',
            right: 5,
            top: height * 0.065,
          }}>
          <FontAwesomeIcon icon={faPlus} size={17} color={Colors.lightGrey} />
        </TouchableOpacity>
      </Ripple>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={new Array(10)}
        renderItem={({item, index}) => (
          <View
            style={{
              marginRight: 15,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LinearGradient
              colors={['#99ccff', '#ffb3b3', '#99ccff', '#ffb3b3']}
              style={{
                padding: 3,
                borderRadius: 50,
              }}>
              <TouchableOpacity onPress={() => setShowNotesModel(true)}>
                <View
                  style={{
                    borderRadius: 50,
                    backgroundColor: '#fff',
                    borderWidth: 0,
                  }}>
                  <Image
                    source={require('../assets/CC.png')}
                    style={{
                      height: height * 0.08,
                      aspectRatio: 1,
                      borderRadius: 50,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </LinearGradient>
            <View
              style={{
                width: containerWidth,
                overflow: 'hidden',
                // marginTop: 10,
              }}>
              <Animated.Text
                numberOfLines={1}
                onLayout={event => {
                  const {width: actualTextWidth} = event.nativeEvent.layout;
                  setTextWidth(actualTextWidth);
                  setShouldScroll(actualTextWidth > containerWidth); // Enable scrolling only if text overflows
                }}
                style={{
                  transform: shouldScroll ? [{translateX}] : [],
                  fontSize: 12,
                  color: Colors.mildGrey,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  letterSpacing: 1.3,
                }}>
                Learn Web Development
              </Animated.Text>
            </View>
          </View>
        )}
      />
      {/* model for show notes */}
      <Modal
        visible={showNotesModel}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotesModel(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}></View>
      </Modal>
    </View>
  );
};

export default NotesFeed;

const styles = StyleSheet.create({});
