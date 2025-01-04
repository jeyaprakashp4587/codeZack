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
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const NotesFeed = ({refresh}) => {
  const {user, setSelectedUser, setUser} = useData();
  const navigation = useNavigation();
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
        // console.log('data not valid');
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
        fetchConnectionNotes();
        setUploadNotesModal(false);
        setNoteText('');
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
        // console.log(response.data.notes);
        setNotes(response.data.notes);
        // console.log('Fetched connection notes:', response.data.notes);
      } else {
        console.error('Failed to fetch notes:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, [user, refresh]);
  // snack visible state

  // delete notes
  const handleDeleteNotes = useCallback(async noteId => {
    try {
      const response = await axios.post(`${profileApi}/Post/deleteNote`, {
        userId: user?._id,
        noteId,
      });
      if (response.data.success) {
        setShowNotesModel(false);
        fetchConnectionNotes();
        setUser(prev => ({...prev, Notes: response.data.Notes}));
        await AsyncStorage.removeItem('lastUploadDate');
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    fetchConnectionNotes();
  }, [refresh]);

  return (
    <View
      style={{
        paddingLeft: 15,
        marginVertical: 15,
        flexDirection: 'row',
        // marginTop: 30,
      }}>
      <Ripple
        onPress={() => setUploadNotesModal(true)}
        style={{
          height: height * 0.09,
          aspectRatio: 1,
          borderRadius: 50,
          borderWidth: 1,
          borderColor: Colors.lightGrey,
          marginRight: 10,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 5,
          // width: width * 0.2,
        }}>
        <Text
          style={{
            fontSize: width * 0.02,
            textAlign: 'center',
            letterSpacing: 1,
            // fontWeight: '600',
            color: Colors.mildGrey,
          }}>
          Upload
        </Text>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: 'white',
            right: wp('2.5%'),
            top: hp('6.8%'),
            // borderWidth: 1,
          }}>
          <FontAwesomeIcon icon={faPlus} size={17} color={Colors.lightGrey} />
        </TouchableOpacity>
      </Ripple>
      {/* List conection  notes*/}
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
                  {!item?.NotesSenderProfile ? (
                    <Skeleton
                      width={width * 0.18}
                      height={height * 0.08}
                      radius={50}
                    />
                  ) : (
                    <Image
                      source={{uri: item?.NotesSenderProfile}}
                      style={{
                        height: height * 0.085,
                        aspectRatio: 1,
                        borderRadius: 50,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </LinearGradient>
            <View
              style={{
                width: containerWidth,
                position: 'absolute',
                zIndex: 10,
                top: 0,
                bottom: 0,
                backgroundColor: Colors.white,
                height: height * 0.028,
                justifyContent: 'center',
                borderWidth: 1,
                borderRadius: 50,
                borderColor: Colors.lightGrey,
                left: wp('1%'),
              }}>
              {/* dot1 effect */}
              <View
                style={{
                  // width: 5,
                  // height: 5,
                  backgroundColor: 'white',
                  position: 'absolute',
                  bottom: hp('-.6%'),
                  padding: 5,
                  zIndex: 10,
                  borderRadius: 50,
                  left: wp('.6%'),
                  borderColor: Colors.mildGrey,
                  borderWidth: 1,
                  borderTopWidth: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  borderBottomRightRadius: 0,
                  borderTopLeftRadius: 0,
                }}
              />
              {/* dot2 effect */}
              <View
                style={{
                  width: 5,
                  height: 5,
                  backgroundColor: 'white',
                  position: 'absolute',
                  bottom: -height * 0.018,
                  padding: 2,
                  zIndex: 10,
                  borderRadius: 50,
                  left: width * 0.035,
                }}
              />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: width * 0.024,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  letterSpacing: 1.3,
                  paddingHorizontal: 10,
                }}>
                {item?.NotesText}
              </Text>
            </View>
          </View>
        )}
      />
      {/* Show notes modal */}
      <Modal visible={showNotesModel} animationType="slide">
        <BlurView
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'white',
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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('userprofile');
              setSelectedUser(selectedNote?.NotesSenderId);
            }}
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
                // justifyContent: 'space-between',
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
              <Ripple
                onPress={() => {
                  handleDeleteNotes(selectedNote?.NotesId);
                }}
                style={{
                  display:
                    user?._id == selectedNote?.NotesSenderId ? 'flex' : 'none',
                }}>
                <AntDesign name="delete" color={Colors.lightGrey} size={18} />
              </Ripple>
            </View>
            <Text
              style={{
                letterSpacing: 2,
                fontSize: width * 0.04,
                // textAlign: 'center',
              }}>
              {selectedNote?.NotesText}
            </Text>
          </TouchableOpacity>
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
                // backgroundColor: Colors.violet,
                borderRadius: 5,
                flexDirection: 'row',
                columnGap: 10,
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: Colors.violet,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  // color: 'white',
                  letterSpacing: 1.4,
                }}>
                Upload Note
              </Text>
              {uploadIndi && (
                <ActivityIndicator size={20} color={Colors.mildGrey} />
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
