import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Image,
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  PanResponder,
} from 'react-native';
import {
  Input,
  InputElement,
  InputProps,
  Button,
  CheckBox,
  Layout,
  LayoutElement,
  Icon,
  Text,
  TopNavigation,
  TopNavigationAction,
  OverflowMenu,
  ViewPager
} from '@ui-kitten/components';

import {StopoverADScreenProps} from '../../navigation/home.navigator';
import {AppRoute} from '../../navigation/app-routes';

import auth from '@react-native-firebase/auth';
import KakaoLogins from '@react-native-seoul/kakao-login';

export const StopoverADScreen = (props: StopoverADScreenProps): LayoutElement => {

  const ApplyButton = () => {
    props.navigation.navigate(AppRoute.SEARCH);
  };

  const DenyButton = () => {
    props.navigation.navigate(AppRoute.CHECK);
  };

  return (
    <React.Fragment>
      
    </React.Fragment>
  );
  
  
};

const styles = StyleSheet.create({

});
