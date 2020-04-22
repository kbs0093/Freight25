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
import { HistoryScreenProps } from '../../navigation/search.navigator';
import { AppRoute } from '../../navigation/app-routes';

export const HistoryScreen = (props: HistoryScreenProps): LayoutElement => {
    return (
        <React.Fragment>
          <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
          <Text>
            화물 히스토리 화면입니다
          </Text>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({

});