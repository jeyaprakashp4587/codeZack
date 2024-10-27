import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors, font} from '../constants/Colors';
import {faComments, faHeart} from '@fortawesome/free-regular-svg-icons';
import {Dimensions} from 'react-native';
import axios from 'axios';
import {useData} from '../Context/Contexter';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import RelativeTime from './RelativeTime';
import Api from '../Api';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const {width, height} = Dimensions.get('window');

const Posts = ({post, index, admin, senderDetails, elevation}) => {
  const initialText = post?.PostText;
  const {user, setUser, setSelectedUser} = useData();
  const navigation = useNavigation();
  const wordThreshold = 10;
  // console.log(post);
  const [expanded, setExpanded] = useState(false);
  const [deldisplay, setDeldisplay] = useState(false);
  const [likeCount, setLikeCount] = useState(Number(post?.Like));
  const [comments, setComments] = useState(post?.Comments || []); // List of comments
  const [newComment, setNewComment] = useState(''); // Track new comment
  const [liked, setLiked] = useState(
    post?.LikedUsers?.some(likeuser => likeuser?.LikedUser === user?._id),
  );
  const [likedUsers, setLikedUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContentType, setModalContentType] = useState(''); // Either 'likes' or 'comments'

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const countWords = text => text?.trim().split(/\s+/).length;

  const handleDelDisp = () => {
    setDeldisplay(prev => !prev);
  };

  const HandleDelete = useCallback(
    async postId => {
      try {
        const res = await axios.post(`${Api}/Post/deletePost/${user?._id}`, {
          postId,
        });
        if (res.data) {
          setUser(res.data);
        }
      } catch (err) {
        // console.log(err);
      }
    },
    [user],
  );

  const handleLikeToggle = useCallback(async () => {
    if (liked) {
      await handleUnlike(post?._id);
    } else {
      await handleLike(post?._id);
    }
  }, [liked]);

  const handleLike = useCallback(
    async postId => {
      setLiked(true);
      try {
        const response = await axios.post(`${Api}/Post/likePost/${postId}`, {
          userId: user?._id,
          LikedTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
        });
        if (response.status === 200) {
          setLikeCount(prev => prev + 1);
        }
      } catch (error) {
        setLiked(false);
      }
    },
    [user],
  );

  const handleUnlike = useCallback(
    async postId => {
      setLiked(false);
      try {
        const res = await axios.post(`${Api}/Post/unlikePost/${postId}`, {
          userId: user._id,
        });
        if (res.status === 200) {
          setLikeCount(prev => prev - 1);
        }
      } catch (error) {
        setLiked(true);
      }
    },
    [user],
  );

  const handleSubmitComment = useCallback(async () => {
    if (newComment.trim() === '') return;

    try {
      const res = await axios.post(`${Api}/Post/commentPost/${post._id}`, {
        userId: user._id,
        commentText: newComment,
        commentTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
      });

      if (res.status === 200) {
        console.log(res.data.comment);
        setComments([...comments, res.data.comment]);
        setNewComment('');
      }
    } catch (error) {
      // console.error("Error submitting comment:", error);
    }
  }, [newComment, comments, user]);

  const handleShowLikedUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${Api}/Post/getLikedUsers/${post._id}`);
      if (res.status === 200) {
        setLikedUsers(res.data.likedUsers);
        setModalContentType('likes');
        setIsModalVisible(true);
        // console.log(res.data);
      }
    } catch (err) {
      // console.error("Failed to fetch liked users:", err);
    }
  }, [post]);

  const handleShowComments = useCallback(async () => {
    setModalContentType('comments');
    setIsModalVisible(true);
    const res = await axios.get(`${Api}/Post/getComments/${post?._id}`);
    if (res.data) {
      // console.log(res.data);
      setComments(res.data.comments);
    }
  }, [comments, post]);

  return (
    <View
      key={index}
      style={{
        marginTop: 20,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 10,
        elevation: elevation ? 0 : 3,
        // marginHorizontal: 5,
      }}>
      {/* Post Content */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Image
          source={{
            uri: senderDetails?.Images
              ? senderDetails?.Images?.profile
              : user?.Images?.profile,
          }}
          style={{width: 50, height: 50, borderRadius: 50}}
        />
        <View style={{flex: 1, paddingHorizontal: 15}}>
          <Text style={styles.userName}>
            {senderDetails
              ? senderDetails?.firstName + ' ' + senderDetails?.LastName
              : user?.firstName + ' ' + user?.LastName}
          </Text>
          <Text style={styles.instituteText}>
            {senderDetails ? senderDetails?.InstitudeName : user?.InstitudeName}
          </Text>
        </View>
        {admin && (
          <TouchableOpacity onPress={handleDelDisp}>
            <Image
              source={{uri: 'https://i.ibb.co/nn25gZN/menu.png'}}
              style={{width: 20, height: 20, tintColor: Colors.lightGrey}}
            />
          </TouchableOpacity>
        )}
        {/* display wrapper */}

        {deldisplay && (
          <TouchableOpacity
            onPress={() => HandleDelete(post._id)}
            style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.postText}>
        {expanded
          ? initialText
          : `${initialText?.split(' ').slice(0, wordThreshold).join(' ')}...`}
      </Text>
      {countWords(initialText) > wordThreshold && (
        <TouchableOpacity onPress={toggleExpanded} style={styles.showMore}>
          <Text style={{color: '#595959'}}>
            {expanded ? 'Show less' : 'Show more'}
          </Text>
        </TouchableOpacity>
      )}
      <Text style={{color: Colors.violet}}>{post?.PostLink}</Text>

      {post?.Images && (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={post?.Images}
          horizontal
          renderItem={({item, index}) => (
            <Image
              key={index}
              source={{uri: item}}
              style={{
                width: post?.Images.length === 1 ? width * 0.84 : width * 0.8,
                height: height * 0.3,
                resizeMode: 'contain',
              }}
            />
          )}
        />
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 5,
        }}>
        <TouchableOpacity
          onPress={handleLikeToggle}
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 5}}>
          <Text style={{fontFamily: font.poppins, fontSize: width * 0.048}}>
            {likeCount}
          </Text>
          <FontAwesomeIcon
            size={18}
            icon={faHeart}
            color={liked ? 'red' : Colors.mildGrey}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShowComments} // Open modal to display comments
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 5}}>
          <Text style={{fontFamily: font.poppins, fontSize: width * 0.048}}>
            {comments.length}
          </Text>
          <FontAwesomeIcon
            icon={faComments}
            size={22}
            color={Colors.mildGrey}
          />
        </TouchableOpacity>
        <RelativeTime time={post?.Time} fsize={width * 0.033} />
      </View>

      {/* Add New Comment */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 5,
          borderBottomWidth: 1,
          borderColor: Colors.veryLightGrey,
        }}>
        <TextInput
          value={newComment}
          onChangeText={text => {
            setNewComment(text);
          }}
          placeholder="Add a comment..."
          style={styles.commentInput}
        />
        <TouchableOpacity
          onPress={handleSubmitComment}
          style={styles.commentBtn}>
          <FontAwesome name="send-o" size={17} color={Colors.mildGrey} />
        </TouchableOpacity>
      </View>

      {/* Show Liked Users Button */}
      <TouchableOpacity onPress={handleShowLikedUsers} style={styles.likeBtn}>
        <Text>Show Likes</Text>
      </TouchableOpacity>

      {/* Modal for displaying liked users or comments */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View
            style={{
              flexDirection: 'row',
              // borderWidth: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'left',
                fontSize: width * 0.04,
                letterSpacing: 1,
                textTransform: 'capitalize',
              }}>
              {modalContentType}
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <FontAwesomeIcon icon={faTimes} color={Colors.mildGrey} />
            </TouchableOpacity>
          </View>
          {modalContentType === 'likes' ? (
            likedUsers?.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={likedUsers}
                keyExtractor={item => item?._id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{
                      // borderWidth: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 10,
                      borderBottomWidth: 1,
                      borderColor: Colors.veryLightGrey,
                      paddingVertical: 10,
                      marginTop: 10,
                    }}
                    onPress={() => {
                      navigation.navigate('userprofile');
                      setSelectedUser(item?.userId);
                    }}>
                    {item?.LikedUser}
                    <Image
                      source={{uri: item?.profile}}
                      style={{
                        width: width * 0.1,
                        height: height * 0.05,
                        borderRadius: 50,
                      }}
                    />
                    <Text
                      style={{
                        color: Colors.veryDarkGrey,
                        letterSpacing: 1,
                        flex: 1,
                      }}>
                      {item?.firstName}
                      {item?.LastName}
                    </Text>

                    <RelativeTime time={item?.LikedTime} />
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text>No Likes</Text>
            )
          ) : comments?.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={comments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    // borderWidth: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: 10,
                    borderBottomWidth: 1,
                    borderColor: Colors.veryLightGrey,
                    paddingVertical: 10,
                    marginTop: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('userprofile');
                    setSelectedUser(item?.commentedBy?.userId);
                  }}>
                  {item?.LikedUser}
                  <Image
                    source={{uri: item?.commentedBy?.profile}}
                    style={{
                      width: width * 0.1,
                      height: height * 0.05,
                      borderRadius: 50,
                    }}
                  />
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        color: Colors.veryDarkGrey,
                        letterSpacing: 1,
                        fontSize: width * 0.033,
                      }}>
                      {item?.commentedBy?.firstName} {'  '}
                      {item?.commentedBy?.LastName}
                    </Text>
                    <Text
                      style={{fontSize: width * 0.03, color: Colors.mildGrey}}>
                      {item?.commentText}
                    </Text>
                  </View>

                  <RelativeTime time={item?.commentedAt} />
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text>No Comments</Text>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default Posts;

const styles = StyleSheet.create({
  userName: {
    fontFamily: font.poppinsBold,
    fontSize: 16,
  },
  instituteText: {
    color: Colors.mildGrey,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    right: 0,
    top: height * 0.03,
    zIndex: 20,
  },
  deleteText: {
    color: 'white',
  },
  postText: {
    marginVertical: 10,
  },
  showMore: {
    marginVertical: 10,
  },
  likeBtn: {
    marginVertical: 10,
  },
  modalBackground: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '60%',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderBottomWidth: 0,
    borderColor: Colors.veryLightGrey,
  },
});
