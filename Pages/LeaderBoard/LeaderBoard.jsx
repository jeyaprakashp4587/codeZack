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
import useMonthlyCountdown from '../../hooks/useMonthlyCountdown';
import {useData} from '../../Context/Contexter';

const LeaderBoard = () => {
  const {width} = Dimensions.get('window');
  const [top3, setTop3] = useState([]);
  const [balTop10, setBalTop10] = useState([]);
  const {days, mins, secs, hours} = useMonthlyCountdown();
  const {user} = useData();
  const [userPosition, setUserPosition] = useState();

  const get = useCallback(async () => {
    try {
      const response = await axios.get(`${Api}/LeaderBoard/getLeaderBoard`);

      if (response.status === 200 && response.data?.users) {
        const users = response.data.users;
        const top3slice = users.slice(0, 3).reverse();
        const bal = users.slice(3, 10);
        setTop3(top3slice);
        setBalTop10(bal);
        // find user position
        if (response?.data?.users) {
          await response?.data?.users?.map((list, index) => {
            if (list?._id === user?._id) {
              setUserPosition(index + 1);
            }
          });
        }
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
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 5,
          columnGap: 10,
        }}>
        <View style={{borderWidth: 0, width: '10%'}}>
          <Text style={{borderWidth: 0, textAlign: 'center'}}>
            {top3.length + 1 + index}
          </Text>
        </View>
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
          style={{
            fontSize: width * 0.034,
            fontFamily: Font.Medium,
          }}>
          {item?.firstName + ' ' + item?.LastName}
        </Text>
        <View style={{flex: 1, borderWidth: 0}}>
          <Text
            style={{
              fontSize: width * 0.03,
              fontFamily: Font.SemiBold,
              color: Colors.violet,
              textAlign: 'right',
              // fontWeight:
            }}>
            Score: {item?.ChallengesPoint}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: Colors.white}}>
      <View style={styles.container}>
        <HeadingText text="Leaderboard" />
      </View>
      {/* show timer  and user point*/}
      <View
        style={{
          paddingHorizontal: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <FastImage
            source={{
              uri: user?.Images?.profile,
              priority: FastImage.priority.high,
            }}
            style={{
              width: width * 0.15,
              borderRadius: 100,
              aspectRatio: 1,
            }}
          />
          <Text
            style={{
              fontFamily: Font.SemiBold,
              fontSize: width * 0.043,
              color: Colors.veryDarkGrey,
            }}>
            {user?.firstName}
          </Text>
          <Text style={{fontFamily: Font.Medium, fontSize: width * 0.038}}>
            {userPosition > 0 && userPosition < 4
              ? 'You are in top 3👑'
              : userPosition > 3 && userPosition <= 10
              ? 'You are in top 10 ️‍🔥'
              : user?.ChallengesPoint}
          </Text>
        </View>
        <Text
          style={{
            backgroundColor: 'rgb(0, 0, 0)',
            color: 'rgb(255, 255, 255)',
            fontFamily: Font.Medium,
            fontSize: width * 0.034,
            padding: 5,
            borderRadius: 100,
            paddingHorizontal: 20,
            textAlign: 'center',
            lineHeight: 20,
          }}>
          Leaderboards ends in {'\n'} {days}:{hours}:{mins}:{secs}
        </Text>
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
            marginHorizontal: 15,
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
    bottom: -5,
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
