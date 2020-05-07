import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  ImageBackground,
  StyleSheet,
  View,
  Linking,
  SafeAreaView,
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
import {LoadingScreenProps} from '../../navigation/auth.navigator';
import {AppRoute} from '../../navigation/app-routes';

export const LoadingScreen = (props: LoadingScreenProps): LayoutElement => {
  AsyncStorage.getItem('token')
    .then((value) => {
      if (value) {
        console.log('Login check Succeess');
        AsyncStorage.setItem('userType', 'driver');
        {
          /*유저타입이 owner일 경우 화주 / driver 일 경우 화물차기사 입니다 테스트 시 사용하세요,  향후 이메일을 서버로 보내고 타입을 받아올 생각입니다*/
        }
        props.navigation.navigate(AppRoute.HOME);
      } else {
        console.log('Login check Failed');
        props.navigation.navigate(AppRoute.SIGN_IN);
      }
    })
    .catch((error: Error) => {
      console.log('???');
    });

  return (
    <React.Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <ImageBackground
        style={styles.appBar}
        source={require('../../assets/image-background.jpeg')}>
        <View style={styles.viewForm}>
          <Text style={styles.TextStyle}></Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnKakaoLogin: {
    width: 280,
    marginVertical: 10,
    backgroundColor: '#F8E71C',
    borderColor: '#F8E71C',
  },
  TextStyle: {},
});
