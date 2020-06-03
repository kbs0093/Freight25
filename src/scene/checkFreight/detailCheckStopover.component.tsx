import React, {useState, Fragment} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import {
  LayoutElement,
  TopNavigationAction,
  TopNavigation,
  OverflowMenu,
  Icon,
  Button,
  Divider,
} from '@ui-kitten/components';
import {DetailCheckStopoverScreenProps} from '../../navigation/check.navigator';
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

const phoneIcon = (style) => <Icon {...style} name="phone-outline" />;
const naviIcon = (style) => <Icon {...style} name="compass-outline" />;
const plusIcon = (style) => <Icon {...style} name="plus-outline" />;
const homeIcon = (style) => <Icon {...style} name="home-outline" />;
const cartIcon = (style) => <Icon {...style} name="shopping-cart-outline" />;
const carIcon = (style) => <Icon {...style} name="car-outline" />;

export class DetailCheckStopoverScreen extends React.Component<
  DetailCheckStopoverScreenProps
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
      },
    };
  }

  componentDidMount = async () => {
    try {
      const value = await AsyncStorage.getItem('OppoFreightID');
      if (value !== null) {
        this.setState({OppoFreightID: value});
      }
    } catch (error) {}

    var user = auth().currentUser;
    const that = this;

    if (user != null) {
      var docRef = firestore()
        .collection('freights')
        .doc(this.state.OppoFreightID);

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
            startAddrFullArray: startAddrFullArray,
            endAddrFullArray: endAddrFullArray,
            startAddrArray: startAddrArray,
            endAddrArray: endAddrArray,
            startAddrDetail: startAddrDetail,
            endAddrDetail: endAddrDetail,
            oppositeFreightId: docs.oppositeFreightId,

            startMonth: docStartDate.getMonth() + 1,
            startDay: docStartDate.getDate(),
            // endMonth: docEndDate.getMonth() + 1,
            // endDay: docEndDate.getDate(),
            startDayLabel: doc.startDayLabel,
            // endDayLabel: doc.endDayLabel,
            driveOption: docs.driveOption,

            ownerTel: docs.ownerTel,
            ownerName: docs.ownerName,
            desc: docs.desc,
          });

          var addiData = {
            lastState: freightState,
            dist: docs.dist,
            expense: docs.expense,
            ownerId: docs.ownerId,
          };
          that.setState({addiData: addiData});
          that.setState({data: list});
        } else {
          console.log('No such document!');
        }
      });
    }
  };

  setComplete = () => {
    console.log('운송 완료');
    try {
      var ref = firestore()
        .collection('freights')
        .doc(this.state.OppoFreightID);
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

  _renderItem = ({item}) => (
    <View>
      <View style={styles.freightContainer}>
        <Text style={styles.Subtitle}>경유지 화물 내역</Text>
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
    let callButton;
    let completeButton;

    if (this.state.addiData.lastState == '배송중') {
      navButton = (
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          status="info"
          icon={naviIcon}>
          내비 연결
        </Button>
      );
      callButton = (
        <Button
          style={styles.callButton}
          textStyle={styles.callButtonText}
          status="success"
          icon={phoneIcon}>
          화주에게 전화
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
          disabled={true}>
          내비 연결
        </Button>
      );
      callButton = (
        <Button
          style={styles.callButton}
          textStyle={styles.callButtonText}
          status="success"
          icon={phoneIcon}>
          화주 전화
        </Button>
      );
      completeButton = (
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          icon={homeIcon}
          status="danger"
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
    height: RFPercentage(4),
    borderRadius: 8,
  },
  smallBadge: {
    width: RFPercentage(8),
    height: RFPercentage(2),
  },
  badgeText: {
    fontSize: RFPercentage(1.5),
  },
  button: {
    width: RFPercentage(15),
    height: RFPercentage(6),
    borderRadius: 8,
  },
  buttonText: {
    fontSize: RFPercentage(1.5),
  },
  callButton: {
    width: RFPercentage(30),
    height: RFPercentage(6),
    borderRadius: 8,
  },
  callButtonText: {
    fontSize: RFPercentage(2.2),
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
  freightContainer: {
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: RFPercentage(3.5),
    fontWeight: 'bold',
  },
  geoSubText: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    paddingVertical: 15,
  },
  infoTitle: {
    paddingVertical: 4,
    fontSize: RFPercentage(2.2),
    fontWeight: 'bold',
  },
  infoRightTitle: {
    paddingVertical: 4,
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
