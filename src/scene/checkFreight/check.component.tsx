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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export class CheckScreen extends React.Component<CheckScreenProps> {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      userType: null,
    };
  }

  componentDidMount = async () => {
    try {
      const value = await AsyncStorage.getItem('userType');
      if (value !== null) {
        this.setState({userType: value});
      }
    } catch (error) {}

    var user = auth().currentUser;
    const that = this;

    if (user != null) {
      //var ref = firestore().collection('freights');
      var ref = null;
      if (this.state.userType == 'driver') {
        ref = firestore()
          .collection('freights')
          .where('driverId', '==', user.uid);
      } else if ((this.state.userType = 'owner')) {
        ref = firestore()
          .collection('freights')
          .where('ownerId', '==', user.uid);
      }

      ref.get().then(async function (querySnapshot) {
        var list = [];

        for (var docCnt in querySnapshot.docs) {
          const doc = querySnapshot.docs[docCnt].data();
          console.log(docCnt + '번째 화물 id: ' + doc.id);

          var freightState = '';
          if (doc.state == 0) freightState = '배송전';
          else if (doc.state == 1) freightState = '배송중';
          else if (doc.state == 2) freightState = '배송완료';
          var docStartDate = new Date(doc.startDay._seconds * 1000);
          var docEndDate = new Date(doc.endDay._seconds * 1000);

          var startAddrArray = doc.startAddr.split(' ');
          var endAddrArray = doc.endAddr.split(' ');

          list.push({
            id: doc.id, // Freight key?
            lastState: freightState, // 0 -> 배송전, 1 -> 배송중, 2 -> 배송완료
            startAddress: doc.startAddr,
            endAddress: doc.endAddr,
            distance: doc.dist,
            lastRefresh: 'null',
            startMonth: docStartDate.getMonth() + 1,
            startDay: docStartDate.getDate(),
            endMonth: docEndDate.getMonth() + 1,
            endDay: docEndDate.getDate(),
            startAddrArray: startAddrArray,
            endAddrArray: endAddrArray,
            startDayLabel: doc.startDayLabel,
            endDayLabel: doc.endDayLabel,
          });
        }
        that.setState({data: list});
      });
    }
  };

  ClickList = (item) => () => {
    AsyncStorage.setItem('FreightID', item.id);
    if (this.state.userType == 'owner') {
      this.props.navigation.navigate(AppRoute.CHECK_DETAIL_OWNER);
    } else if (this.state.userType == 'driver') {
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
              {item.startMonth}월 {item.startDay}일 {item.startDayLabel}요일 -{' '}
              {item.endMonth}월 {item.endDay}일 {item.endDayLabel}요일
            </Text>
          </View>
        </View>
        <View style={styles.statusInfo}>
          {item.lastState == '배송전' ? (
            <Button
              style={styles.Badge}
              appearance="ghost"
              status="primary"
              textStyle={styles.badgeText}>
              {item.lastState}
            </Button>
          ) : (
            <Button
              style={styles.Badge}
              appearance="ghost"
              status="danger"
              textStyle={styles.badgeText}>
              {item.lastState}
            </Button>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <React.Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
        {/* <ScrollView> */}
        <FlatList
          style={{backgroundColor: 'white'}}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={(item) => item.key}
        />
        {/* </ScrollView> */}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  Badge: {
    width: RFPercentage(12),
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
    flex: 3.5,
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
