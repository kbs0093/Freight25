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
import KakaoLogins from '@react-native-seoul/kakao-login';

if (!KakaoLogins) {
  console.error('Module is Not Linked');
}

const logCallback = (log, callback) => {
  console.log(log);
  callback;
};

const TOKEN_EMPTY = 'token has not fetched';
const PROFILE_EMPTY = {
  id: 'profile has not fetched',
  email: 'profile has not fetched',
  profile_image_url: '',
};

export const AuthScreen = (props: AuthScreenProps): LayoutElement => {
  const [token, setToken] = useState(TOKEN_EMPTY);
  const [profile, setProfile] = useState(PROFILE_EMPTY);

  const [loginLoading, setLoginLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const kakaoLogin = () => {
    logCallback('Login Start', setLoginLoading(true));

    KakaoLogins.login()
      .then(result => {
        let data = JSON.stringify(result);
        logCallback(
          `Login Finished:${data}`,
          setLoginLoading(false),
        );
        //AsyncStorage.setItem("token", data);
        props.navigation.navigate(AppRoute.HOME);
      })
      .catch(err => {
        if (err.code === 'E_CANCELLED_OPERATION') {
          logCallback(`Login Cancelled:${err.message}`, setLoginLoading(false));
        } else {
          logCallback(
            `Login Failed:${err.code} ${err.message}`,
            setLoginLoading(false),
          );
        }
      });
  };

  return (
    <React.Fragment>
      <ImageBackground style={styles.appBar} source={require('../../assets/image-background.jpeg')}>
        <View style={styles.viewForm}>
        <View style={styles.empty1} />
         <Button style={styles.btnKakaoLogin} status='basic' onPress={kakaoLogin}>
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
