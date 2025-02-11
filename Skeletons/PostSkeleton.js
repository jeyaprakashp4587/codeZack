import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Skeleton from './Skeleton';

const PostSkeleton = () => {
  const {width, height} = Dimensions.get('window');
  return (
    <View
      style={{
        borderWidth: 0,
        flexDirection: 'column',
        rowGap: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // justifyContent: 'center',
          columnGap: 10,
          paddingHorizontal: 15,
        }}>
        <Skeleton width={50} height={50} radius={50} />
        <View style={{flexDirection: 'column', rowGap: 5}}>
          <Skeleton width={width * 0.6} height={10} radius={50} />
          <Skeleton width={width * 0.4} height={10} radius={50} />
        </View>
      </View>
      {/* post texts */}
      <View style={{flexDirection: 'column', rowGap: 5, paddingHorizontal: 15}}>
        <Skeleton width={width * 0.8} height={10} radius={50} />
        <Skeleton width={width * 0.7} height={10} radius={50} />
      </View>
      {/* post image */}
      <View>
        <Skeleton width={width * 1} height={200} radius={10} />
      </View>
      {/* post options*/}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
        }}>
        <Skeleton width={width * 0.25} height={30} radius={10} />
        <Skeleton width={width * 0.25} height={30} radius={10} />
        <Skeleton width={width * 0.25} height={30} radius={10} />
      </View>
      <View style={{flexDirection: 'column', rowGap: 5, paddingHorizontal: 15}}>
        <Skeleton width={width * 0.8} height={10} radius={50} />
      </View>
    </View>
  );
};

export default PostSkeleton;

const styles = StyleSheet.create({});
