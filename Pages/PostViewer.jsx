import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, ToastAndroid, View} from 'react-native';

import Posts from '../components/Posts';
import {useEffect} from 'react';
import axios from 'axios';
import {profileApi} from '../Api';
import {useData} from '../Context/Contexter';
import HeadingText from '../utils/HeadingText';
import Skeleton from '../Skeletons/Skeleton';

const PostViewer = () => {
  const {selectedPost} = useData();
  const [post, setPost] = useState();
  const getPostDetail = useCallback(async () => {
    try {
      const res = await axios.get(
        `${profileApi}/Post/getPostDetails/${selectedPost}`,
      );
      if (res.data) {
        setPost(res.data);
        console.log(post?.SenderDetails);
      }
    } catch (error) {
      ToastAndroid.show('Error fetch posts', ToastAndroid.SHORT);
    }
  }, [selectedPost]);
  useEffect(() => {
    getPostDetail();
  }, []);
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Post" />
      </View>
      {post ? (
        <Posts
          post={post?.Posts} // Pass post data as props
          senderDetails={post?.SenderDetails}
          index={0} // Pass index
          admin={false}
          elevation={true} // Optionally pass if the user is admin
          // updateLikeCount={updateLikeCount} // Function to update like count
        />
      ) : (
        <View
          style={{paddingHorizontal: 15, flexDirection: 'column', rowGap: 10}}>
          <Skeleton width="95%" height={30} radius={20} />
          <Skeleton width="95%" height={100} radius={20} />
          <Skeleton width="95%" height={150} radius={20} />
        </View>
      )}
    </View>
  );
};

export default PostViewer;

const styles = StyleSheet.create({});
