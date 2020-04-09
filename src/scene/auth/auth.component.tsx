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
import { AuthScreenProps } from '../../navigation/auth.navigator';
import { AppRoute } from '../../navigation/app-routes';

export const AuthScreen = (props: AuthScreenProps): LayoutElement => {
  return (
    <React.Fragment>
      <ImageBackground style={styles.appBar} source={require('../../assets/image-background.jpeg')}>
        <View style={styles.viewForm}>
        <View style={styles.empty1} />
         <Button style={styles.btnKakaoLogin} status='basic'>
            카카오톡 로그인
         </Button>        
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
  empty1:{
    marginVertical: 50,
  },
  btnKakaoLogin: {
    width: 280,
    marginVertical: 10,
    backgroundColor: '#F8E71C',
    borderColor: '#F8E71C',
  },
});
