import {
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
import Api from '../Api';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import PragraphText from '../utils/PragraphText';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import BannerAdd from '../Adds/BannerAdd';
import useInterstitialAd from '../Adds/useInterstitialAd';

const VideoTutorials = () => {
  const [allTutorials, setAllTutorials] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState();
  const {showAd, loadAd, isLoaded} = useInterstitialAd();
  //
  const getAllTutorials = useCallback(async () => {
    const res = await axios.get(`${Api}/Challenges/getAllTutorials`);
    if (res.status == 200) {
      setAllTutorials(res.data.tutorials);
      // console.log(res.data);
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
  return (
    <ScrollView style={pageView} showsVerticalScrollIndicator={false}>
      {/* header */}
      <View style={{paddingHorizontal: 15}}>
        <TopicsText text="Video Tutorials" />
      </View>
      {/* banner add */}
      <BannerAdd />
      {/* toutorila list */}
      <View style={{paddingHorizontal: 15, marginTop: 15}}>
        <FlatList
          data={allTutorials}
          // horizontal
          // contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
          // numColumns={2}
          renderItem={({item, index}) => (
            <View
              key={index}
              style={{
                flex: 1,
                borderWidth: 1,
                padding: 20,
                marginBottom: 15,
                borderRadius: 5,
                borderColor: Colors.mildGrey,
                flexDirection: 'column',
                rowGap: 10,
              }}>
              <View>
                <PragraphText text={item?.Topic} color="black" />
              </View>
              <View>
                {item?.Data?.map((tool, index) => (
                  <View>
                    <Text key={index} style={{letterSpacing: 2}}>
                      {tool?.Tool}
                    </Text>
                  </View>
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  // justifyContent: 'space-between',
                  borderWidth: 1,
                  // width: '100%',
                  borderColor: 'white',
                  columnGap: 10,
                }}>
                {item?.languages?.map((lang, index) => (
                  <Text style={{color: index == 1 ? Colors.violet : 'orange'}}>
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
                  if (loadAd) {
                    showAd();
                  }
                  setSelectedTool(i);
                  setShowModel(false);
                }}
                style={{borderWidth: 0, paddingVertical: 5}}
                key={index}>
                <Text style={{letterSpacing: 2, color: Colors.mildGrey}}>
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
      {/* banner add */}
      <BannerAdd />
    </ScrollView>
  );
};

export default VideoTutorials;

const styles = StyleSheet.create({});
