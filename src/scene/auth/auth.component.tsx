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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

if (!KakaoLogins) {
  console.error('Module is Not Linked');
}
const verifyUrl = 'http://49.50.162.128:8000/verifyToken';

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

  const getProfile = () => {
    logCallback('Get Profile Start', setProfileLoading(true));

    KakaoLogins.getProfile()
      .then((result) => {
        setProfile(result);
        logCallback(`Get Profile Finished`, setProfileLoading(true));
        AsyncStorage.setItem('email', JSON.stringify(result.email));
        AsyncStorage.setItem('nickname', JSON.stringify(result.nickname));
        AsyncStorage.setItem('userType', 'driver');
        {
          /*유저타입이 owner일 경우 화주 / driver 일 경우 화물차기사 입니다 테스트 시 사용하세요,  향후 이메일을 서버로 보내고 타입을 받아올 생각입니다*/
        }
      })
      .catch((err) => {
        logCallback(
          `Get Profile Failed:${err.code} ${err.message}`,
          setProfileLoading(false),
        );
      });
  };

  const kakaoLogin = () => {
    logCallback('Login Start', setLoginLoading(true));

    KakaoLogins.login()
      .then((result) => {
        let data = JSON.stringify(result);

        //firebase jwt
        axios
          .post(verifyUrl, {token: JSON.stringify(result.accessToken)})
          .then((response) => {
            let firebaseToken = JSON.stringify(response.data.firebase_token);
            auth().signInWithCustomToken(firebaseToken);
            logCallback(`Login Finished:${data}`, setLoginLoading(false));
            getProfile();
            AsyncStorage.setItem('token', JSON.stringify(firebaseToken));
            props.navigation.navigate(AppRoute.HOME);
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
              props.navigation.navigate(AppRoute.SIGNUP_DRIVER);
            }}>
            화물차 기사 회원가입
          </Button>
          <Button
            appearance="ghost"
            status="basic"
            onPress={() => {
              props.navigation.navigate(AppRoute.SIGNUP_OWNER);
            }}>
            화주 회원가입
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
