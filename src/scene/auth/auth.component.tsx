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
import {AuthScreenProps} from '../../navigation/auth.navigator';
import {AppRoute} from '../../navigation/app-routes';
import KakaoLogins from '@react-native-seoul/kakao-login';
import axios from 'axios';

if (!KakaoLogins) {
  console.error('Module is Not Linked');
}
const serverUrl = 'http://49.50.162.128:8000/';

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
      .then((result) => {
        let data = JSON.stringify(result);
        //uid 존재하는지 확인
        axios
          .post(serverUrl+"confirmUid", {token: JSON.stringify(result.accessToken)})
          .then((response) => {
            let uidRegistered = JSON.stringify(response.data.register);
            console.log("uidRegistered: "+uidRegistered);
             //등록 (true)
            if(uidRegistered == 'true'){
              //현재 인증된 auth() 갱신 필요

              //auth().onAuthStateChanged();
              //getProfile();
              //AsyncStorage.setItem('fbToken', JSON.stringify(firebaseToken));
              props.navigation.navigate(AppRoute.HOME);
            }
             //미등록 (false)
            else if(uidRegistered == 'false'){
              console.log(JSON.stringify(result.accessToken));
              //분기화면이 없어서 일단 드라이버 화면으로 가도록 해놓음
              //분기화면이 생길 시 각 분기화면에서 타입에 맞게 처리되도록 해야 함
              AsyncStorage.setItem('accessToken', JSON.stringify(result.accessToken));
              props.navigation.navigate(AppRoute.SIGNUP_DRIVER);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
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
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <ImageBackground
        style={styles.appBar}
        source={require('../../assets/image-background.jpeg')}>
        <View style={styles.viewForm}>
          <View style={styles.empty1} />
          <Button
            style={styles.btnKakaoLogin}
            status="basic"
            onPress={kakaoLogin}>
            카카오톡 로그인
          </Button>
          <Button
            appearance="ghost"
            status="basic"
            onPress={() => {
              props.navigation.navigate(AppRoute.SIGNUP);
            }}>
            회원가입
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty1: {
    marginVertical: 50,
  },
  btnKakaoLogin: {
    width: 280,
    marginVertical: 10,
    backgroundColor: '#F8E71C',
    borderColor: '#F8E71C',
  },
});
