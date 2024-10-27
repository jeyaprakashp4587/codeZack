import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';

import {Colors, pageView} from '../constants/Colors';
import {useData} from '../Context/Contexter';
import HeadingText from '../utils/HeadingText';
import TopicsText from '../utils/TopicsText';
import ParagraphText from '../utils/PragraphText';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Feather from 'react-native-vector-icons/Feather';
import {LinearGradient} from 'react-native-linear-gradient';
import {
  faBars,
  faHandDots,
  faListDots,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Api from '../Api';
import Skeleton from '../Skeletons/Skeleton';
import Ripple from 'react-native-material-ripple';

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

  const {selectedChallengeTopic, setSelectedChallenge} = useData();
  const [Challenges, setChallenges] = useState([]);
  const [difficultyInfo, setDifficultyInfo] = useState('Newbie');
  const [menuVisible, setMenuVisible] = useState(false); // Custom dropdown visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getChallenges = useCallback(async (ChallengeTopic, level) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${Api}/Challenges/getChallenges`, {
        ChallengeTopic: ChallengeTopic,
      });
      if (res.data) {
        const {newbieLevel, juniorLevel, expertLevel, legendLevel} = res.data;
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
      }
    } catch (err) {
      setError('Failed to load challenges. Please try again.');
      console.error('Error fetching challenges:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const HandleSelectLevel = useCallback(
    levelName => {
      setDifficultyInfo(levelName);
      setMenuVisible(false); // Close custom dropdown
      getChallenges(selectedChallengeTopic, levelName);
    },
    [getChallenges, selectedChallengeTopic],
  );

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      getChallenges(selectedChallengeTopic, difficultyInfo);
    });
    return unsubscribeFocus;
  }, [navigation, selectedChallengeTopic, difficultyInfo, getChallenges]);

  if (loading) {
    return (
      <View style={pageView}>
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.pageView}>
      <HeadingText text={selectedChallengeTopic} />
      <View style={styles.spacing} />
      <View style={styles.header}>
        <TopicsText text="Choose Difficulty Level" fszie={20} mb={1} />
        <TouchableOpacity onPress={openMenu}>
          <FontAwesomeIcon icon={faBars} color={Colors.mildGrey} size={20} />
        </TouchableOpacity>
        {/* Custom Dropdown Modal */}
        <Modal
          transparent={true}
          visible={menuVisible}
          animationType="fade"
          onRequestClose={closeMenu}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              {Levels.map((level, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.menuItem, {backgroundColor: level.bgcolor}]}
                  onPress={() => HandleSelectLevel(level.name)}>
                  <Text style={styles.menuItemText}>{level.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </View>
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
              <Feather name="check-circle" size={20} color={Colors.mildGrey} />
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
  },
  flatList: {alignSelf: 'center', width: '100%'},
  challengeContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 2,
    marginTop: 15,
    margin: 5,
    // borderWidth: 1,
  },
  challengeImage: {width: '100%', height: height * 0.35, borderRadius: 20},
  challengeDescription: {
    color: Colors.veryDarkGrey,
    lineHeight: 24,
    letterSpacing: 1,
  },
  technologiesContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  technologies: {flexDirection: 'row'},
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
    paddingVertical: 20,
  },
  menuItem: {
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  menuItemText: {color: 'white', fontSize: 16},
});
