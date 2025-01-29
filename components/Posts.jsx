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
} from 'react-native';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {Colors, font} from '../constants/Colors';
import {faComments, faHeart} from '@fortawesome/free-regular-svg-icons';
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
import {SocketData} from '../Socket/SocketContext';
import RBSheet from 'react-native-raw-bottom-sheet';

const {width, height} = Dimensions.get('window');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Posts = ({post, index, admin, senderDetails, elevation}) => {
  const initialText = post?.PostText;
  const {user, setUser, setSelectedUser} = useData();
  const navigation = useNavigation();
  const socket = SocketData();
  const emitEvent = useSocketEmit(socket);
  const PostRBSheetRef = useRef();
  const wordThreshold = 10;
  const [expanded, setExpanded] = useState(false);
  const [postOptions, setPostOptions] = useState(false);
  const [likeCount, setLikeCount] = useState();
  const [selectedShareUser, setSelectedShareUser] = useState();
  useEffect(() => {
    if (post?.Like !== undefined && post?.Like !== null) {
      setLikeCount(post?.Like);
    }
  }, [post?.Like]);
  const [comments, setComments] = useState(post?.Comments || []); // List of comments
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
      try {
        const res = await axios.post(
          `${profileApi}/Post/deletePost/${user?._id}`,
          {
            postId,
          },
        );
        if (res.status == 200) {
          setUser(prev => ({...prev, Posts: res.data.Posts}));
          ToastAndroid.show('Post deleted sucessfully', ToastAndroid.SHORT);
        }
      } catch (err) {
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
        // console.log(res.data.comment);
        setComments([...comments, res.data.comment]);
        setNewComment('');
        emitEvent('CommentNotiToUploader', {
          Time: moment().format('YYYY-MM-DDTHH:mm:ss'),
          postId: post?._id,
          senderId: senderDetails?._id,
        });
      }
    } catch (error) {
      // console.error("Error submitting comment:", error);
    }
  }, [newComment, comments, user]);
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
        setLikedUsers(prevUsers => [...prevUsers, ...res.data.likedUsers]);
        setLikedUserSkip(prevSkip => prevSkip + 10);
        setLikedUserHasMore(res.data.hasMore);
      }
    } catch (err) {
      console.error('Failed to fetch liked users:', err);
    } finally {
      setLikedUserLoading(false);
    }
  }, [likedUserSkip, likedUserHasMore, likedUserLoading]);
  // get all commants
  const [commentSkip, setCommentSkip] = useState(0);
  const [commentHasMore, setCommentHasMore] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const handleShowComments = useCallback(async () => {
    setModalContentType('comments');
    setIsModalVisible(true);
    if (commentLoading || !commentHasMore) return;
    setCommentLoading(true);
    try {
      const res = await axios.get(
        `${profileApi}/Post/getComments/${post?._id}`,
        {
          params: {skip: commentSkip, limit: 10},
        },
      );
      if (res.status === 200) {
        setComments(prevComments => [...prevComments, ...res.data.comments]);
        setCommentSkip(prevSkip => prevSkip + 10);
        setCommentHasMore(res.data.hasMore);
        setCommentLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setCommentLoading(false);
    }
  }, [post, commentSkip, commentHasMore, commentLoading]);
  //
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
  }, [netWorkListPage, networkListLoadding]);

  // handle share post to connections
  const handleSharePost = useCallback(async (receiverId, postId) => {
    try {
      // console.log(receiverId, postId);
      emitEvent(
        'SharePostToConnection',
        {receivingUserId: receiverId, postId},
        response => {
          if (response.success) {
            ToastAndroid.show('post send sucessfully', ToastAndroid.SHORT);
          } else {
            ToastAndroid.show(
              'Something is error,try again',
              ToastAndroid.SHORT,
            );
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
        padding: 20,
        borderRadius: 0,
        backgroundColor: 'white',
        marginBottom: 10,
        // elevation: elevation ? 0 : 3,
        borderWidth: 0.4,
        borderColor: Colors.veryLightGrey,
        // marginHorizontal: 5,
      }}>
      {/* Post Content */}
      <Pressable
        onPress={() => {
          if (!admin) {
            setSelectedUser(senderDetails?._id || senderDetails?.id);
            navigation.navigate('userprofile');
          }
        }}
        style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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

        <TouchableOpacity
          onPress={() => {
            PostRBSheetRef.current.open();
            getNetworksList();
          }}>
          <Image
            source={{uri: 'https://i.ibb.co/nn25gZN/menu.png'}}
            style={{width: 20, height: 20, tintColor: Colors.lightGrey}}
          />
        </TouchableOpacity>

        {/* display wrapper */}
        {/* */}
      </Pressable>
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
      {/* post images */}
      {post?.Images && (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={post?.Images}
          horizontal
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={() => setShowImageModel(true)}>
              <Image
                key={index}
                source={{uri: item}}
                style={{
                  width: post?.Images.length === 1 ? width * 0.84 : width * 0.8,
                  height: height * 0.3,
                  resizeMode: 'contain',
                }}
              />
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
            style={{flexDirection: 'row', alignItems: 'center', columnGap: 5}}>
            <Text
              style={{
                fontFamily: font.poppins,
                fontSize: width * 0.048,
                minWidth: 10, // Ensure fixed width for the number
                textAlign: 'center', // Align text properly
              }}>
              {likeCount}
            </Text>
            <FontAwesomeIcon
              size={18}
              icon={faHeart}
              color={liked ? 'red' : Colors.mildGrey}
            />
          </View>
        </TouchableOpacity>
        {/* comment icon */}
        <TouchableOpacity
          onPress={handleShowComments} // Open modal to display comments
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 5,
            // borderWidth: 1,
            width: width * 0.2,
          }}>
          <Text style={{fontFamily: font.poppins, fontSize: width * 0.048}}>
            {comments.length}
          </Text>
          <FontAwesomeIcon
            icon={faComments}
            size={22}
            color={Colors.mildGrey}
          />
        </TouchableOpacity>

        <View style={{borderWidth: 0}}>
          <RelativeTime time={post?.Time} fsize={width * 0.033} />
        </View>
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
        }}>
        <TextInput
          placeholderTextColor={Colors.lightGrey}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          style={{borderWidth: 0, flex: 1}}
        />
        <TouchableOpacity
          onPress={handleSubmitComment}
          style={styles.commentBtn}>
          <FontAwesome name="send-o" size={20} color={Colors.mildGrey} />
        </TouchableOpacity>
      </View>

      {/* Show Liked Users Button */}
      <TouchableOpacity onPress={handleShowLikedUsers} style={styles.likeBtn}>
        <Text style={{letterSpacing: 1, fontSize: width * 0.03}}>
          Show likes
        </Text>
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
              // borderWidth: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              rowGap: 10,
              borderBottomWidth: 1,
              borderColor: Colors.veryLightGrey,
              marginBottom: 10,
            }}>
            {/* bar */}
            <View
              style={{
                width: 70,
                height: 5,
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
                keyExtractor={item => item?._id}
                onEndReached={() => handleShowLikedUsers()}
                onEndReachedThreshold={0.5}
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
                        fontSize: width * 0.035,
                      }}>
                      {item?.firstName}
                      {item?.LastName}
                    </Text>
                    <RelativeTime time={item?.LikedTime} />
                  </TouchableOpacity>
                )}
                ListFooterComponent={
                  likedUserLoading && (
                    <ActivityIndicator size="small" color={Colors.mildGrey} />
                  )
                }
              />
            ) : (
              <Text>No Likes</Text>
            )
          ) : comments?.length > 0 ? (
            <FlatList
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              data={comments}
              onEndReached={() => handleShowComments()}
              onEndReachedThreshold={0.5}
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
                      {item?.commentedBy?.firstName}{' '}
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
              ListFooterComponent={
                commentLoading ? (
                  <ActivityIndicator size="large" color={Colors.mildGrey} />
                ) : null
              }
            />
          ) : (
            <Text>No Comments</Text>
          )}
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
                  padding: 20,
                }}>
                <Image
                  source={{uri: item}}
                  style={{
                    width: width * 0.9,
                    resizeMode: 'contain',
                    borderRadius: 10,
                    // height: 200,
                    aspectRatio: 1,
                    marginRight: post?.Images?.length > 1 ? 5 : 0,
                  }}
                />
                {post?.Images?.length > 1 && (
                  <Text>Scroll to view more images</Text>
                )}
              </View>
            )}
          />
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
            height: height * 0.38, // Alternatively, you can set the height here
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
            borderWidth: 1,
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
              <Text
                style={{
                  textAlign: 'center',
                  letterSpacing: 1,
                  fontSize: width * 0.035,
                }}>
                Delete
              </Text>
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
                }}>
                You Have No Connections To Share Posts
              </Text>
            )}
            <FlatList
              horizontal
              data={netWorksList}
              onEndReached={() => getNetworksList()}
              onEndReachedThreshold={0.5}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    handleSharePost(item?.id, post?._id);
                  }}
                  style={{borderWidth: 0, marginRight: 10}}>
                  <Image
                    source={{
                      uri: item?.profileImg
                        ? item?.profileImg
                        : 'https://i.ibb.co/3T4mNMm/man.png',
                    }}
                    style={{
                      width: width * 0.16,
                      // height: height * 0.07,
                      aspectRatio: 1,
                      borderRadius: 50,
                      borderColor: Colors.mildGrey,
                      borderWidth: 3,
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      top: hp('5.5%'),
                      zIndex: 10,
                      left: wp('10%'),
                      padding: width * 0.017,
                      backgroundColor: item?.onlineStatus ? 'green' : 'red',
                      borderRadius: 50,
                      borderWidth: 3,
                      borderColor: 'white',
                    }}
                  />
                  <Text style={{fontSize: width * 0.025, textAlign: 'center'}}>
                    {item?.firstName}
                  </Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={
                networkListLoadding && (
                  <ActivityIndicator size="small" color="#0000ff" />
                )
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
  // userName: {
  //   // fontFamily: font.poppinsBold,
  //   fontSize: 16,
  // },
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
    marginVertical: 5,
    color: Colors.veryDarkGrey,
    letterSpacing: 1,
    lineHeight: 20,
    fontSize: width * 0.03,
  },
  showMore: {
    marginVertical: 5,
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
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    borderBottomWidth: 0,
    borderColor: Colors.veryLightGrey,
  },
});
