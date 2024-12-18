import React, {useRef, useEffect, useState, useCallback} from 'react';
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
  TextInput,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../constants/Colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus, faTimes} from '@fortawesome/free-solid-svg-icons';
import Ripple from 'react-native-material-ripple';
import {BlurView} from '@react-native-community/blur';
import {profileApi} from '../Api';
import axios from 'axios';
import {useData} from '../Context/Contexter';
import Skeleton from '../Skeletons/Skeleton';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotesFeed = () => {
  const {user} = useData();
  const {width, height} = Dimensions.get('window');
  const scrollAnimation = useRef(new Animated.Value(0)).current;
  const [shouldScroll, setShouldScroll] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const containerWidth = height * 0.08; // Width matching the image height
  const [showNotesModel, setShowNotesModel] = useState(false);
  const [uploadNotesModal, setUploadNotesModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedNote, setSelectedNote] = useState();
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
  }, [shouldScroll]);

  // Interpolation for text translation
  const translateX = scrollAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -textWidth], // Scroll the full text width
  });

  // Handle text input change
  const handleText = text => {
    setNoteText(text);
  };

  // Upload note
  const [uploadIndi, setUploadIndi] = useState(false);
  const uploadNote = useCallback(async () => {
    if (!noteText.trim()) {
      ToastAndroid.show('Notes are empty', ToastAndroid.SHORT);
      return;
    }
    const todayDateKey = moment().format('YYYY-MM-DD');
    try {
      const lastUploadDate = await AsyncStorage.getItem('lastUploadDate');
      // Check if the user has already posted today
      if (lastUploadDate === todayDateKey) {
        console.log('data not valid');
        ToastAndroid.show(
          'You can only upload one note per day. Try again tomorrow!',
          ToastAndroid.SHORT,
        );
        return;
      }
      setUploadIndi(true);
      const response = await axios.post(`${profileApi}/Post/uploadNote`, {
        userId: user?._id,
        noteText,
      });
      if (response.data.success) {
        // Save today's date as the last upload date
        await AsyncStorage.setItem('lastUploadDate', todayDateKey);
        ToastAndroid.show('Note uploaded successfully!', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Failed to upload note', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error uploading note:', error);
      ToastAndroid.show(
        'An error occurred. Please try again later.',
        ToastAndroid.SHORT,
      );
    } finally {
      setUploadIndi(false);
    }
  }, [noteText, user]);
  // Fetch connection notes
  const [notes, setNotes] = useState([]);
  const fetchConnectionNotes = useCallback(async () => {
    try {
      const response = await axios.get(
        `${profileApi}/Post/getConnectionNotes/${user?._id}`,
      );
      if (response.data.success) {
        setNotes(response.data.notes);
        console.log('Fetched connection notes:', response.data.notes);
      } else {
        console.error('Failed to fetch notes:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchConnectionNotes();
  }, []);

  return (
    <View style={{paddingLeft: 15, marginVertical: 15, flexDirection: 'row'}}>
      <Ripple
        onPress={() => setUploadNotesModal(true)}
        style={{
          height: height * 0.08,
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
            top: height * 0.06,
            borderWidth: 1,
          }}>
          <FontAwesomeIcon icon={faPlus} size={17} color={Colors.lightGrey} />
        </TouchableOpacity>
      </Ripple>
      {notes.length <= 0 ? (
        <View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={new Array(5)}
            renderItem={({item, index}) => (
              <View style={{marginRight: 10}}>
                <Skeleton
                  width={width * 0.16}
                  height={height * 0.08}
                  radius={50}
                />
              </View>
            )}
          />
        </View>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={notes}
          renderItem={({item, index}) => (
            <View
              key={index}
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
                <TouchableOpacity
                  onPress={() => {
                    setShowNotesModel(true);
                    setSelectedNote(item);
                  }}>
                  <View
                    style={{
                      borderRadius: 50,
                      backgroundColor: '#fff',
                      borderWidth: 0,
                    }}>
                    <Image
                      source={{uri: item?.NotesSenderProfile}}
                      style={{
                        height: height * 0.07,
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
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: width * 0.03,
                    color: Colors.mildGrey,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    letterSpacing: 1.3,
                  }}>
                  {item?.NotesText}
                </Text>
              </View>
            </View>
          )}
        />
      )}
      {/* Show notes modal */}
      <Modal
        visible={showNotesModel}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotesModel(false)}>
        <BlurView
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          blurAmount={2}
          blurType="light">
          <TouchableOpacity
            onPress={() => {
              setShowNotesModel(false);
            }}
            style={{
              position: 'absolute',
              top: height * 0.3,
              right: width * 0.08,
            }}>
            <FontAwesomeIcon icon={faTimes} size={20} />
          </TouchableOpacity>
          <View
            style={{
              width: '80%',
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              elevation: 4,
              rowGap: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 10,
              }}>
              <Image
                source={{uri: selectedNote?.NotesSenderProfile}}
                style={{
                  width: width * 0.13,
                  // height: height * 0.0,
                  aspectRatio: 1,
                  borderRadius: 50,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  columnGap: 5,
                }}>
                <Text
                  style={{
                    fontWeight: '600',
                    letterSpacing: 1,
                    textAlign: 'center',
                  }}>
                  {selectedNote?.NotesSenderFirstName}
                </Text>
                <Text style={{fontWeight: '600', letterSpacing: 1}}>
                  {selectedNote?.NotesSenderLastName}
                </Text>
              </View>
            </View>
            <Text
              style={{
                letterSpacing: 2,
                fontSize: width * 0.04,
                // textAlign: 'center',
              }}>
              {selectedNote?.NotesText}
            </Text>
          </View>
        </BlurView>
      </Modal>
      {/* Upload notes modal */}
      <Modal
        visible={uploadNotesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setUploadNotesModal(false)}>
        <BlurView
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          blurAmount={2}
          blurType="light">
          <View
            style={{
              width: '80%',
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              elevation: 4,
              rowGap: 10,
              // flexDirection: 'row',
            }}>
            <TextInput
              placeholder="What's your today task?"
              style={{
                borderWidth: 0.4,
                paddingHorizontal: 14,
                borderColor: Colors.lightGrey,
                borderRadius: 5,
              }}
              value={noteText}
              onChangeText={handleText}
              placeholderTextColor={Colors.lightGrey}
            />
            <Ripple
              onPress={uploadNote}
              style={{
                padding: 10,
                backgroundColor: Colors.violet,
                borderRadius: 5,
                flexDirection: 'row',
                columnGap: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  letterSpacing: 1.4,
                }}>
                Upload Note
              </Text>
              {uploadIndi && (
                <ActivityIndicator size={20} color={Colors.white} />
              )}
            </Ripple>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

export default NotesFeed;

const styles = StyleSheet.create({});
