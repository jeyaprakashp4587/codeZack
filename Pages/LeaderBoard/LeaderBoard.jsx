import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../../constants/Colors';
import HeadingText from '../../utils/HeadingText';
import axios from 'axios';
import {Api} from '../../Api';
import FastImage from 'react-native-fast-image';
import {Font} from '../../constants/Font';

const LeaderBoard = () => {
  const {width, height} = Dimensions.get('window');
  const [top3, setTop3] = useState();
  const get = useCallback(async () => {
    const {status, data} = await axios.get(`${Api}/LeaderBoard/getLeaderBoard`);
    if (status == 200 && data) {
      const top3slice = data?.users?.slice(0, 3);
      if (top3slice) {
        setTop3(top3slice);
      }
    }
  }, []);
  useEffect(() => {
    get();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Leaderboard" />
      </View>
      {/* board */}
      <View>
        <FlatList
          data={top3}
          keyExtractor={item => item?._id}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={{
                // borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                rowGap: 6,
              }}>
              <View>
                <FastImage
                  source={{
                    uri: item?.profile,
                    priority: FastImage.priority.high,
                  }}
                  style={{
                    width: width * 0.3,
                    aspectRatio: 1,
                    borderRadius: 100,
                  }}
                  resizeMode="contain"
                />
                <FastImage
                  source={{
                    uri:
                      index === 0
                        ? 'https://i.ibb.co/dJJGyRgX/winner.png'
                        : index === 1
                        ? 'https://i.ibb.co/n8bHgdTX/2nd-place.png'
                        : 'https://i.ibb.co/BHd3WJZm/3rd-place.png',
                  }}
                  resizeMode="contain"
                  style={{
                    width: width * 0.1,
                    aspectRatio: 1,
                    position: 'absolute',
                    right: -0,
                    bottom: 0,
                  }}
                />
              </View>

              <Text style={{fontFamily: Font.SemiBold, fontSize: width * 0.05}}>
                {item?.firstName + item?.LastName}
              </Text>
              <Text
                style={{
                  backgroundColor: 'rgb(238, 31, 49)',
                  color: Colors.white,
                  fontSize: width * 0.03,
                  padding: 3,
                  borderRadius: 100,
                  paddingHorizontal: 10,
                }}>
                score: {item?.ChallengesPoint}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default LeaderBoard;

const styles = StyleSheet.create({});
