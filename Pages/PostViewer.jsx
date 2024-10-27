import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Posts from '../components/Posts';
import {useEffect} from 'react';
import axios from 'axios';
import Api from '../Api';
import {useData} from '../Context/Contexter';

const PostViewer = () => {
  const {selectedPost} = useData();
  const [post, setPost] = useState();
  const getPostDetail = useCallback(async () => {
    const res = await axios.get(`${Api}/Post/getPostDetails/${selectedPost}`);
    if (res.data) {
      // console.log(res.data);
      setPost(res.data);
      // console.log(post);
    }
  }, [selectedPost]);
  useEffect(() => {
    getPostDetail();
  }, []);
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <Posts
        post={post?.Posts} // Pass post data as props
        senderDetails={post?.SenderDetails}
        index={0} // Pass index
        admin={false}
        elevation={true} // Optionally pass if the user is admin
        // updateLikeCount={updateLikeCount} // Function to update like count
      />
    </View>
  );
};

export default PostViewer;

const styles = StyleSheet.create({});
