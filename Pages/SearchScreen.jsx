import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, pageView} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';
import axios from 'axios';
import {debounce} from 'lodash';
import {functionApi} from '../Api';
import {FlatList} from 'react-native';
import {Dimensions} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {useData} from '../Context/Contexter';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSearch, faTimes} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Skeleton from '../Skeletons/Skeleton';
import SuggestionWapper from '../components/SuggestionWapper';
import FastImage from 'react-native-fast-image';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {Font} from '../constants/Font';

const SearchScreen = ({navigation}) => {
  // -------------- //
  const {setSelectedUser, user} = useData();
  const userName = useRef(null);
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const {width, height} = Dimensions.get('window');
  const [loading, setLoading] = useState(false);

  // Debounced search function
  const handleSearch = useCallback(
    debounce(text => {
      setLoading(true);
      userName.current = text.trim();
      if (userName.current) {
        getUserName();
      }
    }, 100),
    [],
  );

  // Fetch username data based on input
  const getUserName = useCallback(async () => {
    try {
      const res = await axios.post(
        `${functionApi}/Search/getUserName/${user?._id}`,
        {
          userName: userName.current,
        },
      );
      if (res.data) {
        setUsers(res.data);
        setLoading(false);
      } else {
        setUsers([]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  }, [user?._id]);

  // Memoize history to avoid unnecessary updates
  const updateSearchHistory = useCallback(term => {
    setHistory(prevHistory => {
      const newHistory = [
        term,
        ...prevHistory.filter(item => item.firstName !== term.firstName),
      ].slice(0, 5);
      AsyncStorage.setItem('history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // Load search history from AsyncStorage on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem('history');
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    };
    loadHistory();
  }, []);

  // Remove item from history
  const removeHistory = useCallback(
    userId => {
      const filteredHistory = history.filter(user => user?._id !== userId);
      setHistory(filteredHistory);
      AsyncStorage.setItem('history', JSON.stringify(filteredHistory));
    },
    [history],
  );

  // Optimized rendering of search results using memoization
  const ResultRender = () => {
    if (users?.length > 0) {
      return (
        <FlatList
          initialNumToRender={2}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          data={users}
          style={{marginTop: 5}}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{
                width: '98%',
                padding: height * 0.015,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10,
                alignSelf: 'center',
                elevation: 2,
                backgroundColor: 'white',
                borderRadius: 5,
              }}>
              <FastImage
                priority={FastImage.priority.high}
                source={{uri: item?.Images?.profile}}
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: 50,
                }}
              />
              <View style={{flex: 1, flexDirection: 'column', paddingLeft: 10}}>
                <Text
                  style={{
                    letterSpacing: 1,
                    color: Colors.mildGrey,
                    fontFamily: Font.Regular,
                  }}
                  numberOfLines={1}>
                  {item.firstName} {item.LastName}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    letterSpacing: 1,
                    color: Colors.mildGrey,
                    fontSize: width * 0.03,
                    fontFamily: Font.Regular,
                  }}>
                  {item.InstitudeName}
                </Text>
              </View>
              <Ripple
                onPress={() => {
                  navigation.navigate('userprofile');
                  setSelectedUser(item._id);
                  updateSearchHistory(item);
                }}
                style={{
                  borderRadius: 50,
                  borderWidth: 0.6,
                  borderColor: Colors.violet,
                }}>
                <Text
                  style={{
                    padding: 5,
                    paddingHorizontal: 25,
                    color: Colors.violet,
                    fontFamily: Font.Medium,
                  }}>
                  View
                </Text>
              </Ripple>
            </TouchableOpacity>
          )}
        />
      );
    } else if (!loading) {
      return (
        <Text
          style={{
            fontSize: width * 0.05,
            color: Colors.lightGrey,
            marginTop: 20,
            textAlign: 'center',
            fontFamily: Font.Regular,
          }}>
          No result found!
        </Text>
      );
    }
  };
  // ------------------------- //
  return (
    <View style={pageView}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Search" />
      </View>
      {/* search button */}
      <TouchableOpacity
        style={{
          borderWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginHorizontal: 15,
          borderRadius: 25,
          paddingHorizontal: 10,
          borderColor: Colors.veryLightGrey,
          marginVertical: 10,
          height: height * 0.06,
          backgroundColor: '#F6F6F6',
        }}>
        <EvilIcons
          name="search"
          size={width * 0.07}
          color={Colors.veryDarkGrey}
        />
        <TextInput
          autoFocus
          placeholder="Search"
          style={{
            color: Colors.lightGrey,
            fontSize: 16,
            paddingHorizontal: 10,
            // borderWidth: 1,
            flex: 1,
            padding: 10,
            fontFamily: Font.Regular,
          }}
          focusable={true}
          onChangeText={handleSearch}
        />
      </TouchableOpacity>
      {/* show history list */}
      {history.length > 0 && (
        <View style={{marginTop: 10, paddingHorizontal: 15}}>
          {/* Recent Search */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: width * 0.05,
                color: Colors.veryDarkGrey,
                letterSpacing: 1,
                paddingVertical: 10,
                fontFamily: 'Poppins-Medium',
              }}>
              Recent Search
            </Text>
            <TouchableOpacity onPress={() => setHistory([])}>
              <Text
                style={{
                  color: Colors.violet,
                  textDecorationLine: 'underline',
                  letterSpacing: 1,
                  fontFamily: 'Poppins-Medium',
                }}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>
          {/* history lists */}
          {history.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('userprofile');
                setSelectedUser(item._id);
              }}
              key={index}
              style={{
                flexDirection: 'row',
                columnGap: 15,
                alignItems: 'center',
                borderBottomWidth: 1,
                paddingBottom: 10,
                marginHorizontal: 15,
                borderColor: Colors.veryLightGrey,
                // justifyContent: "center",
              }}>
              <Image
                source={{uri: item.Images?.profile}}
                style={{
                  width: width * 0.14,
                  height: height * 0.07,
                  borderRadius: 50,
                  resizeMode: 'cover',
                }}
              />

              <Text
                style={{
                  letterSpacing: 1,
                  color: Colors.mildGrey,
                  flex: 1,
                  fontFamily: 'Poppins-Light',
                  // borderWidth: 1,
                }}>
                {item.firstName} {item.LastName}
              </Text>
              <Ripple onPress={() => removeHistory(item._id)}>
                <FontAwesomeIcon
                  icon={faTimes}
                  size={20}
                  color={Colors.mildGrey}
                />
              </Ripple>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {/* usersList */}
      <View style={{paddingHorizontal: 15}}>
        {users.length > 0 && (
          <Text
            style={{
              paddingTop: 10,
              // fontWeight: '700',
              fontFamily: Font.Medium,
            }}>
            Results of ({userName.current}){' '}
          </Text>
        )}
        <ResultRender />
      </View>

      {loading ||
        (userName?.current?.length <= 1 && (
          <View style={{marginHorizontal: 15}}>
            <Skeleton width="100%" height={height * 0.07} radius={5} mt={10} />
            <Skeleton width="100%" height={height * 0.07} radius={5} mt={10} />
            <Skeleton width="100%" height={height * 0.07} radius={5} mt={10} />
            <Skeleton width="100%" height={height * 0.07} radius={5} mt={10} />
          </View>
        ))}
      <View
        style={{
          marginTop: 20,
        }}>
        <SuggestionWapper />
      </View>
    </View>
  );
};

export default React.memo(SearchScreen);

const styles = StyleSheet.create({});
