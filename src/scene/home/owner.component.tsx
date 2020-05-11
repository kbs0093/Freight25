import React, {useState} from 'react';
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
} from '@ui-kitten/components';
import {
  CommonActions,
  NavigationContainer,
  BaseRouter,
} from '@react-navigation/native';
import {OwnerScreenProps} from '../../navigation/home.navigator';
import {AppRoute} from '../../navigation/app-routes';
import {
  BackIcon,
  MenuIcon,
  InfoIcon,
  LogoutIcon,
  MAPIcon,
  PHONEIcon,
  NOTEIcon,
} from '../../assets/icons';
import auth from '@react-native-firebase/auth';
import KakaoLogins from '@react-native-seoul/kakao-login';

export class OwnerScreen extends React.Component <OwnerScreenProps> {

  clickButtonType = () => {
    this.props.navigation.navigate(AppRoute.APPLY)
  };

  clickCheck = () => {
    this.props.navigation.navigate(AppRoute.CHECK);
  };

  render(){    
    return (
      <React.Fragment>
        <ScrollView>
          <View style={styles.viewForm}>
            <TouchableOpacity onPress={this.clickButtonType}>
              <Image style={styles.Button} source={require('../../assets/ApplyButton.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.clickCheck}>
              <Image
                style={styles.Button}
                source={require('../../assets/CheckButton-round.png')}
              />
            </TouchableOpacity>
  
            <Button
              style={styles.IconButton}
              textStyle={styles.IconButtonText}
              status="basic"
              size="giant"
              icon={MAPIcon}>
              네비게이션으로 연결
            </Button>
            <Button
              style={styles.IconButton}
              textStyle={styles.IconButtonText}
              status="basic"
              size="giant"
              icon={PHONEIcon}>
              화주와 통화 연결
            </Button>
            <Button
              style={styles.IconButton}
              textStyle={styles.IconButtonText}
              status="basic"
              size="giant"
              icon={NOTEIcon}>
              이 달의 매출확인
            </Button>
            <View style={styles.empty} />
          </View>
        </ScrollView>
      </React.Fragment>
    );
  }
  
};

const styles = StyleSheet.create({
  viewForm: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  Button: {
    width: 355,
    height: 150,
    margin: 10,
    borderRadius: 5,
  },
  IconButton: {
    width: 355,
    height: 50,
    margin: 10,
  },
  IconButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  empty: {
    marginVertical: 20,
  },
});
