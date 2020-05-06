import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    StyleSheet,
    View,
    Linking,
    SafeAreaView,
    ScrollView
} from 'react-native';
import {
    Button,
    Layout,
    LayoutElement,
    Icon, Text, TopNavigation, TopNavigationAction, OverflowMenu,
    Divider,
  } from '@ui-kitten/components';
import { AppRoute } from '../navigation/app-routes';
import { BackIcon, MenuIcon, InfoIcon, LogoutIcon, MAPIcon, PHONEIcon, NOTEIcon} from '../assets/icons'
import { TopTapBarProps } from '../navigation/TopTabBarNavigator';
import auth from '@react-native-firebase/auth'
import KakaoLogins from '@react-native-seoul/kakao-login';

let email;
let nickname = 'unknown';
let userType;

AsyncStorage.getItem('email', (err, result) => { email = result });
AsyncStorage.getItem('nickname', (err, result) => { nickname = result });
AsyncStorage.getItem('userType', (err, result) => { userType = result });

export const TopTapBar = (props: TopTapBarProps): LayoutElement => {
    
    const [menuVisible, setMenuVisible] = React.useState(false);
    const menuData = [
        {
          title: `${nickname} 님 환영합니다`,
        },
        {
          title: '버전 정보 확인',
          icon: InfoIcon,
        },
        {
          title: '로그아웃',
          icon: LogoutIcon,
        },
    ];

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const kakaoLogout = () => {
        console.log('Logout Start');
        KakaoLogins.logout()
          .then(result => {
            console.log(`Logout Finished:${result}`);
          })
          .catch(err => {
            console.log(
              `Logout Failed:${err.code} ${err.message}`
            );
          });
    };
    
    const onMenuItemSelect = (index) => {
        setMenuVisible(false);
        console.log(index);
        if(index == 2){   {/*0,1,2 의 순서로 진행됩니다 로그 아웃 기능 구현*/}
            AsyncStorage.clear();
            kakaoLogout();
            auth().signOut;  
        
            props.navigation.push(AppRoute.AUTH);
            console.log("Logout Success");
        }
    };

    const renderMenuAction = () => (
        <OverflowMenu
          visible={menuVisible}
          data={menuData}
          onSelect={onMenuItemSelect}
          onBackdropPress={toggleMenu}>
          <TopNavigationAction
            icon={MenuIcon}
            onPress={toggleMenu}
          />
        </OverflowMenu>
    );

    return (
        <React.Fragment>
          <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
          <TopNavigation
            title='   화물 25'
            titleStyle={styles.titleStyles}
            rightControls={renderMenuAction()}
          />
          <Divider style={{backgroundColor: 'black'}}/>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    titleStyles: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});