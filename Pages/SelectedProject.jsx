import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useData} from '../Context/Contexter';
import HeadingText from '../utils/HeadingText';
import {Colors} from '../constants/Colors';

const SelectedProject = () => {
  const {selectedProject} = useData();
  const {width, height} = Dimensions.get('window');
  //   console.log(selectedProject);
  //  {"Discount": true, "PaymentStatus": "pending", "Technologies": [{"Price": "100", "TechType": "Static", "Techs": [Array]}, {"Price": "200", "TechType": "Dynamic", "Techs": [Array]}], "img": "https://i.ibb.co/cQNpKqT/portfolio.png", "name": "Personal Portfolio", "status": "not started"}
  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      {/* header */}
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text={selectedProject?.name} />
      </View>
      {/* contect */}
      <View
        style={{
          borderWidth: 0,
          paddingHorizontal: 15,
          flexDirection: 'column',
          rowGap: 20,
        }}>
        <Image
          source={{uri: selectedProject?.img}}
          style={{width: width * 0.4, aspectRatio: 1, alignSelf: 'center'}}
        />
        <Text
          style={{
            fontSize: width * 0.03,
            lineHeight: 20,
            letterSpacing: 1,
            // fontWeight: '600',
            color: Colors.mildGrey,
          }}>
          Note! "If you purchase this project, our skilled software engineers
          will provide full support from scratch to completion. This project
          assets, including UI design, color schemes, and images, will be
          prepared and provided by our expert technicians once your payment is
          successfully processed. We're here to ensure a seamless and
          professional experience throughout your project journey!"
        </Text>
        {/* selct tech */}
        <Text
          style={{
            color: Colors.veryDarkGrey,
            fontWeight: '600',
            fontSize: width * 0.045,
          }}>
          Select your Technology
        </Text>
        <View>
          {selectedProject?.Technologies?.map((tech, index) => (
            <View
              key={index}
              style={{
                borderWidth: 0,
                padding: 15,
                marginBottom: 20,
                elevation: 5,
                backgroundColor: 'white',
              }}>
              <Text
                style={{
                  fontSize: width * 0.035,
                  letterSpacing: 1,
                  fontWeight: '600',
                  color: Colors.mildGrey,
                  marginBottom: 10,
                }}>
                Project Type: {tech?.TechType}
              </Text>
              {tech?.Techs?.map((tool, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: 'white',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: Colors.mildGrey,
                      letterSpacing: 1,
                      fontSize: width * 0.03,
                    }}>
                    {tool?.TechName}
                  </Text>
                  <Image
                    source={{uri: tool?.TechImg}}
                    style={{width: width * 0.06, aspectRatio: 1}}
                  />
                </View>
              ))}
              {/* price */}
              <Text
                style={{
                  fontWeight: '900',
                  //   color: 'orange',
                  letterSpacing: 1,
                  fontSize: width * 0.03,
                  marginBottom: 10,
                }}>
                Price Rs: {tech?.Price} /-
              </Text>
              <TouchableOpacity
                style={{
                  padding: 10,
                  //   borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  backgroundColor: Colors.violet,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    letterSpacing: 1,
                    fontSize: width * 0.035,
                    color: 'white',
                  }}>
                  Buy Now
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default SelectedProject;

const styles = StyleSheet.create({});
