import React, {useState, Fragment} from 'react';
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

export class DetailCheckDriverScreen extends React.Component<
  DetailCheckDriverScreenProps
> {
  // The number of frieght information from 'driver' could be more than one.
  constructor(props) {
    super(props);

    this.state = {
      FreightID: null,
      data: {},
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
          if (docs.state == 0) freightState = '배송전';
          else if (docs.state == 1) freightState = '배송중';
          else if (docs.state == 2) freightState = '배송완료';

          list.push({
            key: docs.id,
            lastState: freightState, // 0 -> 배송전, 1 -> 배송중, 2 -> 배송완료
            startAddress: docs.startAddr,
            endAddress: docs.endAddr,
            dist: docs.dist,
            startDate: docs.startDate, // 배송 출발 날짜 -> UI 고치기
            endDate: docs.endDate,
            expense: docs.expense,
            // ownerId: docs.ownerId,
            // startAddrFull: docs.startAddrFull,
          });
          that.setState({data: list});
        } else {
          console.log('No such document!');
        }
      });
    }
  };

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

      <ViewPager
        initialPage={0}
        style={styles.freightInfoContainer}
        showPageIndicator={true}>
        <View style={styles.freightInfoTotalContainer}>
          <View style={styles.freightInfoHalfContainer} key="1">
            <Text style={styles.infoTitle}>운행 거리</Text>
            <Text style={styles.infoTitle}>운행 시간</Text>
            <Text style={styles.infoTitle}>배차 날짜</Text>
            <Text style={styles.infoTitle}>운행 운임</Text>
          </View>
          <View style={styles.freightInfoHalfContainer}>
            <Text style={styles.infoRightTitle}>{item.dist} KM</Text>
            <Text style={styles.infoRightTitle}>12 시간</Text>
            <Text style={styles.infoRightTitle}>2020년 5월 12일</Text>
            <Text style={styles.infoRightTitle}>{item.expense} 원</Text>
          </View>
        </View>
        <View style={styles.freightInfoTotalContainer}>
          <View style={styles.freightInfoHalfContainer} key="2">
            <Text style={styles.infoTitle}>상차지 주소</Text>
            <Text style={styles.infoTitle}></Text>
            <Text style={styles.infoTitle}>하차지 주소</Text>
            <Text style={styles.infoTitle}></Text>
            <Text style={styles.infoTitle}>화주 이름</Text>
            <Text style={styles.infoTitle}>화주 연락처</Text>
          </View>
          <View style={styles.freightInfoHalfContainer}>
            <Text style={styles.infoTitle}>{item.startAddress}</Text>
            <Text style={styles.infoTitle}>{item.startAddrFull}</Text>
            <Text style={styles.infoTitle}>{item.endAddress}</Text>
            <Text style={styles.infoTitle}>상세 주소</Text>
            <Text style={styles.infoTitle}>홍길동</Text>
            <Text style={styles.infoTitle}>01018181818</Text>
          </View>
        </View>
      </ViewPager>
      <View style={styles.lineStyle} />
    </View>
  );

  render() {
    // assert
    // We need to check if the 'userType' is owner
    //
    // In owner check process, there is no navButton and completeButton.
    // Only need callButton and reviewButton

    let navButton;
    let callButton;
    let completeButton;

    console.log(this.state.data.lastState);

    if (this.state.data.lastState == '배송중') {
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
        <Button style={styles.button} textStyle={styles.buttonText}>
          운송 완료하기
        </Button>
      );
    } else if (this.state.data.lastState == '배송완료') {
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
        <View style={styles.totalInfoContainer}>
          <View style={styles.totalInfoHalfContainer}>
            <Text style={styles.infoTitle}>총 운행 거리</Text>
            <Text style={styles.infoTitle}>총 운행 운임</Text>
          </View>
          <View style={styles.totalInfoHalfContainer}>
            <Text style={styles.infoTitle}>{this.state.data.dist} KM</Text>
            <Text style={styles.infoTitle}>{this.state.data.expense} 원</Text>
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
    fontSize: RFPercentage(1.6),
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
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
  },
  freightContainer: {
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    borderColor: '#20232a',
    paddingVertical: 5,
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
    flex: 1,
    flexDirection: 'row',
  },
  freightInfoHalfContainer: {
    flex: 1,
  },
  geoContainer: {
    paddingVertical: 15,
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
    justifyContent: 'space-around',
  },
  ButtonHalfContainer: {
    flex: 1,
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
