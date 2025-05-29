import {
  Alert,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback} from 'react';
import {Font} from '../constants/Font';
import FastImage from 'react-native-fast-image';
import {Colors} from '../constants/Colors';
import {useData} from '../Context/Contexter';

const ProjectDetails = ({post}) => {
  const {user} = useData();
  const {width, height} = Dimensions.get('window');
  //open whats app
  const countryCode = '+91';
  const handleWhatsAppPress = useCallback(() => {
    const fullNumber = `${countryCode.replace('+', '')}${post?.mN}`;
    const url = `https://wa.me/${fullNumber}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            'Error',
            'WhatsApp is not installed or the URL is invalid.',
          );
        }
      })
      .catch(err => console.error('WhatsApp error:', err));
  }, [post?.mN]);

  const handleCallPress = useCallback(() => {
    const url = `tel:${countryCode}${post?.pN}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Cannot initiate a phone call.');
        }
      })
      .catch(err => console.error('Call error:', err));
  }, [post?.pN]);
  return (
    <View
      style={{
        borderWidth: 0,
        backgroundColor: Colors.white,
        padding: 15,
        // elevation: 3,
        // borderRadius: 10,
        // marginHorizontal: 15,
        rowGap: 10,
        borderBottomWidth: 1,
        borderColor: Colors.veryLightGrey,
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
          {post?.skills?.map(i => (
            <Text style={{fontFamily: Font.Regular}}>{i?.tech}</Text>
          ))}
        </View>
      </View>
      {/* contact */}
      <View style={{rowGap: 10}}>
        <TouchableOpacity
          onPress={handleWhatsAppPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 5,
            backgroundColor: 'white',
            borderWidth: 0.5,
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
          <Text style={{fontFamily: Font.Regular}}> +91 {post?.mN}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 5,
            backgroundColor: 'rgba(133, 200, 255, 0.69)',
            borderColor: Colors.mildGrey,
            justifyContent: 'center',
            borderRadius: 90,
            padding: 10,
          }}
          onPress={handleCallPress}>
          <Image
            style={{
              width: 20,
              aspectRatio: 1,
              tintColor: Colors.veryDarkGrey,
            }}
            source={{
              uri: 'https://i.ibb.co/GQdWb5Vf/telephone.png',
            }}
          />
          <Text style={{fontFamily: Font.Regular, color: Colors.veryDarkGrey}}>
            {' '}
            +91 {post?.pN}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProjectDetails;

const styles = StyleSheet.create({});
