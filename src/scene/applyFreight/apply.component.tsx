import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  StyleSheet,
  View,
  Linking,
  Platform,
  SafeAreaView,
} from 'react-native';
import {
  LayoutElement,
} from '@ui-kitten/components';
import { ApplyScreenProps } from '../../navigation/apply.navigator';
import { AppRoute } from '../../navigation/app-routes';



export const ApplyScreen = (props: ApplyScreenProps): LayoutElement => {
    return (
        <React.Fragment>
          <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
          <Text>
            화물 등록 화면입니다
          </Text>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({

});