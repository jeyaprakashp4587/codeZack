import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {loginApi} from '../Api';
import axios from 'axios';
import {Colors} from '../constants/Colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Ripple from 'react-native-material-ripple';
import ParagraphText from '../utils/PragraphText';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../Context/Contexter';
import {TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {faEye} from '@fortawesome/free-regular-svg-icons';
import HeadingText from '../utils/HeadingText';

const AllUsersPage = () => {
  const {width, height} = Dimensions.get('window');

  const Navigation = useNavigation();
  const {setSelectedUser, user} = useData();
  const [suggestions, setSuggestions] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 6; // Number of suggestions to fetch at a time
  // Function to fetch suggestions
  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${loginApi}/suggestions/getAllSuggestions/${user?._id}?skip=${skip}&limit=${limit}`,
      );
      const {data, hasMore} = response.data;
      setSuggestions(prev => [...prev, ...data]);

      // Append new suggestions
      setHasMore(hasMore); // Check if more data is available
      setSkip(prev => prev + limit); // Update skip for the next fetch
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // Load suggestions on component mount
  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Grow Your Network" />
      </View>
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
          data={suggestions}
          showsHorizontalScrollIndicator={false}
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
                elevation: 3,
                borderRadius: 10,
                overflow: 'hidden',
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
                    Colors.veryLightGrey,
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
                    <Image
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
                        }}>
                        {item?.firstName} {item?.LastName}
                      </Text>
                      <Text
                        style={{
                          letterSpacing: 0.5,
                          fontSize: width * 0.028,
                          color: Colors.mildGrey,
                        }}
                        numberOfLines={1}>
                        {item?.InstitudeName}
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
            isLoading && (
              <View style={{padding: 10}}>
                <Text style={{textAlign: 'center', color: Colors.mildGrey}}>
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
