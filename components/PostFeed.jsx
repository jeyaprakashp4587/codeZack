import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {loginApi} from '../Api';
import {useData} from '../Context/Contexter';
import Posts from './Posts';
import HeadingText from '../utils/HeadingText';
import {Colors} from '../constants/Colors';

const PostFeed = () => {
  const {user} = useData();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Track if there are more posts to fetch
  const POSTS_PER_PAGE = 10;
  const [refreshing, setRefreshing] = useState(false);
  const {width, height} = Dimensions.get('window');
  const getConnectionPosts = useCallback(
    async (pageNumber = 0) => {
      if (!hasMore) return; // Stop fetching if no more posts are available
      setLoadingMore(true);
      try {
        const res = await axios.get(
          `${loginApi}/Post/getConnectionPosts/${user?._id}?skip=${
            pageNumber * POSTS_PER_PAGE
          }&limit=${POSTS_PER_PAGE}`,
        );
        if (res.status === 200) {
          const newPosts = res.data;
          if (newPosts.length < POSTS_PER_PAGE) {
            setHasMore(false); // No more posts to fetch
          }
          setPosts(prevPosts => [...prevPosts, ...newPosts]);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoadingMore(false);
      }
    },
    [user?._id, hasMore],
  );

  useEffect(() => {
    getConnectionPosts(); // Fetch initial posts
  }, [getConnectionPosts]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        getConnectionPosts(nextPage);
        return nextPage;
      });
    }
  };

  return (
    <View style={{borderWidth: 0, backgroundColor: 'white', flex: 1}}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Post Feeds" />
      </View>
      <View style={{paddingHorizontal: 15}}>
        {posts.length <= 0 ? (
          <Text style={{fontSize: width * 0.04, letterSpacing: 1}}>
            No Posts there
          </Text>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={Colors.veryDarkGrey} // Replace with your desired color
              />
            }
            data={posts}
            keyExtractor={item => item._id}
            renderItem={({item, index}) => (
              <Posts
                post={item.Posts}
                senderDetails={item.SenderDetails}
                index={index}
                admin={false}
              />
            )}
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
};

export default PostFeed;

const styles = StyleSheet.create({});
