import React from 'react';
import {StyleSheet, Text, View, ScrollView, Dimensions} from 'react-native';

import {Colors, pageView} from '../constants/Colors';
import Skeleton from '../Skeletons/Skeleton';

const {width, height} = Dimensions.get('window');

const HomeSkeleton = () => {
  return (
    <View style={[pageView, styles.container]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          <Skeleton
            width={width * 0.15}
            height={width * 0.15}
            radius={width * 0.075}
          />
          <Skeleton
            width={width * 0.5}
            height={width * 0.15}
            radius={width * 0.025}
          />
          <Skeleton
            width={width * 0.15}
            height={width * 0.15}
            radius={width * 0.025}
          />
        </View>
        <View style={[styles.row, styles.marginVertical]}>
          <Skeleton
            width={width * 0.2}
            height={height * 0.1}
            radius={width * 0.025}
          />
          <Skeleton
            width={width * 0.2}
            height={height * 0.1}
            radius={width * 0.025}
          />
          <Skeleton
            width={width * 0.2}
            height={height * 0.1}
            radius={width * 0.025}
          />
          <Skeleton
            width={width * 0.2}
            height={height * 0.1}
            radius={width * 0.025}
          />
        </View>
        <View style={styles.column}>
          <Skeleton
            width={width * 0.9}
            height={height * 0.3}
            radius={width * 0.025}
          />
          <Skeleton
            width={width * 0.9}
            height={height * 0.3}
            radius={width * 0.025}
          />
          <Skeleton
            width={width * 0.9}
            height={height * 0.3}
            radius={width * 0.025}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeSkeleton;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marginVertical: {
    marginVertical: height * 0.05,
  },
  column: {
    flexDirection: 'column',
    rowGap: height * 0.025,
    marginBottom: height * 0.025,
  },
});
