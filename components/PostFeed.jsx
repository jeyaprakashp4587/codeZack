import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {profileApi} from '../Api';
import {useData} from '../Context/Contexter';
import Posts from './Posts';
import HeadingText from '../utils/HeadingText';
import PostSkeleton from '../Skeletons/PostSkeleton';
import {Font} from '../constants/Font';

const PostFeed = () => {
  const {user} = useData();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Track if there are more posts to fetch
  const POSTS_PER_PAGE = 10;
  const [refreshing, setRefreshing] = useState(false);
  const {width, height} = Dimensions.get('window');
  const [loading, setLoading] = useState(true);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    getConnectionPosts(1).then(() => {
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
            setHasMore(false);
          }
          setPosts(prevPosts => [...prevPosts, ...newPosts]);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoadingMore(false);
      }
    },
    [user?.ConnectionsPost],
  );

  useEffect(() => {
    getConnectionPosts().then(() => setLoading(false));
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        getConnectionPosts(nextPage);
        return nextPage;
      });
    }
  };
  // render postSkeleton ui when api was get the post data from server
  if (loading)
    return (
      <View
        style={{
          flexDirection: 'column',
          rowGap: 10,
          flex: 1,
          backgroundColor: 'white',
        }}>
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </View>
    );
  return (
    <View style={{borderWidth: 0, backgroundColor: 'white', flex: 1}}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Post Feeds" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal: 0, flex: 1, height: '80%'}}>
          {posts.length <= 0 ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                // borderWidth: 1,
                borderColor: 'red',
              }}>
              <Text
                style={{
                  fontSize: width * 0.04,
                  letterSpacing: 1,
                  textAlign: 'center',
                  fontFamily: Font.Regular,
                }}>
                No Posts there
              </Text>
            </View>
          ) : (
            <FlatList
              nestedScrollEnabled={true}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={posts}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item._id}
              initialNumToRender={2}
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
              ListFooterComponent={loadingMore ? <PostSkeleton /> : null}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PostFeed;
