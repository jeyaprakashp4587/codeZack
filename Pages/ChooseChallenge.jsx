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
} from 'react-native';
import {Colors, pageView} from '../constants/Colors';
import {useData} from '../Context/Contexter';
import HeadingText from '../utils/HeadingText';
import TopicsText from '../utils/TopicsText';
import ParagraphText from '../utils/PragraphText';
import Feather from 'react-native-vector-icons/Feather';
import {LinearGradient} from 'react-native-linear-gradient';
import axios from 'axios';
import {challengesApi} from '../Api';
import Skeleton from '../Skeletons/Skeleton';
import Ripple from 'react-native-material-ripple';
import {useFocusEffect} from '@react-navigation/native';
import BannerAdd from '../Adds/BannerAdd';
import Entypo from 'react-native-vector-icons/Entypo';

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
        setChallengesData(res.data); // Update challengesData
      }
    } catch (err) {
      setError('Failed to load challenges. Please try again.');
      console.error('Error fetching challenges:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedChallengeTopic]);
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
          setChallenges([...newbieLevel]);
          break;
        case 'Junior':
          setChallenges([...juniorLevel]);
          break;
        case 'Expert':
          setChallenges([...expertLevel]);
          break;
        case 'Legend':
          setChallenges([...legendLevel]);
          break;
        default:
          setChallenges([]);
      }
    },
    [challengesData],
  );
  // Fetch challenges only once when the component mounts
  useEffect(() => {
    getChallenges();
  }, [getChallenges]);
  // Automatically filter challenges by level when challengesData is updated
  useEffect(() => {
    if (challengesData) {
      filterChallengesByLevel('Newbie');
    }
  }, [challengesData, filterChallengesByLevel]);

  // refresh
  const [refresh, setRefresh] = useState(false);
  const handleRefresh = useCallback(async () => {
    setRefresh(true);
    await getChallenges().finally(() => setRefresh(false));
  }, []);
  const HandleSelectLevel = useCallback(
    levelName => {
      setDifficultyInfo(levelName);
      setMenuVisible(false); // Close custom dropdown
      filterChallengesByLevel(levelName);
    },
    [getChallenges, selectedChallengeTopic],
  );

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  useFocusEffect(
    useCallback(() => {
      getChallenges(selectedChallengeTopic, difficultyInfo);
      getCompletedAllChallenges();
    }, [
      selectedChallengeTopic,
      difficultyInfo,
      getChallenges,
      getCompletedAllChallenges,
    ]),
  );
  // get completed challlegs from use
  const [userCompletedChallenges, setUserCompletedChallenges] = useState([]);
  const getCompletedAllChallenges = useCallback(() => {
    const filter = user?.Challenges?.filter(item => item.status == 'completed');
    if (filter) {
      setUserCompletedChallenges(filter);
    }
  }, [user]);
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
        <TopicsText
          text="Choose Difficulty Level"
          fszie={width * 0.043}
          mb={1}
        />
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
      {/* Banner add */}
      <BannerAdd />
      {/* Banner add */}
      {/* challenges list */}
      <FlatList
        data={Challenges}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        renderItem={({item, index}) => (
          <View style={styles.challengeContainer} key={index}>
            {/* Challenge Item Layout */}
            <View>
              <ParagraphText text={item.title} fsize={18} padding={5} />
              <ParagraphText
                text={item.level ? item.level : difficultyInfo}
                fsize={15}
                color="orange"
              />
            </View>
            {item?.level !== 'newbie' && (
              <Image
                source={{uri: item.sample_image}}
                style={styles.challengeImage}
              />
            )}
            <Text style={styles.challengeDescription}>{item.description}</Text>
            <View style={styles.technologiesContainer}>
              <View style={styles.technologies}>
                {item.technologies.map((i, index) => (
                  <Image
                    key={index}
                    source={{uri: i.icon}}
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
                      letterSpacing: 2,
                      color: Colors.mildGrey,
                      fontSize: width * 0.02,
                      fontWeight: '600',
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
                      : Colors.mildGrey
                  }
                />
              </View>
            </View>
            <Ripple
              rippleColor="lightgrey"
              onPress={() => {
                navigation.navigate('challengeDetail');
                setSelectedChallenge(item);
              }}>
              <LinearGradient
                colors={['#79a6d2', '#9fbfdf', '#79a6d2']}
                style={styles.linearGradient}>
                <Text style={styles.viewChallengeButtonText}>
                  View Challenge
                </Text>
              </LinearGradient>
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
  },
  flatList: {alignSelf: 'center', width: '100%', paddingHorizontal: 15},
  challengeContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 2,
    marginTop: 15,
    margin: 5,
    // paddingHorizontal: 15,
    // borderWidth: 1,
  },
  challengeImage: {width: '100%', height: height * 0.35, borderRadius: 20},
  challengeDescription: {
    color: Colors.veryDarkGrey,
    lineHeight: 24,
    letterSpacing: 1,
    paddingVertical: 10,
  },
  technologiesContainer: {
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  technologies: {flexDirection: 'row', columnGap: 10},
  technologyIcon: {width: width * 0.08, height: width * 0.08},
  linearGradient: {borderRadius: 10, padding: 10, justifyContent: 'center'},
  viewChallengeButtonText: {
    color: 'white',
    letterSpacing: 1,
    textAlign: 'center',
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
  menuItemText: {fontSize: width * 0.038, letterSpacing: 1},
});
