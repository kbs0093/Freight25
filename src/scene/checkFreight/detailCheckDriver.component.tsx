import React, {useState, Fragment} from 'react';
import {
  Text,
  PermissionsAndroid,
  StyleSheet,
  View,
  NativeModules,
  SafeAreaView,
  FlatList,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {Icon, Button, Divider} from '@ui-kitten/components';
import {DetailCheckDriverScreenProps} from '../../navigation/check.navigator';
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
import AsyncStorage from '@react-native-community/async-storage';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import ViewPager from '@react-native-community/viewpager';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-tiny-toast';
import Geolocation from 'react-native-geolocation-service';

const phoneIcon = (style) => <Icon {...style} name="phone-outline" />;
const naviIcon = (style) => <Icon {...style} name="compass-outline" />;
const plusIcon = (style) => <Icon {...style} name="plus-outline" />;
const homeIcon = (style) => <Icon {...style} name="home-outline" />;
const cartIcon = (style) => <Icon {...style} name="shopping-cart-outline" />;
const carIcon = (style) => <Icon {...style} name="car-outline" />;

const isAndroid = Platform.OS === 'android';
const tmapRouteURL =
  'https://apis.openapi.sk.com/tmap/app/routes?appKey=l7xxce3558ee38884b2da0da786de609a5be';
const DirectSms = NativeModules.DirectSms;

export class DetailCheckDriverScreen extends React.Component<
  DetailCheckDriverScreenProps
> {
  // The number of frieght information from 'driver' could be more than one.
  constructor(props) {
    super(props);
    this.state = {
      FreightID: null,
      OppoFreightID: null,
      data: [],
      addiData: {
        lastState: null, // 0 -> 배송중, 1 -> 배송완료
        dist: null,
        expense: null,
        ownerId: null,
        ownerTel: null,
        oppositeFreightId: null,
        startAddrNoSpace: null,
        endAddrNoSpace: null,
      },
      latitude: 'unknown',
      longitude: 'unknown',
    };
  }

  sendDirectSms = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
          {
            title: 'Freight25 App Sms Permission',
            message:
              'Freight25 App needs access to your inbox ' +
              'so you can send messages in background.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          DirectSms.sendDirectSms(
            this.state.addiData.recvTel,
            'Signup process completed! ' + this.state.addiData.recvName,
          );
          console.log('SMS sent successfully');
        } else {
          console.log('SMS permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      console.log('Send message');
      console.log(this.state.addiData.recvTel);

      const url = `sms:${this.state.addiData.recvTel}${
        Platform.OS === 'ios' ? '&' : '?'
      }body=${'signup process completed! ' + this.state.addiData.recvName}`;
      Linking.openURL(url).catch((err) =>
        console.error('An error occurred', err),
      );
    }
  };

  requestLocationAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            let latitude = JSON.stringify(position.coords.latitude);
            let longitude = JSON.stringify(position.coords.longitude);
            this.setState({latitude: latitude});
            this.setState({longitude: longitude});
          },
          (error) => Alert.alert('Error', JSON.stringify(error)),
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  };

  requestLocationIos = () => {
    var latitude;
    var longitude;

    Geolocation.getCurrentPosition(
      (position) => {
        latitude = JSON.stringify(position.coords.latitude);
        longitude = JSON.stringify(position.coords.longitude);
        this.setState({latitude: latitude});
        this.setState({longitude: longitude});
      },
      (error) => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  componentDidMount = async () => {
    isAndroid ? this.requestLocationAndroid() : this.requestLocationIos();

    try {
      const value = await AsyncStorage.getItem('FreightID');
      if (value !== null) {
        this.setState({FreightID: value});
      }
    } catch (error) {}
    try {
      const value = await AsyncStorage.getItem('OppoFreightID');
      if (value !== null) {
        this.setState({OppoFreightID: value});
      }
    } catch (error) {}

    var user = auth().currentUser;
    const that = this;

    if (user != null) {
      var docRef = firestore().collection('freights').doc(this.state.FreightID);

      // Get the selected(original) freight info from Firebase.
      docRef.get().then(function (doc) {
        var list = [];

        if (doc.exists) {
          const docs = doc.data();
          console.log('Document data:', docs.id);

          var freightState = '';
          var startAddrArray = docs.startAddr.split(' ');
          var endAddrArray = docs.endAddr.split(' ');
          var startAddrFullArray = docs.startAddr_Full.split(' ');
          var endAddrFullArray = docs.endAddr_Full.split(' ');

          var i = 2,
            j = 2;
          var startAddrDetail = '';
          var endAddrDetail = '';
          for (i = 3; i < startAddrFullArray.length; i++) {
            startAddrDetail += startAddrFullArray[i] + ' ';
          }
          for (j = 3; j < endAddrFullArray.length; j++) {
            endAddrDetail += endAddrFullArray[j] + ' ';
          }

          if (docs.state == 0) freightState = '배송전';
          else if (docs.state == 1) freightState = '배송중';
          else if (docs.state == 2) freightState = '배송완료';

          var docStartDate = new Date(docs.timeStampAssigned._seconds * 1000);
          //var docEndDate = new Date(docs.endDay._seconds * 1000);

          list.push({
            key: docs.id,
            lastState: freightState, // 0 -> 배송전, 1 -> 배송중, 2 -> 배송완료
            dist: docs.dist,
            startDate: docs.startDate, // 배송 출발 날짜 -> UI 고치기
            endDate: docs.endDate,
            expense: docs.expense,
            startAddress: docs.startAddr,
            endAddress: docs.endAddr,
            startAddrFullArray: startAddrFullArray,
            endAddrFullArray: endAddrFullArray,
            startAddrArray: startAddrArray,
            endAddrArray: endAddrArray,
            startAddrDetail: startAddrDetail,
            endAddrDetail: endAddrDetail,

            startMonth: docStartDate.getMonth() + 1,
            startDay: docStartDate.getDate(),
            // endMonth: docEndDate.getMonth() + 1,
            startDayLabel: doc.startDayLabel,
            driveOption: docs.driveOption,

            ownerTel: docs.ownerTel,
            ownerName: docs.ownerName,
            desc: docs.desc,
          });

          var startAddrNoSpace = docs.startAddr.replace(/\s/g, '');
          var endAddrNoSpace = docs.endAddr.replace(/\s/g, '');
          var addiData = {
            lastState: freightState,
            dist: docs.dist,
            expense: docs.expense,
            ownerId: docs.ownerId,
            ownerTel: docs.ownerTel,
            recvName: docs.recvName,
            recvTel: docs.recvTel,
            oppositeFreightId: docs.oppositeFreightId,
            startAddrNoSpace: startAddrNoSpace,
            endAddrNoSpace: endAddrNoSpace,
          };
          that.setState({addiData: addiData});
          that.setState({data: list});
        } else {
          console.log('No such document!');
        }
      });
    }
  };

  invokeTmap = (num) => {
    if (num == 1) {
      // Route to start address
      Linking.openURL(
        tmapRouteURL +
          `&name=${this.state.addiData.startAddrNoSpace}&lat=${this.state.latitude}&lon=${this.state.longitude}`,
      );
    } else if (num == 2) {
      // Route to end address
      Linking.openURL(
        tmapRouteURL +
          `&name=${this.state.addiData.endAddrNoSpace}&lat=${this.state.latitude}&lon=${this.state.longitude}`,
      );
    }
  };

  navHandler = () => {
    Alert.alert(
      '내비게이션 연결',
      '연결 하시겠습니까?',
      [
        {text: '상차지 경로', onPress: () => this.invokeTmap(1)},
        {text: '하차지 경로', onPress: () => this.invokeTmap(2)},
        {
          text: 'Cancel',
          onPress: () => console.log('canceled'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  callOwner = () => {
    console.log('Call to the owner');
    console.log(this.state.addiData.ownerTel);
    Linking.openURL(`tel:${this.state.addiData.ownerTel}`);
  };

  setComplete = () => {
    this.sendDirectSms();
    console.log('운송 완료');
    try {
      var ref = firestore().collection('freights').doc(this.state.FreightID);
      ref.update({
        state: 2,
      });
    } catch (error) {}
    Toast.showSuccess('운송 완료');
    this.props.navigation.navigate(AppRoute.HOME);
  };

  _twoOptionAlertHandler = () => {
    //function to make two option alert
    Alert.alert(
      //title
      '운송 완료',
      //body
      '운송 완료 하시겠습니까?',
      [
        {text: '네', onPress: () => this.setComplete()},
        {
          text: '취소',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
  };

  _showStopoverFreight = () => {
    if (this.state.addiData.oppositeFreightId != null) {
      this.props.navigation.navigate(AppRoute.CHECK_DETAIL_STOPOVER);
    } else {
      Toast.show('경유지 화물이 없습니다');
    }
  };

  _renderItem = ({item}) => (
    <View>
      <View style={styles.freightContainer}>
        <Text style={styles.Subtitle}>화물 내역</Text>
        {item.lastState == '배송중' ? (
          <Button
            style={styles.Badge}
            appearance="outline"
            status="danger"
            icon={carIcon}
            textStyle={styles.badgeText}>
            {item.lastState}
          </Button>
        ) : (
          <Button
            style={styles.Badge}
            appearance="outline"
            textStyle={styles.badgeText}>
            {item.lastState}
          </Button>
        )}
      </View>
      <View style={styles.geoContainer}>
        <View style={styles.geoInfoContainer}>
          <Text style={styles.geoText}>
            {item.startAddrArray[0]} {item.startAddrArray[1]}{' '}
          </Text>
          <Text style={styles.geoText}>{item.startAddrArray[2]} </Text>
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
          <Text style={styles.geoText}>
            {item.endAddrArray[0]} {item.endAddrArray[1]}
          </Text>
          <Text style={styles.geoText}>{item.endAddrArray[2]}</Text>
          <Text style={styles.geoSubText}>{item.endDate}</Text>
        </View>
      </View>
      <Divider style={{backgroundColor: 'black'}} />
      <View style={styles.freightInfoTotalContainer}>
        <View style={styles.freightInfoHalfContainer}>
          <Text style={styles.infoTitle}>배차 날짜:</Text>
          <Text style={styles.infoTitle}>운행 거리:</Text>
          <Text style={styles.infoTitle}>운행 운임:</Text>
          <Text style={styles.infoTitle}>상차지 주소:{'\n'}</Text>
          <Text style={styles.infoTitle}>하차지 주소:{'\n'}</Text>
          <Text style={styles.infoTitle}>화주 이름:</Text>
          <Text style={styles.infoTitle}>화주 연락처:</Text>
          <Text style={styles.infoTitle}>화물 설명:</Text>
        </View>
        <View style={styles.freightInfoHalfRightContainer}>
          <Text style={styles.infoRightTitle}>
            {item.startMonth}월 {item.startDay}일
          </Text>
          <Text style={styles.infoRightTitle}>{item.dist} KM</Text>
          <Text style={styles.infoRightTitle}>{item.expense} 원</Text>
          <Text style={styles.infoRightTitle}>
            {item.startAddrFullArray[0]} {item.startAddrFullArray[1]}{' '}
            {item.startAddrFullArray[2]} {'\n'}
            {item.startAddrDetail}
          </Text>
          <Text style={styles.infoRightTitle}>
            {item.endAddrFullArray[0]} {item.endAddrFullArray[1]}{' '}
            {item.endAddrFullArray[2]} {'\n'}
            {item.endAddrDetail}
          </Text>
          <Text style={styles.infoRightTitle}>{item.ownerName}</Text>
          <Text style={styles.infoRightTitle}>{item.ownerTel}</Text>
          <Text style={styles.infoRightTitle}>{item.desc}</Text>
        </View>
      </View>
      <Divider style={{backgroundColor: 'black'}} />
    </View>
  );

  render() {
    let navButton;
    let completeButton;
    let showStopoverButton;
    let callButton = (
      <Button
        onPress={() => {
          this.callOwner();
        }}
        style={styles.callButton}
        status="success"
        icon={phoneIcon}
        textStyle={styles.callButtonText}>
        화주 전화
      </Button>
    );

    if (this.state.addiData.oppositeFreightId != null) {
      showStopoverButton = (
        <Button
          onPress={() => {
            this._showStopoverFreight();
          }}
          style={styles.button}
          textStyle={styles.buttonText}
          status="info"
          icon={cartIcon}>
          경유지
        </Button>
      );
    } else {
      showStopoverButton = (
        <Button
          onPress={() => {
            this._showStopoverFreight();
          }}
          style={styles.button}
          textStyle={styles.buttonText}
          disabled={true}
          status="info"
          icon={cartIcon}>
          경유지
        </Button>
      );
    }
    if (this.state.addiData.lastState == '배송중') {
      navButton = (
        <Button
          onPress={() => {
            this.navHandler();
          }}
          style={styles.button}
          textStyle={styles.buttonText}
          status="info"
          icon={naviIcon}>
          내비 연결
        </Button>
      );
      completeButton = (
        <Button
          onPress={() => {
            this._twoOptionAlertHandler();
          }}
          style={styles.button}
          status="danger"
          icon={homeIcon}
          textStyle={styles.buttonText}>
          운송 완료
        </Button>
      );
    } else if (this.state.addiData.lastState == '배송완료') {
      navButton = (
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          status="info"
          disabled={true}
          icon={naviIcon}>
          내비 연결
        </Button>
      );
      completeButton = (
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          status="danger"
          icon={homeIcon}
          disabled={true}>
          운송 완료
        </Button>
      );
    } else {
    }

    return (
      <React.Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
        <FlatList
          style={{backgroundColor: 'white'}}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={(item) => item.key}
        />
        <View style={styles.ButtonContainter}>
          <View style={styles.ButtonHalfContainer}>{navButton}</View>
          <View style={styles.ButtonHalfContainer}>{showStopoverButton}</View>
          <View style={styles.ButtonHalfContainer}>{completeButton}</View>
        </View>
        <View style={styles.ButtonContainter}>
          <View style={styles.ButtonHalfContainer}>{callButton}</View>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  Badge: {
    width: RFPercentage(14),
    height: RFPercentage(6),
    borderRadius: 8,
  },
  smallBadge: {
    width: RFPercentage(12),
    height: RFPercentage(2),
  },
  badgeText: {
    fontSize: RFPercentage(1.5),
  },
  button: {
    width: RFPercentage(15),
    height: RFPercentage(8),
    borderRadius: 8,
  },
  buttonText: {
    fontSize: RFPercentage(1.5),
  },
  callButton: {
    width: RFPercentage(28),
    height: RFPercentage(8),
    borderRadius: 8,
  },
  callButtonText: {
    fontSize: RFPercentage(1.5),
  },
  titleStyles: {
    paddingHorizontal: 20,
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
  },
  Subtitle: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  freightContainer: {
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  freightInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 70,
    alignItems: 'flex-start',
  },
  freightInfoTotalContainer: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
  },
  freightInfoHalfContainer: {
    flex: 1,
    paddingRight: 15,
    alignItems: 'flex-end',
  },
  freightInfoHalfRightContainer: {
    flex: 1,
    paddingLeft: 15,
    alignItems: 'flex-start',
  },
  geoContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  geoInfoContainer: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  geoText: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
  },
  geoSubText: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    paddingVertical: 15,
  },
  infoTitle: {
    paddingVertical: 3,
    fontSize: RFPercentage(2.2),
    fontWeight: 'bold',
    justifyContent: 'space-between',
  },
  infoRightTitle: {
    paddingVertical: 3,
    fontSize: RFPercentage(2.2),
    fontWeight: 'bold',
  },
  totalInfoContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flex: 1,
    borderColor: '#20232a',
    marginTop: -30,
  },
  totalInfoHalfContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  ButtonContainter: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'space-between',
  },
  ButtonHalfContainer: {
    flex: 1,
    alignItems: 'center',
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
