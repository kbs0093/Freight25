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
  Icon,
  Button,
} from '@ui-kitten/components';
import {DetailCheckScreenProps} from '../../navigation/check.navigator';
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

export class DetailCheckScreen extends React.Component<DetailCheckScreenProps> {
  render() {
    return (
      <React.Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />

        <View style={styles.freightContainer}>
          <Text style={styles.Subtitle}>나의 배차</Text>
          <Button style={styles.Badge} textStyle={styles.badgeText}>
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
          <Button style={styles.Badge} textStyle={styles.badgeText}>
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
  }
}

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
    alignItems: 'flex-start',
    borderColor: '#20232a',
    paddingVertical: 8,
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  freightInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 20,
    alignItems: 'flex-start',
    borderColor: '#20232a',
  },
  freightInfoHalfContainer: {
    flex: 1,
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
  infoTitle: {
    paddingVertical: 2,
    paddingHorizontal: 60,
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  totalInfoContainer: {
    paddingVertical: 20,
    flex: 0.8,
    borderColor: '#20232a',
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
