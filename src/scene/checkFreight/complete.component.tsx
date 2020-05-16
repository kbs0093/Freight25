import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
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
//import {ScrollView} from 'react-native-gesture-handler';

export class DetailCheckScreen extends React.Component<DetailCheckScreenProps> {
  state = [
    {
      key: 'A1234567', // Freight key?
      lastState: '배송전', // 0 -> 배송전, 1 -> 배송중, 2 -> 배송완료
      latitude: 'unknown',
      longitude: 'unknown',
      //lastRefresh: 'null',
      dist: '1234',
      expense: '1234',
      startAddress: '경기 군포',
      endAddress: '제주 서귀포',
      startDate: '당상', // 배송 출발 날짜
      endDate: '내착',
    },
    {
      key: 'A1234568', // Freight key?
      lastState: '배송전', // 0 -> 배송전, 1 -> 배송중, 2 -> 배송완료
      latitude: 'unknown',
      longitude: 'unknown',
      //lastRefresh: 'null',
      dist: '1234',
      expense: '1234',
      startAddress: '경기 군포',
      endAddress: '제주 서귀포',
      startDate: '당상', // 배송 출발 날짜
      endDate: '내착',
    },
  ];

  _renderItem = ({item}) => (
    <View>
      <View style={styles.freightContainer}>
        <Text style={styles.Subtitle}>화물 내역</Text>
        <Button style={styles.Badge} textStyle={styles.badgeText}>
          {item.lastState}
        </Button>
      </View>
      <View style={styles.geoContainer}>
        <View style={styles.geoInfoContainer}>
          <Text style={styles.geoText}>{item.startAddress} </Text>
          <Text style={styles.geoSubText}>{item.startDate}</Text>
        </View>
        <View style={styles.geoInfoContainer}>
          <Icon
            style={styles.iconSize}
            fill="#8F9BB3"
            name="arrow-forward-outline"
          />
        </View>
        <View style={styles.geoInfoContainer}>
          <Text style={styles.geoText}>{item.endAddress}</Text>
          <Text style={styles.geoSubText}>{item.endDate}</Text>
        </View>
      </View>

      <View style={styles.freightInfoContainer}>
        <View style={styles.freightInfoHalfContainer}>
          <Text style={styles.infoTitle}>운행 거리</Text>
          <Text style={styles.infoTitle}>배차 날짜</Text>
          <Text style={styles.infoTitle}>운행 운임</Text>
          <Text style={styles.infoTitle}>상차지 주소</Text>
          <Text style={styles.infoTitle}>하차지 주소</Text>
          <Text style={styles.infoTitle}>화주 이름</Text>
          <Text style={styles.infoTitle}>화주 연락처</Text>
        </View>
        <View style={styles.freightInfoHalfContainer}>
          <Text style={styles.infoTitle}>{item.dist} KM</Text>
          <Text style={styles.infoTitle}>2020년 5월 12일</Text>
          <Text style={styles.infoTitle}>{item.expense} 원</Text>
          <Text style={styles.infoTitle}>{item.startAddress}</Text>
          <Text style={styles.infoTitle}>{item.endAddress}</Text>
          <Text style={styles.infoTitle}>홍길동</Text>
          <Text style={styles.infoTitle}>01018181818</Text>
        </View>
      </View>
      <View style={styles.lineStyle} />
    </View>
  );

  render() {
    return (
      <React.Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
        <FlatList
          style={{backgroundColor: 'white'}}
          data={this.state}
          renderItem={this._renderItem}
          keyExtractor={(item) => item.key}
        />
        <View style={styles.totalInfoContainer}>
          <View style={styles.totalInfoHalfContainer}>
            <Text style={styles.infoTitle}>총 운행 거리</Text>
            <Text style={styles.infoTitle}>총 운행 운임</Text>
          </View>
          <View style={styles.totalInfoHalfContainer}>
            <Text style={styles.infoTitle}>
              {parseInt(this.state[0].dist) + parseInt(this.state[1].dist)} KM
            </Text>
            <Text style={styles.infoTitle}>
              {parseInt(this.state[0].expense) +
                parseInt(this.state[1].expense)}{' '}
              원
            </Text>
          </View>
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
    paddingVertical: 5,
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  freightInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'flex-start',
    borderColor: '#20232a',
  },
  freightInfoHalfContainer: {
    flex: 1,
  },
  geoContainer: {
    paddingVertical: 10,
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
    paddingHorizontal: 40,
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  totalInfoContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flex: 10,
    borderColor: '#20232a',
  },
  totalInfoHalfContainer: {
    backgroundColor: 'white',
    flex: 1,
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
