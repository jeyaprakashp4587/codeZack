import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {profileApi} from '../Api';
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
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    getConnectionPosts().then(() => {
      setRefreshing(false);
    });
  }, []);
  // get connections post
  const getConnectionPosts = useCallback(
    async (pageNumber = 0) => {
      if (!hasMore) return; // Stop fetching if no more posts are available
      setLoadingMore(true);
      try {
        const res = await axios.get(
          `${profileApi}/Post/getConnectionPosts/${user?._id}?skip=${
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
    getConnectionPosts();
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
  const [Pagerefreshing, setPageRefreshing] = useState(false);
  const refreshPost = useCallback(async () => {
    try {
      setPageRefreshing(true);
      await getConnectionPosts().finally(() => {
        setPageRefreshing(false);
      });
    } catch (error) {
      ToastAndroid.show('Refreshing failed');
    }
  }, []);

  return (
    <View style={{borderWidth: 0, backgroundColor: 'white', flex: 1}}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Post Feeds" />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={Pagerefreshing}
            onRefresh={() => refreshPost()}
          />
        }>
        <View style={{paddingHorizontal: 15}}>
          {posts.length <= 0 ? (
            <Text style={{fontSize: width * 0.04, letterSpacing: 1}}>
              No Posts there
            </Text>
          ) : (
            <FlatList
              nestedScrollEnabled={true}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={posts}
              showsVerticalScrollIndicator={false}
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
                  <ActivityIndicator size="small" color={Colors.mildGrey} />
                ) : null
              }
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PostFeed;

const styles = StyleSheet.create({});
