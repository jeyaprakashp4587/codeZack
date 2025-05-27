import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Font} from '../constants/Font';
import FastImage from 'react-native-fast-image';
import {Colors} from '../constants/Colors';
import {useData} from '../Context/Contexter';

const ProjectDetails = ({post}) => {
  const {user} = useData();
  const {width, height} = Dimensions.get('window');
  return (
    <View
      style={{
        borderWidth: 0,
        backgroundColor: Colors.white,
        padding: 15,
        elevation: 3,
        borderRadius: 10,
        marginHorizontal: 15,
      }}>
      {/* header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <Text style={{fontFamily: Font.SemiBold, fontSize: width * 0.05}}>
            {post?.t ?? 'Web design'}
          </Text>
          <Text style={{fontFamily: Font.Medium}}>
            {post?.d ?? 'Need a ui for school website'}
          </Text>
        </View>
      </View>
      {/* details */}
      <View>
        <Text style={{fontFamily: Font.Medium}}>Skills Required:</Text>
        <View style={{flexDirection: 'row', columnGap: 10}}>
          <Text style={{fontFamily: Font.Regular}}>Html</Text>
          <Text style={{fontFamily: Font.Regular}}>Css</Text>
          <Text style={{fontFamily: Font.Regular}}>Js</Text>
        </View>
      </View>
      {/* contact */}
      <View style={{rowGap: 10}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 5,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: Colors.mildGrey,
            justifyContent: 'center',
            borderRadius: 90,
            padding: 9,
          }}>
          <FastImage
            source={{
              uri: 'https://i.ibb.co/HLF8FVbp/whatsapp.png',
              priority: FastImage.priority.high,
            }}
            resizeMode="contain"
            style={{
              width: 20,
              aspectRatio: 1,
            }}
          />
          <Text style={{fontFamily: Font.Regular}}> +91 9025167302</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 5,
            backgroundColor: Colors.violet,
            borderWidth: 1,
            borderColor: Colors.mildGrey,
            justifyContent: 'center',
            borderRadius: 90,
            padding: 10,
          }}>
          <Image
            style={{
              width: 20,
              aspectRatio: 1,
              tintColor: Colors.white,
            }}
            source={{
              uri: 'https://i.ibb.co/GQdWb5Vf/telephone.png',
            }}
          />
          <Text style={{fontFamily: Font.Regular, color: Colors.white}}>
            {' '}
            +91 9025167302
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProjectDetails;

const styles = StyleSheet.create({});
