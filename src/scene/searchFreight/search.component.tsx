import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Linking,
  Platform,
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  LayoutElement,
} from '@ui-kitten/components';
import { SearchScreenProps } from '../../navigation/search.navigator';
import { AppRoute } from '../../navigation/app-routes';

const myHtmlFile = require('../../component/tmap.html');
const isAndroid = Platform.OS==='android'

export const SearchScreen = (props: SearchScreenProps): LayoutElement => {
    return (
        <React.Fragment>
          <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
          <Text>화물 검색화면입니다</Text>
          {/*<WebView source={{uri:isAndroid?'file:///android_asset/tmap.html':'./tmap.html'}}></WebView>*/}
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    viewForm: {
      flex: 4,
      justifyContent: "center",
      alignItems: "center",
    },
});