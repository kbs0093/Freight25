import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  ImageBackground,
  StyleSheet,
  View,
  Linking,
} from 'react-native';
import {
  Input,
  InputElement,
  InputProps,
  Button,
  CheckBox,
  Layout,
  LayoutElement,
} from '@ui-kitten/components';
import { MainScreenProps } from '../../navigation/home.navigator';
import { AppRoute } from '../../navigation/app-routes';

export const MainScreen = (props: MainScreenProps): LayoutElement => {
    return (
        <React.Fragment>
          <ImageBackground style={styles.appBar} source={require('../../assets/image-background.jpeg')}>
            <View style={styles.viewForm}>
             <Text>메인스크린입니다</Text>
            </View>
          </ImageBackground>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    appBar: {
      flex: 1,
    },
    viewForm: {
      flex: 4,
      justifyContent: "center",
      alignItems: "center",
    },
});