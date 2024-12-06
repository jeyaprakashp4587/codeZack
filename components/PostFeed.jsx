import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {loginApi} from '../Api';
import {useData} from '../Context/Contexter';
import Posts from './Posts';

const PostFeed = () => {
  const {user} = useData();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const POSTS_PER_PAGE = 10;

  const getConnectionPosts = useCallback(
    async (pageNumber = 0) => {
      try {
        setLoadingMore(true);
        const res = await axios.get(
          `${loginApi}/Post/getConnectionPosts/${user?._id}?skip=${
            pageNumber * POSTS_PER_PAGE
          }&limit=${POSTS_PER_PAGE}`,
        );
        if (res.status === 200) {
          setPosts(prevPosts => [...prevPosts, ...res.data]); // Append new posts
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoadingMore(false);
      }
    },
    [user?._id],
  );
  // call the function on comp mout
  useEffect(() => {
    getConnectionPosts();
  }, [getConnectionPosts]);
  return (
    <View style={{borderWidth: 0}}>
      <FlatList
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
        onEndReachedThreshold={0.5} // Trigger onEndReached when scrolled 50% to the bottom
        onEndReached={() => {
          if (!loadingMore) {
            setPage(prevPage => {
              const nextPage = prevPage + 1;
              getConnectionPosts(nextPage);
              return nextPage;
            });
          }
        }}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : null
        }
      />
    </View>
  );
};

export default PostFeed;

const styles = StyleSheet.create({});
