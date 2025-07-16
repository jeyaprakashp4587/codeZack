import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../../constants/Colors';
import HeadingText from '../../utils/HeadingText';
import axios from 'axios';
import {Api} from '../../Api';
import FastImage from 'react-native-fast-image';
import {Font} from '../../constants/Font';

const LeaderBoard = () => {
  const {width} = Dimensions.get('window');
  const [top3, setTop3] = useState([]);
  const [balTop10, setBalTop10] = useState([]);

  const get = useCallback(async () => {
    try {
      const response = await axios.get(`${Api}/LeaderBoard/getLeaderBoard`);

      if (response.status === 200 && response.data?.users) {
        const users = response.data.users;
        const top3slice = users.slice(0, 3);
        const bal = users.slice(3, 10);
        setTop3(top3slice);
        setBalTop10(bal);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }, []);

  useEffect(() => {
    get();
  }, []);

  const renderUserCard = (item, index, isTop3 = false) => {
    const badgeUrls = [
      'https://i.ibb.co/dJJGyRgX/winner.png',
      'https://i.ibb.co/n8bHgdTX/2nd-place.png',
      'https://i.ibb.co/BHd3WJZm/3rd-place.png',
    ];

    return (
      <TouchableOpacity style={styles.userCard}>
        <View style={{position: 'relative'}}>
          <FastImage
            source={{
              uri: item?.profile,
              priority: FastImage.priority.high,
            }}
            style={styles.profileImg}
          />
          {isTop3 && index < 3 && (
            <FastImage
              source={{uri: badgeUrls[index]}}
              resizeMode="contain"
              style={styles.badge}
            />
          )}
        </View>
        <Text style={styles.nameText}>
          {item?.firstName + ' ' + item?.LastName}
        </Text>
        <Text style={styles.scoreText}>Score: {item?.ChallengesPoint}</Text>
      </TouchableOpacity>
    );
  };
  const renderTop10 = (item, index) => {
    return (
      <View
        style={{
          // borderWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 5,
          columnGap: 10,
        }}>
        <Text style={{borderWidth: 0, textAlign: 'right'}}>
          {top3.length + 1 + index}
        </Text>
        <FastImage
          source={{
            uri: item?.profile,
            priority: FastImage.priority.high,
          }}
          style={{
            width: width * 0.15,
            borderRadius: 100,
            aspectRatio: 1,
            // flex: 1,
          }}
        />
        <Text
          style={{fontSize: width * 0.04, fontFamily: Font.Regular, flex: 1}}>
          {item?.firstName + ' ' + item?.LastName}
        </Text>
        <Text
          style={{
            fontSize: width * 0.03,
            fontFamily: Font.SemiBold,
            color: Colors.violet,
            // fontWeight:
          }}>
          Score: {item?.ChallengesPoint}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: Colors.white}}>
      <View style={styles.container}>
        <HeadingText text="Leaderboard" />
      </View>

      {/* Top 3 */}
      <View style={styles.top3Container}>
        {top3.map((item, index) => renderUserCard(item, index, true))}
      </View>

      {/* Top 4 to 10 */}
      <View style={styles.top10Container}>
        <FlatList
          data={balTop10}
          keyExtractor={item => item._id}
          contentContainerStyle={{
            marginHorizontal: 25,
          }}
          renderItem={({item, index}) => renderTop10(item, index)}
        />
      </View>
    </ScrollView>
  );
};

export default LeaderBoard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  top3Container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'rgba(21, 36, 65, 0.03)',
    margin: 10,
    borderRadius: 10,
  },
  top10Container: {
    marginVertical: 10,
  },
  balListContainer: {
    paddingHorizontal: 10,
    gap: 15,
  },
  userCard: {
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 6,
    marginHorizontal: 5,
  },
  profileImg: {
    width: Dimensions.get('window').width * 0.23,
    aspectRatio: 1,
    borderRadius: 100,
  },
  badge: {
    width: Dimensions.get('window').width * 0.1,
    aspectRatio: 1,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  nameText: {
    fontFamily: Font.SemiBold,
    fontSize: Dimensions.get('window').width * 0.04,
    marginTop: 4,
  },
  scoreText: {
    backgroundColor: Colors.violet,
    color: Colors.white,
    fontSize: Dimensions.get('window').width * 0.03,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
});
