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
import { WebView } from 'react-native-webview';
import { DetailScreenProps } from '../../navigation/search.navigator';
import { AppRoute } from '../../navigation/app-routes';

const myHtmlFile = require('../../component/tmap.html');
const isAndroid = Platform.OS ==='android'

export const DetailScreen = (props: DetailScreenProps): LayoutElement => {
    return (
        <React.Fragment>
          <WebView 
            source={{uri:isAndroid?'file:///android_asset/tmap.html':'./external/tmap.html'}}
            
          />
        </React.Fragment>
    );
};

const styles = StyleSheet.create({

});