import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {functionApi} from '../Api';
import axios from 'axios';
import {Colors} from '../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../Context/Contexter';
import {TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HeadingText from '../utils/HeadingText';
import FastImage from 'react-native-fast-image';
import truncateText from '../hooks/truncateText';
import {Font} from '../constants/Font';
import Skeleton from '../Skeletons/Skeleton';

const AllUsersPage = () => {
  const {width, height} = Dimensions.get('window');

  const Navigation = useNavigation();
  const {setSelectedUser, user} = useData();
  const [suggestions, setSuggestions] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 6; // Number of suggestions to fetch at a time
  const [refresh, setRefresh] = useState(false);
  const handleRefresh = useCallback(async () => {
    await fetchSuggestions();
  }, []);
  // Function to fetch suggestions
  const fetchSuggestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${functionApi}/suggestions/getAllSuggestions/${user?._id}?skip=${skip}&limit=${limit}`,
      );
      const {data, hasMore} = response.data;
      setSuggestions(prev => [...prev, ...data]);
      setRefresh(false);
      // Append new suggestions
      setHasMore(hasMore); // Check if more data is available
      setSkip(prev => prev + limit); // Update skip for the next fetch
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, hasMore, skip]);
  // Load suggestions on component mount
  useEffect(() => {
    fetchSuggestions().finally(() => setUiLoad(false));
  }, []);
  const [uiload, setUiLoad] = useState(true);
  if (uiload) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          rowGap: 10,
          paddingHorizontal: 15,
          paddingTop: 20,
        }}>
        {Array.from({length: 18}).map((index, item) => (
          <Skeleton width={width * 0.43} height={120} radius={10} />
        ))}
      </View>
    );
  }
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Grow Your Network" />
      </View>
      {suggestions?.length <= 0 && (
        <Text style={{paddingHorizontal: 15}}>No more suggestion</Text>
      )}
      <View
        style={{
          borderWidth: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          flexWrap: 'wrap',
          paddingHorizontal: 15,
          paddingTop: 15,
        }}>
        <FlatList
          nestedScrollEnabled={true}
          scrollEnabled
          refreshControl={<RefreshControl refreshing={refresh} />}
          refreshing={true}
          data={suggestions}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{gap: 20}}
          keyExtractor={(item, index) => `${item?._id || index}`}
          key={'2-columns'}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                Navigation.navigate('userprofile');
                setSelectedUser(item._id);
              }}
              style={{
                borderWidth: 0,
                width: '40%',
                flex: 1,
                elevation: 2,
                borderRadius: 10,
                overflow: 'hidden',
                marginBottom: 20,
              }}>
              <ImageBackground
                source={{
                  uri:
                    item?.Images?.coverImg ??
                    'https://i.ibb.co/Fh1fwGm/2151777507.jpg',
                }}
                resizeMode="cover"
                style={{
                  borderRadius: 7,
                  overflow: 'hidden',
                  marginRight: 10,
                  borderWidth: 1,
                  borderColor: Colors.veryLightGrey,
                  flex: 1,
                  width: '100%',
                }}>
                <LinearGradient
                  colors={[
                    'rgba(0,0,0,0.1)',
                    'hsl(0, 0%, 97%)',
                    'hsl(0, 0%, 100%)',
                    Colors.white,
                  ]}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  style={{
                    flex: 1,
                    width: '100%',
                    padding: 10,
                    paddingVertical: 20,
                  }}>
                  <View
                    style={{
                      margin: 'auto',
                      justifyContent: 'flex-start',
                      flexDirection: 'column',
                      borderWidth: 0,
                      width: '100%',
                      rowGap: 5,
                    }}>
                    <FastImage
                      priority={FastImage.priority.high}
                      source={{uri: item?.Images?.profile}}
                      style={{
                        width: width * 0.15,
                        aspectRatio: 1,
                        borderWidth: 3,
                        borderColor: Colors.white,
                        borderRadius: 50,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: width * 0.034,
                          color: Colors.veryDarkGrey,
                          letterSpacing: 0.7,
                          // fontWeight: '700',
                          fontFamily: Font.SemiBold,
                        }}>
                        {truncateText(
                          item?.firstName + ' ' + item?.LastName,
                          10,
                        )}
                      </Text>
                      <Text
                        style={{
                          letterSpacing: 0.5,
                          fontSize: width * 0.028,
                          color: Colors.mildGrey,
                          fontFamily: Font.Medium,
                        }}
                        numberOfLines={1}>
                        {truncateText(item?.InstitudeName, 15)}
                        {/* {item?.InstitudeName} */}
                      </Text>
                      <Text
                        style={{
                          fontSize: width * 0.023,
                          fontFamily: Font.Regular,
                          letterSpacing: 0.4,
                        }}>
                        {item?.District}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          )}
          onEndReached={() => {
            if (hasMore && !isLoading) {
              fetchSuggestions();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading &&
            suggestions?.length > 0 && (
              <View style={{padding: 10}}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: Colors.mildGrey,
                    fontFamily: Font.Medium,
                  }}>
                  Loading more suggestions...
                </Text>
              </View>
            )
          }
        />
      </View>
    </View>
  );
};

export default AllUsersPage;

const styles = StyleSheet.create({});
