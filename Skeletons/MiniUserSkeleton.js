import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Skeleton from './Skeleton';

const MiniUserSkeleton = () => {
  const {width, height} = Dimensions.get('window');
  return (
    <View style={{flexDirection: 'row', borderWidth: 0, columnGap: 5}}>
      <View style={{borderWidth: 0}}>
        <Skeleton
          width={width * 0.15}
          height={height * 0.073}
          radius={width * 0.075}
        />
      </View>
      <View style={{rowGap: 5, borderWidth: 0, flex: 1, paddingTop: 5}}>
        <Skeleton width={'80%'} height={height * 0.02} radius={width * 0.07} />
        <Skeleton width={'60%'} height={height * 0.02} radius={width * 0.07} />
      </View>
    </View>
  );
};

export default MiniUserSkeleton;

const styles = StyleSheet.create({});
