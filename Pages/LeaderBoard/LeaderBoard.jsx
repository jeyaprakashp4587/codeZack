import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ImageBackground,
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
import truncateText from '../../hooks/truncateText';
import {useNavigation} from '@react-navigation/native';
import Skeleton from '../../Skeletons/Skeleton';

const LeaderBoard = () => {
  const {width, height} = Dimensions.get('window');
  const [top3, setTop3] = useState([]);
  const [balTop10, setBalTop10] = useState([]);
  const {days, mins, secs, hours} = useMonthlyCountdown();
  const {user} = useData();
  const [userPosition, setUserPosition] = useState();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const get = useCallback(async () => {
    try {
      // return;
      setLoading(true);
      const response = await axios.get(`${Api}/LeaderBoard/getLeaderBoard`);

      if (response.status === 200 && response.data?.users) {
        const users = response.data.users;
        const top3slice = users.slice(0, 3).reverse();
        const bal = users.slice(3, 10);
        setTop3(top3slice);
        setBalTop10(bal);
        setLoading(false);
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
      setLoading(false);
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
          {truncateText(item?.firstName + ' ' + item?.LastName, 10)}
        </Text>
        <Text style={styles.scoreText}>Xp: {item?.ChallengesPoint}</Text>
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
          columnGap: 10,
          marginVertical: 8,
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
            width: width * 0.14,
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
          {truncateText(item?.firstName + ' ' + item?.LastName, 15)}
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
            Xp: {item?.ChallengesPoint}
          </Text>
        </View>
      </View>
    );
  };
  // return loading and error screen
  if (loading) {
    return (
      <View style={{backgroundColor: Colors.white, flex: 1}}>
        <View style={styles.container}>
          <HeadingText text="Leaderboard" />
        </View>
        <View style={{rowGap: 10}}>
          <Skeleton width={width} height={80} />
          <Skeleton width={width} height={240} />
          <Skeleton width={width} height={360} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: Colors.white}}
      showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={{uri: 'https://i.ibb.co/PGMhBBCv/v904-nunny-012-f.jpg'}}
        style={{
          width: '100%',
          flex: 1,
        }}
        resizeMode="stretch">
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
            backgroundColor: 'rgba(21, 36, 65, 0.03)',
            padding: 10,
            margin: 10,
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
                : `Xp: ${user?.ChallengesPoint}`}
            </Text>
          </View>
          <View style={{rowGap: 5}}>
            <Text style={{fontFamily: Font.Medium}}>Leaderboard ends in</Text>
            <Text
              style={{
                backgroundColor: 'rgba(41, 40, 40, 0.06)',
                color: 'rgb(0, 0, 0)',
                fontFamily: Font.SemiBold,
                fontSize: width * 0.032,
                padding: 5,
                borderRadius: 100,
                paddingHorizontal: 20,
                textAlign: 'center',
                lineHeight: 20,
              }}>
              {days}:{hours}:{mins}:{secs}
            </Text>
          </View>
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
        {/*Button*/}
        {!user?.Challenges?.length <= 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Code', {showXp: true})}
            style={{
              height: height * 0.06,
              backgroundColor: Colors.violet,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 15,
              borderRadius: 100,
            }}>
            <Text
              style={{
                color: Colors.white,
                fontFamily: Font.Medium,
                // fontSize: width * 0.45,
              }}>
              Take challenges
            </Text>
          </TouchableOpacity>
        )}
      </ImageBackground>
    </ScrollView>
  );
};

export default LeaderBoard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    // marginTop: 10,
  },
  top3Container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    margin: 10,
    borderRadius: 10,
  },
  top10Container: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    margin: 10,
    borderRadius: 10,
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
    backgroundColor: 'rgba(255, 255, 255, 0.39)',
    color: 'black',
    fontSize: Dimensions.get('window').width * 0.03,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 100,
    fontFamily: Font.SemiBold,
  },
});
