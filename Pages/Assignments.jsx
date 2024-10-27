import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TopicsText from '../utils/TopicsText';
import {Colors} from '../constants/Colors';
import {useData} from '../Context/Contexter';
import {useNavigation} from '@react-navigation/native';

const Assignments = () => {
  const navigation = useNavigation();
  const {user, assignmentType, setAssignmentType} = useData();
  const {width, height} = Dimensions.get('window');
  const [userTools, setUserTools] = useState();
  // datas
  const Tools = useMemo(
    () => [
      {name: 'Html', img: 'https://i.ibb.co/Xk3RLpx/icons8-html-240.png'},
      {name: 'Css', img: 'https://i.ibb.co/nCYc39x/css-3.png'},
      {
        name: 'Js',
        img: 'https://i.ibb.co/HBw8Zk7/icons8-javascript-240.png',
      },
      {
        name: 'React',
        img: 'https://i.ibb.co/9Nzd77w/icons8-react-native-480.png',
      },
      {name: 'Node', img: 'https://img.icons8.com/fluency/144/node-js.png'},
      {
        name: 'Express',
        img: 'https://img.icons8.com/fluency/48/express-js.png',
      },
      {
        name: 'MongodB',
        img: 'https://i.ibb.co/7XhNKtL/1012822-code-development-logo-mongodb-programming-icon.png',
      },
      {name: 'C++', img: 'https://i.ibb.co/GQ8V1VZ/icons8-c-240.png'},
      {name: 'Java', img: 'https://i.ibb.co/2yg1Xps/icons8-java-480.png'},
      {name: 'Kotlin', img: 'https://i.ibb.co/0MBKbB8/icons8-kotlin-480.png'},
      {
        name: 'React Native',
        img: 'https://i.ibb.co/9Nzd77w/icons8-react-native-480.png',
      },
      {name: 'Swift', img: 'https://i.ibb.co/yBGtbzs/icons8-swift-240.png'},
      {
        name: 'Bootstrap',
        img: 'https://i.ibb.co/xFwH6Q3/icons8-bootstrap-480.png',
      },
    ],
    [],
  );
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const existsTool = user?.Courses?.flatMap(course =>
        course.Technologies.map(tool => tool.TechName),
      );
      if (existsTool) setUserTools(existsTool);
    });

    return unsubscribe; // Cleanup listener when the component unmounts
  }, []);
  // fetch the user Course tools
  //
  const HandleSelectAssignment = useCallback(
    Tool => {
      // console.log(Tool.toLowerCase()); // Use the new Tool value directly

      const findTool = userTools?.find(
        i => i.toLowerCase() == Tool.toLowerCase(), // Compare with the current Tool, not the previous selectedTool state
      );
      if (findTool) {
        setAssignmentType(Tool.toLowerCase());
        navigation.navigate('AssignmentPlayGround');
      } else {
        Alert.alert('First you need to enrolled for this Technology');
        navigation.navigate('carrerScreen');
      }
    },
    [userTools], // Only depend on userTools, not selectedTool
  );

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: 'white'}}
      showsVerticalScrollIndicator={false}>
      <Image
        source={{uri: 'https://i.ibb.co/qLSFp14/22378291-6567453.jpg'}}
        style={{
          width: width * 0.9,
          height: height * 0.5,
          alignSelf: 'center',
        }}
      />
      {/* text */}
      <Text
        style={{
          color: Colors.mildGrey,
          fontSize: width * 0.07,
          textAlign: 'center',
          letterSpacing: 2,
        }}>
        Assignments
      </Text>
      {/* list assignments */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          marginTop: 30,
          marginBottom: 20,
        }}>
        {Tools.map((item, index) => (
          <TouchableOpacity
            onPress={() => HandleSelectAssignment(item.name)}
            key={index}
            style={{
              // borderWidth: 0.2,
              justifyContent: 'center',
              alignItems: 'center',
              width: width * 0.4,
              height: height * 0.2,
              borderRadius: 5,
              borderColor: Colors.mildGrey,
              overflow: 'hidden',
              elevation: 3,
              backgroundColor: 'white',
              padding: 10,
              rowGap: 10,
            }}>
            <Text
              style={{
                color: Colors.mildGrey,
                fontSize: width * 0.04,
                fontWeight: '600',
                letterSpacing: 1,
              }}>
              {item.name}
            </Text>
            <Image
              source={{uri: item.img}}
              style={{
                width: 30,
                height: 30,
                // position: "absolute",
                // right: -20,
                // bottom: -20,
                // opacity: 0.09,
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Assignments;

const styles = StyleSheet.create({});
