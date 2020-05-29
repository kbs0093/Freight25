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

export class DetailCheckDriverScreen extends React.Component<
  DetailCheckDriverScreenProps
> {
  // The number of frieght information from 'driver' could be more than one.
  constructor(props) {
    super(props);

    this.state = {
      FreightID: null,
      data: [],
      addiData: {
        lastState: null, // 0 -> 배송중, 1 -> 배송완료
        dist: null,
        expense: null,
        ownerId: null,
      },
      dualFreight: null,
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

          if (docs.state == 0) freightState = '배송전';
          else if (docs.state == 1) freightState = '배송중';
          else if (docs.state == 2) freightState = '배송완료';

          var docStartDate = new Date(docs.timeStampAssigned._seconds * 1000);
          //var docEndDate = new Date(docs.endDay._seconds * 1000);

          if (docs.stopover) {
            this.state.dualFreight = true;
          }

          list.push({
            key: docs.id,
            lastState: freightState, // 0 -> 배송전, 1 -> 배송중, 2 -> 배송완료
            dist: docs.dist,
            startDate: docs.startDate, // 배송 출발 날짜 -> UI 고치기
            endDate: docs.endDate,
            expense: docs.expense,
            startAddress: docs.startAddr,
            endAddress: docs.endAddr,
            startAddrFull: docs.startAddr_Full,
            endAddrFull: docs.endAddr_Full,
            startAddrArray: startAddrArray,
            endAddrArray: endAddrArray,

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

  _renderItem = ({item}) => (

    <View>
      <View style={styles.freightContainer}>
        <Text style={styles.Subtitle}>화물 내역</Text>
        {item.lastState == '배송중' ? (
          <Button
            style={styles.Badge}
            appearance="outline"
            status="danger"
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
      {/* <Divider style={{backgroundColor: 'black'}} /> */}
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
      {this.state.dualFreight == null ? (
        <View style={styles.freightInfoTotalContainer}>
          <View style={styles.freightInfoHalfContainer} key="1">
            <Text style={styles.infoTitle}>배차 날짜</Text>
            <Text style={styles.infoTitle}>운행 거리</Text>
            <Text style={styles.infoTitle}>운행 운임</Text>
            <Text style={styles.infoTitle}>상차지 주소</Text>
            <Text style={styles.infoTitle}></Text>
            <Text style={styles.infoTitle}></Text>
            <Text style={styles.infoTitle}>하차지 주소</Text>
            <Text style={styles.infoTitle}></Text>
            <Text style={styles.infoTitle}>화주 이름</Text>
            <Text style={styles.infoTitle}>화주 연락처</Text>
            <Text style={styles.infoTitle}>화물 설명</Text>
          </View>
          <View style={styles.freightInfoHalfContainer}>
            <Text style={styles.infoRightTitle}>
              {item.startMonth}월 {item.startDay}일
            </Text>
            <Text style={styles.infoRightTitle}>{item.dist} KM</Text>
            <Text style={styles.infoRightTitle}>{item.expense} 원</Text>
            <Text style={styles.infoRightTitle}>{item.startAddrFull}</Text>
            <Text style={styles.infoRightTitle}></Text>
            <Text style={styles.infoRightTitle}>{item.endAddrFull}</Text>
            <Text style={styles.infoRightTitle}></Text>
            <Text style={styles.infoRightTitle}>{item.ownerName}</Text>
            <Text style={styles.infoRightTitle}>{item.ownerTel}</Text>
            <Text style={styles.infoRightTitle}>{item.desc}</Text>
          </View>
        </View>
      ) : (
        <ViewPager
          initialPage={0}
          style={styles.freightInfoContainer}
          showPageIndicator={true}>
          <View style={styles.freightInfoTotalContainer}>
            <View style={styles.freightInfoHalfContainer} key="1">
              <Text style={styles.infoTitle}>배차 날짜</Text>
              <Text style={styles.infoTitle}>운행 거리</Text>
              <Text style={styles.infoTitle}>운행 운임</Text>
            </View>
            <View style={styles.freightInfoHalfContainer}>
              <Text style={styles.infoRightTitle}>
                {item.startMonth}월 {item.startDay}일
              </Text>
              <Text style={styles.infoRightTitle}>{item.dist} KM</Text>
              <Text style={styles.infoRightTitle}>{item.expense} 원</Text>
            </View>
          </View>
          <View style={styles.freightInfoTotalContainer}>
            <View style={styles.freightInfoHalfContainer} key="2">
              <Text style={styles.infoTitle}>상차지 주소</Text>
              <Text style={styles.infoTitle}></Text>
              <Text style={styles.infoTitle}></Text>
              <Text style={styles.infoTitle}>하차지 주소</Text>
              <Text style={styles.infoTitle}></Text>
            </View>
            <View style={styles.freightInfoHalfContainer}>
              <Text style={styles.infoRightTitle}>{item.startAddrFull}</Text>
              <Text style={styles.infoRightTitle}></Text>
              <Text style={styles.infoRightTitle}>{item.endAddrFull}</Text>
              <Text style={styles.infoRightTitle}></Text>
            </View>
          </View>
          <View style={styles.freightInfoTotalContainer}>
            <View style={styles.freightInfoHalfContainer} key="3">
              <Text style={styles.infoTitle}>화주 이름</Text>
              <Text style={styles.infoTitle}>화주 연락처</Text>
              <Text style={styles.infoTitle}>화물 설명</Text>
            </View>
            <View style={styles.freightInfoHalfContainer}>
              <Text style={styles.infoRightTitle}>{item.ownerName}</Text>
              <Text style={styles.infoRightTitle}>{item.ownerTel}</Text>
              <Text style={styles.infoRightTitle}>{item.desc}</Text>
            </View>
          </View>
        </ViewPager>
      )}
      <Divider style={{backgroundColor: 'black'}} />
    </View>
  );

  render() {
    let navButton;
    let callButton;
    let completeButton;

    if (this.state.addiData.lastState == '배송중') {
      navButton = (
        <Button style={styles.button} textStyle={styles.buttonText}>
          내비게이션 연결
        </Button>
      );
      callButton = (
        <Button style={styles.button} textStyle={styles.buttonText}>
          화주에게 전화
        </Button>
      );
      completeButton = (
        <Button
          onPress={() => {
            this._twoOptionAlertHandler();
          }}
          style={styles.button}
          textStyle={styles.buttonText}>
          운송 완료하기
        </Button>
      );
    } else if (this.state.addiData.lastState == '배송완료') {
      navButton = (
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          disabled={true}>
          내비게이션 연결
        </Button>
      );
      callButton = (
        <Button style={styles.button} textStyle={styles.buttonText}>
          화주에게 전화
        </Button>
      );
      completeButton = (
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          disabled={true}>
          운송 완료하기
        </Button>
      );
    } else {
      navButton = (
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          disabled={true}>
          내비게이션 연결
        </Button>
      );
      callButton = (
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          disabled={true}>
          화주에게 전화
        </Button>
      );
      completeButton = (
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          disabled={true}>
          운송 완료
        </Button>
      );
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
        <Divider style={{backgroundColor: 'black'}} />
        <View style={styles.totalInfoContainer}>
          <View style={styles.totalInfoHalfContainer}>
            <Text style={styles.infoTitle}>총 운행 거리</Text>
            <Text style={styles.infoTitle}>총 운행 운임</Text>
          </View>
          <View style={styles.totalInfoHalfContainer}>
            <Text style={styles.infoTitle}>{this.state.addiData.dist} KM</Text>
            <Text style={styles.infoTitle}>
              {this.state.addiData.expense} 원
            </Text>
          </View>
        </View>
        <View style={styles.ButtonContainter}>
          <View style={styles.ButtonHalfContainer}>{navButton}</View>
          <View style={styles.ButtonHalfContainer}>{callButton}</View>
          <View style={styles.ButtonHalfContainer}>{completeButton}</View>
        </View>
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
    fontSize: RFPercentage(1.5),
  },
  button: {
    width: RFPercentage(15),
    height: RFPercentage(6),
    borderRadius: 8,
  },
  buttonText: {
    fontSize: RFPercentage(1.6),
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
    borderColor: '#20232a',
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
    borderColor: '#20232a',
  },
  freightInfoTotalContainer: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  freightInfoHalfContainer: {
    flex: 1,
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
    fontSize: RFPercentage(2.8),
    fontWeight: 'bold',
  },
  geoSubText: {
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
    paddingVertical: 15,
  },
  infoTitle: {
    paddingVertical: 2,
    paddingHorizontal: 40,
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
    fontStyle: 'normal',
    justifyContent: 'space-between',
  },
  infoRightTitle: {
    paddingVertical: 2,
    paddingHorizontal: 40,
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
    fontStyle: 'normal',
    //alignSelf: 'flex-end',
    alignSelf: 'stretch',
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
    flex: 1,
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
