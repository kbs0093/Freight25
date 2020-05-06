import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  Linking,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  LayoutElement,
  TopNavigationAction,
  TopNavigation,
  OverflowMenu,
  Button,
  styled,
  Icon,
} from '@ui-kitten/components';
import {CheckScreenProps} from '../../navigation/check.navigator';
import {MainScreenProps} from '../../navigation/home.navigator';
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
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

export const CheckScreen = (props: CheckScreenProps): LayoutElement => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const menuData = [
    {
      title: '버전 정보 확인',
      icon: InfoIcon,
    },
    {
      title: '개인 정보 수정',
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

  const onMenuItemSelect = (index) => {
    setMenuVisible(false);
    if (index == 1) {
      {
        /*0,1,2 의 순서로 진행됩니다 로그 아웃 기능 구현*/
      }
      //auth().signOut;
      props.navigation.navigate(AppRoute.PROFILE);
      console.log('Logout Success');
    }
  };

  const renderMenuAction = () => (
    <OverflowMenu
      visible={menuVisible}
      data={menuData}
      onSelect={onMenuItemSelect}
      onBackdropPress={toggleMenu}>
      <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
    </OverflowMenu>
  );

  const renderBadge = () => (
    <Button style={styles.Badge} textStyle={styles.badgeText}>
      배송중
    </Button>
  );

  return (
    <React.Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <TopNavigation
        title="화물 25"
        titleStyle={styles.titleStyles}
        rightControls={renderMenuAction()}
      />
      <View style={styles.freightContainer}>
        <Text style={styles.Subtitle}>나의 배차</Text>
        <Button size="small" style={styles.Badge} textStyle={styles.badgeText}>
          배송중
        </Button>
      </View>
      <View style={styles.geoContainer}>
        <View style={styles.geoInfoContainer}>
          <Text style={styles.geoText}>대전 서구</Text>
          <Text style={styles.geoSubText}>당착</Text>
        </View>
        <View style={styles.geoInfoContainer}>
          <Icon
            style={styles.iconSize}
            fill="#8F9BB3"
            name="arrow-forward-outline"
          />
        </View>
        <View style={styles.geoInfoContainer}>
          <Text style={styles.geoText}>대전 서구</Text>
          <Text style={styles.geoSubText}>당착</Text>
        </View>
      </View>
      <View style={styles.freightInfoContainer}>
        <View style={styles.freightInfoHalfContainer}>
          <Text style={styles.infoTitle}>운행 거리</Text>
          <Text style={styles.infoTitle}>KM / 가격</Text>
          <Text style={styles.infoTitle}>남은 시각</Text>
          <Text style={styles.infoTitle}>상차지 주소</Text>
        </View>
        <View style={styles.freightInfoHalfContainer}>
          <Text style={styles.infoTitle}>운행 거리</Text>
        </View>
      </View>
      <View style={styles.lineStyle} />
      <View style={styles.freightContainer}>
        <Text style={styles.Subtitle}>경유지 화물</Text>
        <Button size="small" style={styles.Badge} textStyle={styles.badgeText}>
          배송중
        </Button>
      </View>
      <View style={styles.geoContainer}>
        <View style={styles.geoInfoContainer}>
          <Text style={styles.geoText}>대전 서구</Text>
          <Text style={styles.geoSubText}>당착</Text>
        </View>
        <View style={styles.geoInfoContainer}>
          <Icon
            style={styles.iconSize}
            fill="#8F9BB3"
            name="arrow-forward-outline"
          />
        </View>
        <View style={styles.geoInfoContainer}>
          <Text style={styles.geoText}>대전 서구</Text>
          <Text style={styles.geoSubText}>당착</Text>
        </View>
      </View>
      <View style={styles.freightInfoContainer}>
        <View style={styles.freightInfoHalfContainer}>
          <Text style={styles.infoTitle}>운행 거리</Text>
          <Text style={styles.infoTitle}>KM / 가격</Text>
          <Text style={styles.infoTitle}>남은 시각</Text>
          <Text style={styles.infoTitle}>상차지 주소</Text>
        </View>
        <View style={styles.freightInfoHalfContainer}>
          <Text style={styles.infoTitle}>운행 거리</Text>
        </View>
      </View>
      <View style={styles.lineStyle} />
      <View style={styles.totalInfoContainer}>
        <Text style={styles.infoTitle}>총 운행 거리</Text>
        <Text style={styles.infoTitle}>총 운행 운임</Text>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  viewForm: {
    fontSize: RFPercentage(2),
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  Badge: {
    width: RFPercentage(10),
    height: RFPercentage(0.5),
    borderRadius: 8,
  },
  badgeText: {
    fontSize: RFPercentage(1.8),
  },
  titleStyles: {
    paddingHorizontal: 20,
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
  },
  Subtitle: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
  },
  freightContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderColor: '#20232a',
  },
  freightInfoContainer: {
    flex: 0.5,
    flexDirection: 'row',
    paddingVertical: 20,
    alignItems: 'flex-start',
    borderColor: '#20232a',
    //borderWidth: 1,
  },
  freightInfoHalfContainer: {
    flex: 1,
  },
  infoTitle: {
    paddingVertical: 2,
    paddingHorizontal: 60,
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
  },
  geoContainer: {
    paddingVertical: 20,
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  geoInfoContainer: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1,
  },
  geoText: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
  },
  geoSubText: {
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
  },
  totalInfoContainer: {
    paddingVertical: 20,
    flex: 0.8,
    borderColor: '#20232a',
    //borderWidth: 1,
  },
  totalInfoText: {
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  iconSize: {
    width: 32,
    height: 32,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: 10,
  },
});
