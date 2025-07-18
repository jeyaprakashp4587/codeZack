import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import {Colors, pageView} from '../../constants/Colors';
import {useData} from '../../Context/Contexter';
import HeadingText from '../../utils/HeadingText';
import TopicsText from '../../utils/TopicsText';
import ParagraphText from '../../utils/PragraphText';
import Feather from 'react-native-vector-icons/Feather';
import {LinearGradient} from 'react-native-linear-gradient';
import axios from 'axios';
import {challengesApi} from '../../Api';
import Skeleton from '../../Skeletons/Skeleton';
import Ripple from 'react-native-material-ripple';
import {useFocusEffect} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import {Font} from '../../constants/Font';

const {width, height} = Dimensions.get('window');

const ChooseChallenge = ({navigation}) => {
  const Levels = useMemo(
    () => [
      {name: 'Newbie', bgcolor: '#009900'},
      {name: 'Junior', bgcolor: '#cca300'},
      {name: 'Expert', bgcolor: '#cc6600'},
      {name: 'Legend', bgcolor: '#990000'},
    ],
    [],
  );

  const {selectedChallengeTopic, setSelectedChallenge, user} = useData();
  const [Challenges, setChallenges] = useState([]);
  const [difficultyInfo, setDifficultyInfo] = useState('Newbie');
  const [menuVisible, setMenuVisible] = useState(false);
  const [challengesData, setChallengesData] = useState(null); // To store all challenges initially
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getChallenges = useCallback(async () => {
    console.log('Fetching challenges...');
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${challengesApi}/Challenges/getChallenges`,
        {
          ChallengeTopic: selectedChallengeTopic,
        },
      );
      if (res.data && res.status === 200) {
        setChallengesData(res.data); // Set challenges data only once
      }
    } catch (err) {
      setError('Failed to load challenges. Please try again.');
      console.error('Error fetching challenges:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedChallengeTopic]); // This only depends on the topic now

  const filterChallengesByLevel = useCallback(
    level => {
      if (!challengesData) {
        setError('Challenges not loaded yet. Please refresh.');
        return;
      }

      const {newbieLevel, juniorLevel, expertLevel, legendLevel} =
        challengesData;

      switch (level) {
        case 'Newbie':
          setChallenges(newbieLevel); // Directly filter from the already fetched data
          break;
        case 'Junior':
          setChallenges(juniorLevel);
          break;
        case 'Expert':
          setChallenges(expertLevel);
          break;
        case 'Legend':
          setChallenges(legendLevel);
          break;
        default:
          setChallenges([]);
      }
    },
    [challengesData],
  );

  useEffect(() => {
    if (challengesData) {
      filterChallengesByLevel('Newbie');
    }
  }, [challengesData, filterChallengesByLevel]);

  // Automatically call getChallenges when the topic changes
  const HandleSelectLevel = useCallback(
    levelName => {
      setDifficultyInfo(levelName);
      setMenuVisible(false);
      filterChallengesByLevel(levelName);
    },
    [filterChallengesByLevel],
  );
  const [refresh, setRefresh] = useState(false);
  const handleRefresh = useCallback(async () => {
    setRefresh(true);
    await getChallenges().finally(() => setRefresh(false));
  }, [getChallenges]);
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      getChallenges();
      getCompletedAllChallenges();
    });
    return () => task.cancel();
  }, [getChallenges, getCompletedAllChallenges]);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // get completed challlegs from use
  const [userCompletedChallenges, setUserCompletedChallenges] = useState([]);
  const getCompletedAllChallenges = useCallback(() => {
    const filter = user?.Challenges?.filter(item => item.status == 'completed');
    if (filter) {
      setUserCompletedChallenges(filter);
    }
  }, [user]);
  // handleChoose
  const handleChooseChallenge = useCallback(item => {
    InteractionManager.runAfterInteractions(() => {
      navigation.navigate('challengeDetail');
      setSelectedChallenge({
        ChallengeName: item?.ChallengeName || item?.title,
        ChallengeType: item?.ChallengeType || item?.ChallengeType,
        ChallengeLevel: item?.ChallengeLevel || item?.level,
      });
    });
  }, []);
  // render loading
  if (loading) {
    return (
      <View style={[pageView, {paddingHorizontal: 15}]}>
        <Skeleton width="100%" height={height * 0.06} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.08} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.3} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.3} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.3} radius={10} mt={10} />
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
        style={{
          flex: 1,
          // justifyContent: 'center',
          // alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <Text>{error}</Text>
      </ScrollView>
    );
  }

  return (
    <View style={styles.pageView}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text={selectedChallengeTopic} />
      </View>
      <View style={styles.spacing} />
      <View style={styles.header}>
        <Text
          style={{
            fontSize: width * 0.043,
            letterSpacing: 0.4,
            fontFamily: Font.Regular,
          }}>
          Choose Difficulty Level
        </Text>
        <TouchableOpacity onPress={openMenu}>
          {/* <FontAwesomeIcon icon={faD} color={Colors.mildGrey} size={20} /> */}
          <Entypo
            name="dots-three-vertical"
            color={Colors.lightGrey}
            size={18}
          />
        </TouchableOpacity>
        {/* Custom Dropdown Modal */}
        <Modal
          transparent={true}
          visible={menuVisible}
          animationType="slide"
          onRequestClose={closeMenu}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              {Levels.map((level, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    {borderBottomWidth: index == Levels.length - 1 ? 0 : 1},
                  ]}
                  onPress={() => HandleSelectLevel(level.name)}>
                  <Text style={[styles.menuItemText, {color: level.bgcolor}]}>
                    {level.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </View>

      {/* challenges list */}
      <FlatList
        nestedScrollEnabled={true}
        data={Challenges}
        initialNumToRender={2}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        renderItem={({item, index}) => (
          <View style={styles.challengeContainer} key={index}>
            {/* Challenge Item Layout */}
            <View style={{rowGap: 5}}>
              <Text
                style={{
                  color: Colors.veryDarkGrey,
                  fontSize: width * 0.05,
                  // padding: 5,
                  fontFamily: Font.Medium,
                  // letterSpacing: 0.4,
                }}>
                {item.title}
              </Text>
              <Text
                style={{
                  fontFamily: Font.Medium,
                  fontSize: width * 0.03,
                  backgroundColor: 'rgb(100, 148, 238)',
                  alignSelf: 'flex-start',
                  color: Colors.white,
                  padding: 4,
                  paddingHorizontal: 10,
                  borderRadius: 100,
                }}>
                {item.level ? item.level : difficultyInfo} Xp {'('}
                {item?.level === 'newbie'
                  ? 10
                  : item?.level === 'junior'
                  ? 20
                  : item?.level === 'expert'
                  ? 30
                  : 40}
                {')'}
              </Text>
            </View>
            {item?.level !== 'newbie' && (
              <FastImage
                priority={FastImage.priority.high}
                source={{uri: item.sample_image}}
                style={styles.challengeImage}
                resizeMode="contain"
              />
            )}
            <Text style={styles.challengeDescription}>{item.description}</Text>
            <View style={styles.technologiesContainer}>
              <View style={styles.technologies}>
                {item.technologies.map((i, index) => (
                  <FastImage
                    key={index}
                    source={{uri: i.icon, priority: FastImage.priority.high}}
                    style={styles.technologyIcon}
                  />
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  columnGap: 10,
                }}>
                {userCompletedChallenges.some(
                  completedChallenge =>
                    completedChallenge.ChallengeName === item.title,
                ) && (
                  <Text
                    style={{
                      letterSpacing: 0.4,
                      color: Colors.mildGrey,
                      fontSize: width * 0.02,
                      // fontWeight: '600',
                      fontFamily: Font.Regular,
                    }}>
                    Finished!
                  </Text>
                )}
                <Feather
                  name="check-circle"
                  size={20}
                  color={
                    userCompletedChallenges.some(
                      completedChallenge =>
                        completedChallenge.ChallengeName === item.title,
                    )
                      ? 'green'
                      : Colors.lightGrey
                  }
                />
              </View>
            </View>
            <Ripple
              rippleColor="lightgrey"
              onPress={() => {
                handleChooseChallenge(item);
              }}
              style={{
                backgroundColor: Colors.violet,
                borderRadius: 5,
              }}>
              <Text style={styles.viewChallengeButtonText}>View Challenge</Text>
            </Ripple>
          </View>
        )}
      />
    </View>
  );
};

export default React.memo(ChooseChallenge);

const styles = StyleSheet.create({
  pageView: {...pageView},
  spacing: {height: 10},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  flatList: {
    alignSelf: 'center',
    width: '100%',
    // paddingHorizontal: 15,
    marginBottom: 10,
  },
  challengeContainer: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 15,
    borderWidth: 0,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Colors.veryLightGrey,
    rowGap: 10,
  },
  challengeImage: {
    width: '100%',
    height: height * 0.25,
    borderRadius: 20,
  },
  challengeDescription: {
    color: Colors.veryDarkGrey,
    lineHeight: 24,
    // letterSpacing: 1,
    fontFamily: Font.Regular,
  },
  technologiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  technologies: {flexDirection: 'row', columnGap: 10},
  technologyIcon: {width: width * 0.08, height: width * 0.08},
  linearGradient: {borderRadius: 10, padding: 2, justifyContent: 'center'},
  viewChallengeButtonText: {
    color: Colors.white,
    letterSpacing: 0.4,
    textAlign: 'center',
    borderRadius: 10,
    padding: 10,
    fontFamily: Font.SemiBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 30,
  },
  menuItem: {
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.veryLightGrey,
  },
  menuItemText: {
    fontSize: width * 0.038,
    letterSpacing: 1,
    fontFamily: Font.Regular,
  },
});
