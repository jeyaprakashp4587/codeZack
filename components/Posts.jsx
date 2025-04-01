import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Pressable,
  ToastAndroid,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {Colors, font} from '../constants/Colors';
import {Dimensions} from 'react-native';
import axios from 'axios';
import {useData} from '../Context/Contexter';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import RelativeTime from './RelativeTime';
import {profileApi} from '../Api';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import useSocketEmit from '../Socket/useSocketEmit';
import RBSheet from 'react-native-raw-bottom-sheet';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FastImage from 'react-native-fast-image';
import MiniUserSkeleton from '../Skeletons/MiniUserSkeleton';
import AntDesign from 'react-native-vector-icons/AntDesign';
const {width, height} = Dimensions.get('window');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SocketData} from '../Socket/SocketContext';
import Skeleton from '../Skeletons/Skeleton';
import {Font} from '../constants/Font';

const Posts = ({post, index, admin, senderDetails}) => {
  const initialText = post?.PostText;
  const {user, setUser, setSelectedUser} = useData();
  const navigation = useNavigation();
  const socket = SocketData();
  const emitEvent = useSocketEmit(socket);
  const PostRBSheetRef = useRef();
  const wordThreshold = 10;
  const [expanded, setExpanded] = useState(false);
  const [likeCount, setLikeCount] = useState();
  const [LoadDelete, setLoadDelete] = useState(false);
  const [commentShowModel, setCommandModelShow] = useState(false);
  const [selectedComment, setSelectedComment] = useState();
  // console.log(post);
  useEffect(() => {
    if (post?.Like !== undefined && post?.Like !== null) {
      setLikeCount(post?.Like);
    }
  }, [post?.Like]);
  const [comments, setComments] = useState(post?.Comments || []);
  const [commentsLength, setCommentsLength] = useState(post?.CommentCount);
  useEffect(() => {
    setCommentsLength(post?.CommentCount);
  }, [post?.CommentCount]);
  // List of comments
  const [newComment, setNewComment] = useState(''); // Track new comment
  const [liked, setLiked] = useState(
    post?.LikedUsers?.some(likeuser => likeuser?.LikedUser === user?._id),
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContentType, setModalContentType] = useState(''); // Either 'likes' or 'comments'

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  const countWords = text => text?.trim().split(/\s+/).length;
  const HandleDelete = useCallback(
    async postId => {
      setLoadDelete(true);
      try {
        const res = await axios.post(
          `${profileApi}/Post/deletePost/${user?._id}`,
          {
            postId,
          },
        );
        if (res.status === 200) {
          setLoadDelete(false);
          PostRBSheetRef.current.close();
          setUser(prev => ({
            ...prev,
            Posts: res.data.Posts,
            PostLength: res.data.userPostLength,
          }));
          ToastAndroid.show('Post deleted sucessfully', ToastAndroid.SHORT);
        }
      } catch (err) {
        setLoadDelete(false);
        // console.log(err);
        ToastAndroid.show('Error while post delete', ToastAndroid.SHORT);
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
        const response = await axios.post(
          `${profileApi}/Post/likePost/${postId}`,
          {
            userId: user?._id,
            LikedTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
          },
        );
        if (response.status === 200) {
          setLikeCount(prev => prev + 1);
          emitEvent('LikeNotiToUploader', {
            Time: moment().format('YYYY-MM-DDTHH:mm:ss'),
            postId: post?._id,
            senderId: senderDetails?._id,
          });
        }
      } catch (error) {
        setLiked(false);
        ToastAndroid.show('Error on like', ToastAndroid.SHORT);
      }
    },
    [user],
  );

  const handleUnlike = useCallback(
    async postId => {
      setLiked(false);
      try {
        const res = await axios.post(
          `${profileApi}/Post/unlikePost/${postId}`,
          {
            userId: user._id,
          },
        );
        if (res.status === 200) {
          setLikeCount(prev => prev - 1);
        }
      } catch (error) {
        setLiked(true);
        ToastAndroid.show('Error on unlike post', ToastAndroid.SHORT);
      }
    },
    [user],
  );

  const handleSubmitComment = useCallback(async () => {
    if (newComment.trim() === '') return;
    try {
      const res = await axios.post(
        `${profileApi}/Post/commentPost/${post._id}`,
        {
          userId: user._id,
          commentText: newComment,
          commentTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
        },
      );
      if (res.status === 200) {
        setComments([...comments, res.data.comment]);
        setCommentsLength(prev => prev + 1);
        setNewComment('');
        emitEvent('CommentNotiToUploader', {
          postId: post?._id,
          senderId: senderDetails?._id,
        });
      }
    } catch (error) {
      ToastAndroid.show('Error on Comment', ToastAndroid.SHORT);
    }
  }, [newComment, comments, user]);
  // handle delete commands ------------
  const deleteCommend = useCallback(async commentID => {
    try {
      if (!commentID) {
        console.log(commentID);
        return;
      }
      const {status} = await axios.post(`${profileApi}/Post/deleteComment`, {
        postId: post?._id,
        commentedId: commentID,
      });
      if (status == 200) {
        console.log('sucess');
        setCommentsLength(prev => prev - 1);
        setCommandModelShow(false);
        // if server was send success status then filter and remove the comment id from previos comments
        const filterdComments = comments?.filter(
          comments => commentID != comments._id,
        );
        if (filterdComments) {
          setComments(filterdComments);
          ToastAndroid.show('Comment deleted', ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.log(error);
      setCommandModelShow(false);
      ToastAndroid.show('delete comment failed', ToastAndroid.SHORT);
    }
  }, []);
  // get liked user using pagination
  const [likedUsers, setLikedUsers] = useState([]);
  const [likedUserSkip, setLikedUserSkip] = useState(0);
  const [likedUserHasMore, setLikedUserHasMore] = useState(true);
  const [likedUserLoading, setLikedUserLoading] = useState(false);
  const handleShowLikedUsers = useCallback(async () => {
    setModalContentType('likes');
    setIsModalVisible(true);
    if (likedUserLoading || !likedUserHasMore) return;
    setLikedUserLoading(true);
    try {
      const res = await axios.get(
        `${profileApi}/Post/getLikedUsers/${post._id}`,
        {
          params: {skip: likedUserSkip, limit: 10},
        },
      );

      if (res.status === 200) {
        setLikedUsers(res.data.likedUsers);
        setLikedUserSkip(prevSkip => prevSkip + 10);
        setLikedUserHasMore(res.data.hasMore);
      }
    } catch (err) {
      console.error('Failed to fetch liked users:', err);
      ToastAndroid.show('Failed to fetch liked users', ToastAndroid.SHORT);
    } finally {
      setLikedUserLoading(false);
    }
  }, []);
  // get all comments
  const [commentSkip, setCommentSkip] = useState(0);
  const [commentHasMore, setCommentHasMore] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const handleShowComments = useCallback(async () => {
    setModalContentType('comments');
    setIsModalVisible(true);
    if (commentLoading || !commentHasMore) return;
    setCommentLoading(true);
    try {
      // console.log('Fetching comments...');
      const res = await axios.get(
        `${profileApi}/Post/getComments/${post?._id}`,
        {
          params: {skip: commentSkip, limit: 10},
        },
      );
      if (res.status === 200) {
        setComments(res.data.comments);
        setCommentSkip(prevSkip => prevSkip + 10);
        setCommentHasMore(res.data.hasMore);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      ToastAndroid.show('Failed to fetch comments', ToastAndroid.SHORT);
    } finally {
      setCommentLoading(false);
    }
  }, [commentSkip, commentHasMore, commentLoading]);

  //
  // console.log(post?.Images);

  const [showImageModel, setShowImageModel] = useState(false);
  // fetch connections lists
  const [netWorksList, setNetworksList] = useState([]);
  const [netWorkListPage, setNetWorkListPage] = useState(0);
  const [networkListLoadding, setNetworkListLoading] = useState(false);
  const [hasMoreNetworks, setHasMoreNetworks] = useState(true);
  const getNetworksList = useCallback(async () => {
    if (networkListLoadding || !hasMoreNetworks) return; // Prevent duplicate requests
    setNetworkListLoading(true);
    try {
      console.log('fetch networks');
      const res = await axios.get(
        `${profileApi}/Following/getNetworks/${user?._id}`,
        {
          params: {
            skip: netWorkListPage * 10,
            limit: 10,
          },
        },
      );
      if (res.status === 200) {
        setNetworksList(prev => [...prev, ...res.data.users]);
        setNetWorkListPage(prev => prev + 1);
        setHasMoreNetworks(res.data.hasMore);
      }
    } catch (error) {
      console.error('Error fetching networks list:', error);
    } finally {
      setNetworkListLoading(false);
    }
  }, [netWorkListPage, networkListLoadding, hasMoreNetworks]);

  // handle share post to connections
  const handleSharePost = useCallback(async (receiverId, postId) => {
    try {
      emitEvent(
        'SharePostToConnection',
        {receivingUserId: receiverId, postId},
        response => {
          if (response.success) {
            ToastAndroid.show('post shared sucessfully', ToastAndroid.SHORT);
            PostRBSheetRef.current.close();
          } else {
            ToastAndroid.show(
              'Something is wrong, try again',
              ToastAndroid.SHORT,
            );
            PostRBSheetRef.current.close();
          }
        },
      );
    } catch (error) {
      ToastAndroid.show('Something is error,try again', ToastAndroid.SHORT);
    }
  }, []);
  // ui render
  return (
    <View
      key={index}
      style={{
        marginTop: 20,
        borderRadius: 0,
        backgroundColor: 'white',
        marginBottom: 10,
        // borderWidth: 0.4,
        borderColor: Colors.veryLightGrey,
        borderWidth: 1,
      }}>
      {/* Post Content user details and menu*/}
      <Pressable
        onPress={() => {
          if (!admin) {
            setSelectedUser(senderDetails?._id || senderDetails?.id);
            navigation.navigate('userprofile');
          }
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 15,
        }}>
        <FastImage
          source={{
            uri: senderDetails?.Images
              ? senderDetails?.Images?.profile
              : user?.Images?.profile,
          }}
          style={{width: 50, height: 50, borderRadius: 50}}
          priority={FastImage.priority.high}
        />
        <View style={{flex: 1, paddingHorizontal: 15}}>
          <Text style={styles.userName} numberOfLines={1}>
            {senderDetails
              ? senderDetails?.firstName + ' ' + senderDetails?.LastName
              : user?.firstName + ' ' + user?.LastName}
          </Text>
          <Text style={styles.instituteText} numberOfLines={1}>
            {senderDetails ? senderDetails?.InstitudeName : user?.InstitudeName}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            PostRBSheetRef.current.open();
            getNetworksList();
          }}>
          <Image
            source={{uri: 'https://i.ibb.co/nn25gZN/menu.png'}}
            style={{width: 20, height: 20, tintColor: Colors.mildGrey}}
          />
        </TouchableOpacity>

        {/* display wrapper */}
        {/* */}
      </Pressable>
      <View style={{paddingHorizontal: 15}}>
        <Text style={styles.postText}>
          {expanded
            ? initialText
            : `${initialText?.split(' ').slice(0, wordThreshold).join(' ')}...`}
        </Text>
        {countWords(initialText) > wordThreshold && (
          <TouchableOpacity onPress={toggleExpanded} style={styles.showMore}>
            <Text style={{color: '#595959', fontFamily: Font.Medium}}>
              {expanded ? 'Show less' : 'Show more'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{paddingHorizontal: 15}}>
        {post?.PostLink && (
          <Text
            onPress={() => {
              if (post?.PostLink) {
                Linking.openURL(post.PostLink);
              }
            }}
            style={{color: Colors.violet, fontWeight: '700'}}>
            {post?.PostLink}
          </Text>
        )}
      </View>
      {/* post images */}
      {post?.Images && (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={post?.Images}
          horizontal
          style={{marginTop: 10}}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={() => setShowImageModel(true)}>
              <FastImage
                key={index}
                source={{uri: item}}
                priority={FastImage.priority.high}
                resizeMode="cover"
                style={{
                  width: post?.Images.length === 1 ? width * 1 : width * 0.7,
                  aspectRatio: 1,
                  marginRight: post?.Images.length > 1 && 8,
                }}
              />
              <Text
                style={{
                  position: 'absolute',
                  bottom: height * 0.02,
                  textAlign: 'center',
                  alignSelf: 'center',
                  color: 'white',
                  fontSize: width * 0.03,
                  borderWidth: 0.7,
                  borderRadius: 50,
                  borderColor: 'white',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  letterSpacing: 1,
                  fontFamily: 'Poppins-Medium',
                }}>
                Expand view
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
      {/* like comments section */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 15,
          paddingHorizontal: 15,
        }}>
        {/* like Icon  */}
        <TouchableOpacity
          onPress={handleLikeToggle}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between', // Ensures consistent spacing
            width: width * 0.1, // Fixed width for the container
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', columnGap: 2}}>
            <Text
              style={{
                // fontFamily: font.poppins,
                fontSize: width * 0.048,
                minWidth: 10, // Ensure fixed width for the number
                textAlign: 'center', // Align text properly
                fontFamily: Font.Regular,
              }}>
              {likeCount}
            </Text>
            <EvilIcons
              name="like"
              size={width * 0.08}
              color={liked ? 'red' : Colors.veryDarkGrey}
            />
          </View>
        </TouchableOpacity>
        {/* comment icon */}
        <TouchableOpacity
          onPress={handleShowComments} // Open modal to display comments
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 2,
            // borderWidth: 1,
            width: width * 0.2,
          }}>
          <Text style={{fontFamily: Font.Regular, fontSize: width * 0.048}}>
            {/* {commentsLength} */}
            {commentsLength}
          </Text>
          <EvilIcons name="comment" size={width * 0.07} />
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
          alignItems: 'center',
          // paddingHorizontal: 15,
          marginHorizontal: 15,
        }}>
        <TextInput
          placeholderTextColor={Colors.lightGrey}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          style={{borderWidth: 0, flex: 1, fontFamily: Font.Regular}}
        />
        <TouchableOpacity
          onPress={handleSubmitComment}
          style={styles.commentBtn}>
          <FontAwesome name="send-o" size={20} color={Colors.mildGrey} />
        </TouchableOpacity>
      </View>
      {/* Show Liked Users Button */}
      <TouchableOpacity onPress={handleShowLikedUsers} style={styles.likeBtn}>
        <Text
          style={{
            letterSpacing: 1,
            fontSize: width * 0.03,
            fontFamily: Font.Medium,
          }}>
          Show likes
        </Text>
      </TouchableOpacity>
      {/* Modal for displaying liked users or comments */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.42)'}}>
          <View style={styles.modalBackground}>
            <View
              style={{
                // borderWidth: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                rowGap: 10,
                // borderBottomWidth: 1,
                borderColor: Colors.veryLightGrey,
                marginBottom: 10,
              }}>
              {/* bar */}
              <View
                style={{
                  width: 50,
                  height: 3,
                  backgroundColor: Colors.lightGrey,
                  borderRadius: 50,
                }}
              />
              <Text
                style={{
                  fontSize: width * 0.04,
                  marginBottom: height * 0.01,
                  letterSpacing: 2,
                  textAlign: 'center',
                  fontFamily: Font.Regular,
                }}>
                {modalContentType}
              </Text>
            </View>
            {/* show likes and comments */}
            {modalContentType === 'likes' ? (
              likedUsers?.length > 0 ? (
                <FlatList
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  data={likedUsers}
                  keyExtractor={item => item?.userId}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={{
                        // borderWidth: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        columnGap: 10,
                        // borderTopWidth: 1,
                        borderColor: Colors.veryLightGrey,
                        paddingVertical: 10,
                        // marginTop: 10,
                      }}
                      onPress={() => {
                        navigation.navigate('userprofile');
                        setSelectedUser(item?.userId);
                      }}>
                      {item?.LikedUser}
                      <FastImage
                        source={{uri: item?.profile}}
                        priority={FastImage.priority.high}
                        style={{
                          width: width * 0.13,
                          // height: height * 0.05,
                          aspectRatio: 1,
                          borderRadius: 50,
                          borderWidth: 0.5,
                          borderColor: Colors.veryLightGrey,
                        }}
                      />
                      <Text
                        style={{
                          color: Colors.veryDarkGrey,
                          letterSpacing: 0.3,
                          flex: 1,
                          fontSize: width * 0.035,
                          fontFamily: Font.Medium,
                        }}
                        numberOfLines={1}>
                        {item?.firstName} {item?.LastName}
                      </Text>
                      <RelativeTime time={item?.LikedTime} />
                    </TouchableOpacity>
                  )}
                  ListFooterComponent={
                    <View style={{padding: 20}}>
                      {likedUserLoading &&
                        Array.from({length: 5}).map((_, index) => (
                          <View style={{marginBottom: 10}}>
                            <MiniUserSkeleton />
                          </View>
                        ))}

                      {likedUserHasMore && !likedUserLoading && (
                        <View style={{padding: 20}}>
                          <TouchableOpacity
                            onPress={handleShowLikedUsers}
                            style={{
                              padding: 10,
                              borderWidth: 0.5,
                              borderRadius: 50,
                              borderColor: Colors.violet,
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                letterSpacing: 1.4,
                                color: Colors.violet,
                                // fontWeight: '600',
                                fontSize: width * 0.03,
                                fontFamily: Font.Medium,
                              }}>
                              Show more
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  }
                />
              ) : (
                <Text style={{fontFamily: Font.Medium}}>No Likes</Text>
              )
            ) : comments?.length > 0 ? (
              <FlatList
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                data={comments}
                keyExtractor={(item, index) =>
                  item?.commentedBy?.userId ?? index.toString()
                }
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 10,
                      borderColor: Colors.veryLightGrey,
                      paddingVertical: 10,
                    }}
                    onLongPress={() => {
                      setCommandModelShow(true);
                      setSelectedComment(item);
                    }}
                    onPress={() => {
                      navigation.navigate('userprofile');
                      setSelectedUser(item?.userId);
                    }}>
                    <FastImage
                      source={{
                        uri: item?.profile,
                      }}
                      priority={FastImage.priority.high}
                      style={{
                        width: width * 0.13,
                        borderRadius: 50,
                        borderWidth: 0.5,
                        borderColor: Colors.veryLightGrey,
                        aspectRatio: 1,
                      }}
                    />
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          color: Colors.veryDarkGrey,
                          letterSpacing: 0.5,
                          fontSize: width * 0.04,
                          fontFamily: Font.Medium,
                        }}
                        numberOfLines={1}>
                        {item?.firstName} {item?.LastName}
                      </Text>
                      <Text
                        style={{
                          fontSize: width * 0.035,
                          color: Colors.mildGrey,
                          fontFamily: Font.Regular,
                        }}>
                        {item?.commentText}
                      </Text>
                    </View>
                    <RelativeTime time={item?.commentedAt} />
                  </TouchableOpacity>
                )}
                ListFooterComponent={
                  <View>
                    {commentHasMore && !commentLoading && (
                      <View style={{padding: 10}}>
                        <TouchableOpacity
                          onPress={handleShowComments}
                          style={{
                            padding: 10,
                            borderWidth: 0.5,
                            borderRadius: 50,
                            borderColor: Colors.violet,
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              letterSpacing: 1.4,
                              color: Colors.violet,
                              fontSize: width * 0.03,
                              fontFamily: Font.Regular,
                            }}>
                            Show more
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {commentLoading &&
                      Array.from({length: 5}).map((_, index) => (
                        <View style={{marginBottom: 10}}>
                          <MiniUserSkeleton />
                        </View>
                      ))}
                  </View>
                }
              />
            ) : (
              <Text style={{fontFamily: Font.Regular}}>No Comments</Text>
            )}
          </View>
        </View>
      </Modal>
      {/* model for show images */}
      <Modal
        visible={showImageModel}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowImageModel(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          {/* Close Icon */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              zIndex: 1,
            }}
            onPress={() => setShowImageModel(false)}>
            <FontAwesomeIcon icon={faTimes} size={30} color="white" />
          </TouchableOpacity>

          {/* Image List */}
          <FlatList
            nestedScrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            data={post?.Images}
            horizontal
            pagingEnabled
            renderItem={({item}) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // padding: 20,
                  borderWidth: 0,
                  // borderColor: 'white',
                }}>
                <FastImage
                  priority={FastImage.priority.high}
                  source={{uri: item}}
                  resizeMode="contain"
                  style={{
                    width: width * 1,
                    borderRadius: 10,
                    aspectRatio: 1,
                    marginRight: post?.Images?.length > 1 ? 5 : 0,
                  }}
                />
                {post?.Images?.length > 1 && (
                  <Text style={{fontFamily: Font.Medium}}>
                    Scroll to view more images
                  </Text>
                )}
              </View>
            )}
          />
        </View>
      </Modal>
      {/* model for show comments details */}
      <Modal
        transparent={true}
        visible={commentShowModel}
        onRequestClose={() => setCommandModelShow(false)}
        animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              padding: 25,
              alignItems: 'center',
              width: '80%',
              justifyContent: 'space-between',
              columnGap: 10,
            }}>
            <FastImage
              source={{
                uri: selectedComment?.profile,
              }}
              priority={FastImage.priority.high}
              style={{
                width: width * 0.13,
                borderRadius: 50,
                borderWidth: 0.5,
                borderColor: Colors.veryLightGrey,
                aspectRatio: 1,
              }}
            />
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: Colors.veryDarkGrey,
                  letterSpacing: 0.5,
                  fontSize: width * 0.04,
                  fontFamily: Font.Medium,
                }}
                numberOfLines={1}>
                {selectedComment?.firstName} {selectedComment?.LastName}
              </Text>
              <Text
                style={{
                  fontSize: width * 0.035,
                  color: Colors.mildGrey,
                  fontFamily: Font.Regular,
                }}>
                {selectedComment?.commentText}
              </Text>
            </View>
            {selectedComment?.userId && user?._id && (
              <TouchableOpacity
                onPress={() => deleteCommend(selectedComment?._id)}>
                <AntDesign size={20} name="delete" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
      {/* Rb sheet for show options for posts */}
      <RBSheet
        ref={PostRBSheetRef}
        // height={250} // Specify the desired height in pixels
        useNativeDriver={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20, // Optional for rounded corners
            borderTopRightRadius: 20,
            height: height * 0.45, // Alternatively, you can set the height here
          },
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
          },
          draggableIcon: {
            backgroundColor: '#cccccc',
          },
        }}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}>
        {/* model header */}
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            rowGap: 10,
            borderBottomWidth: 1,
            borderColor: Colors.veryLightGrey,
            marginBottom: 10,
          }}>
          {/* bar */}
          <View
            style={{
              width: width * 0.15,
              height: 5,
              backgroundColor: Colors.lightGrey,
              borderRadius: 50,
              marginVertical: 20,
            }}
          />
        </View>
        {/* options content */}
        <View
          style={{
            padding: 20,
            flexDirection: 'column',
            // justifyContent: 'space-between',
            flex: 1,
            borderWidth: 0,
          }}>
          {admin && (
            <TouchableOpacity
              onPress={() => HandleDelete(post._id)}
              style={{
                // borderWidth: 1,
                borderColor: Colors.veryLightGrey,
                padding: width * 0.04,
                borderRadius: 50,
                width: '100%',
                backgroundColor: Colors.veryLightGrey,
              }}>
              {LoadDelete ? (
                <ActivityIndicator color={Colors.veryDarkGrey} size={20} />
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    letterSpacing: 1,
                    fontSize: width * 0.035,
                    fontFamily: Font.Regular,
                  }}>
                  Delete
                </Text>
              )}
            </TouchableOpacity>
          )}
          <Text
            style={{
              borderColor: Colors.veryLightGrey,
              // borderBottomWidth: 1,
              paddingVertical: width * 0.04,
              fontSize: width * 0.035,
              letterSpacing: 0.8,
              textAlign: 'center',
              // fontWeight: '600',
              fontFamily: Font.Medium,
            }}>
            Share to{' '}
          </Text>
          <View
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              // borderWidth: 1,
              flexDirection: 'row',
              columnGap: 10,
            }}>
            {netWorksList.length <= 0 && (
              <Text
                style={{
                  fontSize: width * 0.03,
                  textAlign: 'center',
                  // borderWidth: 1,
                  width: '100%',
                  letterSpacing: 0.5,
                  fontFamily: Font.Medium,
                }}>
                You Have No Connections To Share Posts
              </Text>
            )}
            <FlatList
              horizontal
              style={{borderWidth: 0}}
              data={netWorksList}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{borderWidth: 1, alignItems: 'center'}}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    handleSharePost(item?.id, post?._id);
                  }}
                  style={{
                    borderWidth: 0,
                    marginRight: 10,
                    position: 'relative',
                  }}>
                  <FastImage
                    priority={FastImage.priority.high}
                    source={{
                      uri: item?.profileImg
                        ? item?.profileImg
                        : 'https://i.ibb.co/3T4mNMm/man.png',
                    }}
                    style={{
                      width: width * 0.18,
                      aspectRatio: 1,
                      borderRadius: 50,
                      borderColor: Colors.veryLightGrey,
                      borderWidth: 3,
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      top: hp('6.5%'),
                      zIndex: 10,
                      left: wp('12%'),
                      padding: width * 0.017,
                      backgroundColor: item?.onlineStatus ? 'green' : 'red',
                      borderRadius: 50,
                      borderWidth: 3,
                      borderColor: 'white',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: width * 0.028,
                      textAlign: 'center',
                      // fontWeight: '600',
                      fontFamily: Font.Regular,
                    }}
                    numberOfLines={1}>
                    {item?.firstName}
                  </Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={
                <View>
                  {hasMoreNetworks && !networkListLoadding && (
                    <TouchableOpacity
                      onPress={getNetworksList}
                      style={{
                        padding: 10,
                        borderWidth: 0.5,
                        borderRadius: 50,
                        borderColor: Colors.violet,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          letterSpacing: 1.4,
                          color: Colors.violet,
                          // fontWeight: '600',
                          fontSize: width * 0.03,
                          fontFamily: Font.SemiBold,
                        }}>
                        Show more
                      </Text>
                    </TouchableOpacity>
                  )}
                  {networkListLoadding && (
                    <View style={{flexDirection: 'row', columnGap: 5}}>
                      {Array.from({length: 4}).map((_, index) => (
                        <Skeleton
                          key={index}
                          width={width * 0.17}
                          height={height * 0.09}
                          radius={60}
                        />
                      ))}
                    </View>
                  )}
                </View>
              }
            />
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

export default React.memo(Posts);

const styles = StyleSheet.create({
  userName: {
    fontSize: width * 0.037,
    fontFamily: Font.Regular,
  },
  instituteText: {
    color: Colors.mildGrey,
    fontSize: width * 0.034,
    fontFamily: Font.Regular,
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
    fontFamily: Font.Regular,
  },
  postText: {
    marginVertical: 5,
    color: Colors.veryDarkGrey,
    letterSpacing: 1,
    lineHeight: 20,
    fontSize: width * 0.035,
    fontFamily: Font.Regular,
  },
  showMore: {
    marginVertical: 5,
    fontSize: width * 0.03,
  },
  likeBtn: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  modalBackground: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '60%',
    borderWidth: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    borderBottomWidth: 0,
    borderColor: Colors.veryLightGrey,
  },
});
