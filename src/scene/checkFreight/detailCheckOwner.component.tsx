import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  Linking,
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
import {DetailCheckOwnerScreenProps} from '../../navigation/check.navigator';
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

const phoneIcon = (style) => <Icon {...style} name="phone-outline" />;
const naviIcon = (style) => <Icon {...style} name="compass-outline" />;
const plusIcon = (style) => <Icon {...style} name="plus-outline" />;
const homeIcon = (style) => <Icon {...style} name="home-outline" />;
const carIcon = (style) => <Icon {...style} name="car-outline" />;

export class DetailCheckOwnerScreen extends React.Component<
  DetailCheckOwnerScreenProps
> {
  // The number of frieght information from 'owner' should be only one.
  constructor(props) {
    super(props);

    this.state = {
      FreightID: null,
      data: [],
      addiData: {
        lastState: null, // 0 -> 배송전, 1 -> 배송중, 2 -> 배송완료
        dist: null,
        expense: null,
        ownerID: null,
        driverTel: null,
      },
    };
  }

  componentDidMount = async () => {
    try {
      const value = await AsyncStorage.getItem('FreightID');
      if (value !== null) {
        this.setState({FreightID: value});
      }
    } catch (error) {}

    var user = auth().currentUser;
    const that = this;

    if (user != null) {
      var docRef = firestore().collection('freights').doc(this.state.FreightID);

      docRef.get().then(function (doc) {
        //doc.data()에 상세정보 저장되어 있습니다.
        //화물의 배정 기사 변수: driverId
        //화물 배정 상태 변수: state
        var list = [];

        if (doc.exists) {
          const docs = doc.data();
          console.log('Document data:', docs.id);

          var freightState = '';
          var startAddrArray = docs.startAddr.split(' ');
          var endAddrArray = docs.endAddr.split(' ');
          var docStartDate = '';

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

          if (docs.state == 0) {
            freightState = '배송전';
            docStartDate = new Date(docs.startDay._seconds * 1000);
          } else if (docs.state == 1) {
            freightState = '배송중';
            if (docs.timeStampAssigned == null) {
              docStartDate = new Date(docs.startDay._seconds * 1000);
            } else
              docStartDate = new Date(docs.timeStampAssigned._seconds * 1000);
          } else if (docs.state == 2) {
            freightState = '배송완료';
            if (docs.timeStampAssigned == null) {
              docStartDate = new Date(docs.startDay._seconds * 1000);
            } else
              docStartDate = new Date(docs.timeStampAssigned._seconds * 1000);
          }

          list.push({
            key: docs.id,
            lastState: freightState, // 0 -> 배송전, 1 -> 배송중, 2 -> 배송완료
            dist: docs.dist,
            startDate: docs.startDate, // 배송 출발 날짜 -> UI 고치기
            endDate: docs.endDate,
            expense: docs.expense,
            startAddr: docs.startAddr,
            endAddr: docs.endAddr,
            startAddrFullArray: startAddrFullArray,
            endAddrFullArray: endAddrFullArray,
            startAddrArray: startAddrArray,
            endAddrArray: endAddrArray,
            startAddrDetail: startAddrDetail,
            endAddrDetail: endAddrDetail,
            driveOption: docs.driveOption,
            driverTel: docs.driverTel,
            desc: docs.desc,

            startMonth: docStartDate.getMonth() + 1,
            startDay: docStartDate.getDate(),
            //endMonth: docEndDate.getMonth() + 1,
            //endDay: docEndDate.getDate(),
            startDayLabel: doc.startDayLabel,
            endDayLabel: doc.endDayLabel,
          });

          var addiData = {
            lastState: freightState,
            dist: docs.dist,
            expense: docs.expense,
            ownerId: docs.ownerId,
            driverTel: docs.driverTel,
          };

          that.setState({addiData: addiData});
          that.setState({data: list});
        } else {
          console.log('No such document!');
        }
      });
    }
  };

  callDriver = () => {
    console.log('Call to the driver');
    console.log(this.state.addiData.driverTel);
    Linking.openURL(`tel:${this.state.addiData.driverTel}`);
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
          <Text style={styles.geoText}>{item.startAddrArray[2]}</Text>
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
        <View style={styles.freightInfoHalfContainer} key="1">
          {item.lastState == '배송전' ? (
            <Text style={styles.infoTitle}>등록 날짜:</Text>
          ) : (
            <Text style={styles.infoTitle}>배차 날짜:</Text>
          )}
          {item.lastState == '배송전' ? (
            <Text style={styles.infoTitle}>예상 운행 거리:</Text>
          ) : (
            <Text style={styles.infoTitle}>운행 거리:</Text>
          )}
          <Text style={styles.infoTitle}>운행 운임:</Text>
          <Text style={styles.infoTitle}>운행 방식:</Text>
          <Text style={styles.infoTitle}>상차지 주소:{'\n'}</Text>
          <Text style={styles.infoTitle}>하차지 주소:{'\n'}</Text>
          <Text style={styles.infoTitle}>화물 설명:</Text>
          {item.lastState == '배송중' ? (
            <Text style={styles.infoTitle}>화물차 기사 전화번호:</Text>
          ) : null}
        </View>
        <View style={styles.freightInfoHalfRightContainer}>
          <Text style={styles.infoRightTitle}>
            {item.startMonth}월 {item.startDay}일
          </Text>
          <Text style={styles.infoRightTitle}>{item.dist} KM</Text>
          <Text style={styles.infoRightTitle}>{item.expense} 원</Text>
          <Text style={styles.infoRightTitle}>{item.driveOption}</Text>
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
          <Text style={styles.infoRightTitle}>{item.desc}</Text>
          {item.lastState == '배송중' ? (
            <Text style={styles.infoTitle}>{item.driverTel}</Text>
          ) : null}
        </View>
      </View>
      <Divider style={{backgroundColor: 'black'}} />
    </View>
  );

  render() {
    let callButton;
    let reviewButton;

    if (this.state.addiData.lastState == '배송전') {
      callButton = (
        <Button
          onPress={() => {
            this.callDriver();
          }}
          style={styles.callButton}
          textStyle={styles.callButtonText}
          status="success"
          disabled={true}
          icon={phoneIcon}>
          화물차 기사에게 전화
        </Button>
      );
      reviewButton = (
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          disabled={true}>
          화물차 기사 평가
        </Button>
      );
    } else if (this.state.addiData.lastState == '배송중') {
      callButton = (
        <Button
          onPress={() => {
            this.callDriver();
          }}
          style={styles.callButton}
          status="success"
          textStyle={styles.callButtonText}
          icon={phoneIcon}>
          화물차 기사에게 전화
        </Button>
      );
      reviewButton = (
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          disabled={true}>
          화물차 기사 평가
        </Button>
      );
    } else if (this.state.addiData.lastState == '배송완료') {
      callButton = (
        <Button
          onPress={() => {
            this.callDriver();
          }}
          style={styles.callButton}
          status="success"
          textStyle={styles.callButtonText}
          icon={phoneIcon}>
          화물차 기사에게 전화
        </Button>
      );
      reviewButton = (
        <Button style={styles.button} textStyle={styles.buttonText}>
          화물차 기사 평가
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
        />
        <View style={styles.ButtonContainter}>
          <View style={styles.ButtonHalfContainer}>{callButton}</View>
          {/* <View style={styles.ButtonHalfContainer}>{reviewButton}</View> */}
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
    width: RFPercentage(28),
    height: RFPercentage(8),
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
    fontSize: RFPercentage(3),
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
    flex: 3,
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
