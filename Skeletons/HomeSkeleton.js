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
            height={height * 0.073}
            radius={width * 0.075}
          />
          <View style={{flexDirection: 'row', columnGap: 10}}>
            <Skeleton width={width * 0.12} height={height * 0.06} radius={50} />
          </View>
        </View>
        {/* row */}
        <View style={{marginTop: 10, flexDirection: 'column', rowGap: 10}}>
          <Skeleton width="100%" height={height * 0.03} radius={width * 0.25} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            // borderWidth: 1,
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginVertical: 10,
            alignItems: 'center',
          }}>
          <Skeleton
            width={width * 0.4}
            height={height * 0.1}
            radius={width * 0.025}
          />
          <Skeleton
            width={width * 0.4}
            height={height * 0.1}
            radius={width * 0.025}
          />
          <Skeleton
            width={width * 0.4}
            height={height * 0.1}
            radius={width * 0.025}
          />
          <Skeleton
            width={width * 0.4}
            height={height * 0.1}
            radius={width * 0.025}
          />
        </View>
        <View style={styles.column}>
          <Skeleton
            width={'100%'}
            height={height * 0.3}
            radius={width * 0.025}
          />
          <Skeleton
            width={'100%'}
            height={height * 0.3}
            radius={width * 0.025}
          />
          <Skeleton
            width={'100%'}
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
