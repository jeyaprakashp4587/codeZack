import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors, pageView} from '../constants/Colors';
import YoutubePlayer from 'react-native-youtube-iframe';
import TopicsText from '../utils/TopicsText';
import axios from 'axios';
import {challengesApi} from '../Api';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import PragraphText from '../utils/PragraphText';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import HeadingText from '../utils/HeadingText';
import Skeleton from '../Skeletons/Skeleton';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const VideoTutorials = () => {
  const {width, height} = Dimensions.get('window');
  const [allTutorials, setAllTutorials] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState([]);
  //
  const getAllTutorials = useCallback(async () => {
    try {
      const res = await axios.get(
        `${challengesApi}/Challenges/getAllTutorials`,
      );
      if (res.status == 200) {
        setAllTutorials(res.data.tutorials);
      } else {
        setAllTutorials([]);
      }
    } catch (error) {
      console.log(err);
    }
  }, [allTutorials]);
  //
  useEffect(() => {
    getAllTutorials();
  }, []);
  // handle tool
  const setTool = tool => {
    setShowModel(true);
    const tools = tool?.Data?.map(t => t);
    if (tools.length > 0) {
      // console.log(tools);
      setTools(tools);
    }
  };
  if (allTutorials.length <= 0) {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{paddingHorizontal: 15}}>
          <HeadingText text="Video Tutorials" />
        </View>
        <View style={{paddingHorizontal: 15}}>
          <Skeleton width="100%" height={hp('20%')} radius={10} />
          <Skeleton width="100%" height={hp('20%')} radius={10} />
          <Skeleton width="100%" height={hp('20%')} radius={10} />
          <Skeleton width="100%" height={hp('20%')} radius={10} />
        </View>
      </View>
    );
  }
  return (
    <ScrollView style={pageView} showsVerticalScrollIndicator={false}>
      {/* header */}
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Video Tutorials" />
      </View>
      {/* toutorila list */}
      <View style={{paddingHorizontal: 15, marginTop: 15}}>
        <FlatList
          nestedScrollEnabled={true}
          data={allTutorials}
          renderItem={({item, index}) => (
            <View
              key={index}
              style={{
                flex: 1,
                padding: 20,
                marginBottom: 15,
                borderRadius: 5,
                borderColor: Colors.mildGrey,
                flexDirection: 'column',
                rowGap: 10,
                elevation: 2,
                backgroundColor: 'white',
                margin: 2,
              }}>
              <View>
                <PragraphText text={item?.Topic} color="black" fweight={600} />
              </View>
              <View>
                {item?.Data?.map((tool, index) => (
                  <View>
                    <Text
                      key={index}
                      style={{
                        letterSpacing: 1,
                        fontSize: width * 0.035,
                        marginBottom: 5,
                        fontFamily: 'Poppins-Light',
                      }}>
                      {tool?.Tool}
                    </Text>
                  </View>
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  borderWidth: 1,
                  borderColor: 'white',
                  columnGap: 10,
                }}>
                {item?.languages?.map((lang, index) => (
                  <Text
                    style={{
                      color: Colors.mildGrey,
                      letterSpacing: 1,
                      fontFamily: 'Poppins-Light',
                    }}>
                    {lang}
                  </Text>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => setTool(item)}
                style={{
                  position: 'absolute',
                  bottom: 20,
                  // right: 0,
                  width: '100%',
                  // borderWidth: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                <EvilIcons name="play" size={40} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      {/* ask  model */}
      <Modal
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        transparent={true}
        visible={showModel}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              borderWidth: 1,
              width: '70%',
              alignSelf: 'center',
              backgroundColor: 'white',
              padding: 25,
              borderRadius: 10,
              flexDirection: 'column',
              rowGap: 10,
            }}>
            <TouchableOpacity onPress={() => setShowModel(false)}>
              <FontAwesomeIcon icon={faTimes} size={20} />
            </TouchableOpacity>
            {tools.map((i, index) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedTool(i);
                  setShowModel(false);
                }}
                style={{borderWidth: 0, paddingVertical: 5}}
                key={index}>
                <Text
                  style={{
                    letterSpacing: 2,
                    color: Colors.mildGrey,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {i?.Tool}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
      {/* play youtube video */}
      {selectedTool?.Video && (
        <YoutubePlayer
          width="100%"
          play={true}
          height={300}
          videoId={selectedTool?.Video[0]?.Tamil}
        />
      )}
    </ScrollView>
  );
};

export default VideoTutorials;

const styles = StyleSheet.create({});
