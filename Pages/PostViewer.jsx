import React, {useCallback, useState} from 'react';
import {Dimensions, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import Posts from '../components/Posts';
import {useEffect} from 'react';
import axios from 'axios';
import {profileApi} from '../Api';
import {useData} from '../Context/Contexter';
import HeadingText from '../utils/HeadingText';
import Skeleton from '../Skeletons/Skeleton';
import PostSkeleton from '../Skeletons/PostSkeleton';
import {Font} from '../constants/Font';

const PostViewer = () => {
  const {width} = Dimensions.get('window');
  const {selectedPost} = useData();
  console.log(selectedPost);

  const [post, setPost] = useState();
  const [loading, setLoading] = useState(true);
  const getPostDetail = useCallback(async () => {
    try {
      const res = await axios.get(
        `${profileApi}/Post/getPostDetails/${selectedPost}`,
      );
      if (res.data && res.status === 200) {
        setPost(res.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      // setLoading(false);
      ToastAndroid.show('Error fetch posts', ToastAndroid.SHORT);
    }
  }, [selectedPost]);
  useEffect(() => {
    getPostDetail();
  }, []);
  // render skeletion ui effect when api get posts from Server
  if (loading) return <PostSkeleton />;
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
        <View style={{paddingHorizontal: 15}}>
          <Text
            style={{
              fontSize: width * 0.036,
              fontFamily: Font.Regular,
              letterSpacing: 0.6,
            }}>
            Post not available
          </Text>
        </View>
      )}
    </View>
  );
};

export default PostViewer;

const styles = StyleSheet.create({});
