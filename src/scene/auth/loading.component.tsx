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
import { LoadingScreenProps } from '../../navigation/auth.navigator';
import { AppRoute } from '../../navigation/app-routes';


export const LoadingScreen = (props: LoadingScreenProps): LayoutElement => {

  AsyncStorage.getItem("token")
    .then(value => {
      if (value) {
        console.log("Login check Succeess");
        props.navigation.navigate(AppRoute.SIGN_IN);
      } else {
        console.log("Login check Failed");
        props.navigation.navigate(AppRoute.SIGN_IN);
      }
    })
    .catch((error: Error) => {
      console.log("???");
  });
  
  return (
    <React.Fragment>
      <ImageBackground style={styles.appBar} source={require('../../assets/image-background.jpeg')}>
        <View style={styles.viewForm}>
          <Text>로그인 확인중입니다...</Text>
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
  btnKakaoLogin: {
    width: 280,
    marginVertical: 10,
    backgroundColor: '#F8E71C',
    borderColor: '#F8E71C',
  },
});
