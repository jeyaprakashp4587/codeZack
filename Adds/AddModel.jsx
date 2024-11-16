import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../constants/Colors';

const AddModel = ({loading}) => {
  return (
    <View style={{flex: 1}}>
      {/* Loading Modal */}
      <Modal transparent={true} visible={true} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              alignItems: 'center',
              flexDirection: 'column',
              rowGap: 10,
            }}>
            <ActivityIndicator size="large" color={Colors.mildGrey} />
            <Text>Loading Ad...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddModel;

const styles = StyleSheet.create({});
