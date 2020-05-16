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
import {Icon, LayoutElement, Divider, Button} from '@ui-kitten/components';
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
import AsyncStorage from '@react-native-community/async-storage';

let userType;

AsyncStorage.getItem('userType', (err, result) => {
  userType = result;
});

export class CheckScreen extends React.Component<CheckScreenProps> {
  state = [
    {
      key: 'A1234567', // Freight key?
      lastState: '배송전', // 0 -> 배송전, 1 -> 배송중, 2 -> 배송완료
      latitude: 'unknown',
      longitude: 'unknown',
      startAddress: '경기 군포',
      endAddress: '제주 서귀포',
      distance: '',
      lastRefresh: 'null',
      startDate: '당상', // 배송 출발 날짜
      endDate: '내착',
    },
  ];

  ClickList = (index) => () => {
    //AsyncStorage.setItem('Freight', index);

    if (userType == 'owner') {
      this.props.navigation.navigate(AppRoute.CHECK_DETAIL_OWNER);
    } else if (userType == 'driver') {
      this.props.navigation.navigate(AppRoute.CHECK_DETAIL_DRIVER);
    } else {
      console.log('undefined usertype');
    }
  };

  _renderItem = ({item}) => (
    <TouchableOpacity onPress={this.ClickList(item)}>
      <View style={styles.container}>
        <View style={styles.geoContainer}>
          <View style={styles.geoInfo1}>
            <View style={styles.geoInfo11}>
              <Text style={styles.geoText}>{item.startAddress}</Text>
            </View>
            <View style={styles.geoInfo12}>
              <Icon
                style={styles.icon}
                fill="#8F9BB3"
                name="arrow-forward-outline"
              />
            </View>
            <View style={styles.geoInfo11}>
              <Text style={styles.geoText}>{item.endAddress}</Text>
            </View>
          </View>
          <View style={styles.geoInfo1}>
            <Text style={styles.timeText}>
              출발 {item.start_month} 월 {item.start_day} 일 - 도착{' '}
              {item.end_month} 월 {item.end_day} 일
            </Text>
          </View>
        </View>
        <View style={styles.statusInfo}>
          <Button style={styles.Badge} textStyle={styles.badgeText}>
            {item.lastState}
          </Button>
        </View>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <React.Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
        <ScrollView>
          <FlatList
            style={{backgroundColor: 'white'}}
            data={this.state}
            renderItem={this._renderItem}
            keyExtractor={(item) => item.key}
          />
        </ScrollView>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  Badge: {
    width: RFPercentage(10),
    height: RFPercentage(4),
    borderRadius: 8,
  },
  badgeText: {
    fontSize: RFPercentage(1.6),
  },
  container: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
  },
  geoContainer: {
    flex: 4,
    flexDirection: 'column',
  },
  geoInfo1: {
    paddingVertical: 3,
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  geoText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: RFPercentage(3),
  },
  timeText: {
    fontWeight: 'bold',
    fontSize: RFPercentage(2.5),
  },
  geoInfo11: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 2,
  },
  geoInfo12: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  statusInfo: {
    paddingVertical: 15,
    flex: 1,
    alignItems: 'center',
    height: '20%',
  },
  icon: {
    width: 32,
    height: 32,
  },
});
