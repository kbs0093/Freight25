import React, {useState, Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Linking,
  Platform,
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  LayoutElement, 
  Icon,
  Divider,
  Button,
  TopNavigation, 
  TopNavigationAction,
} from '@ui-kitten/components';
import Geolocation from '@react-native-community/geolocation';
import { FORWARDIcon } from '../../assets/icons'
import { AppRoute } from '../../navigation/app-routes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { withNavigation } from 'react-navigation';
import { SearchScreenProps } from'../../navigation/search.navigator'


const myHtmlFile = require('../../component/tmap.html');
const isAndroid = Platform.OS==='android'
const server = "https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&"

{/*<WebView source={{uri:isAndroid?'file:///android_asset/tmap.html':'./tmap.html'}}></WebView>*/}


export class SearchScreen extends React.Component<SearchScreenProps> {
  state = {
    latitude: 'unknown',
    longitude: 'unknown',
    city: '',
    gu: '',
    myeon: '',
    dong: '',
    data: [1, 2, 3],
    lastRefresh: "null"
  };

  

  componentDidMount() {
    Geolocation.getCurrentPosition(
      position => {
        const latitude = JSON.stringify(position.coords.latitude);
        const longitude = JSON.stringify(position.coords.longitude);
        this.setState({latitude});
        this.setState({longitude});
        
        fetch(server + `&lat=${this.state.latitude}&lon=${this.state.longitude}&coordType=WGS84GEO&addressType=A10&callback=callback&appKey=l7xxce3558ee38884b2da0da786de609a5be`)
        .then(response => response.json())
        .then(response => {
          const city = JSON.stringify(response.addressInfo.city_do).replace(/\"/gi, "");
          const gu = JSON.stringify(response.addressInfo.gu_gun).replace(/\"/gi, "");
          const myeon = JSON.stringify(response.addressInfo.eup_myun).replace(/\"/gi, "");
          const dong = JSON.stringify(response.addressInfo.adminDong).replace(/\"/gi, "");

          this.setState({city});
          this.setState({gu});
          this.setState({myeon});
          this.setState({dong});          
        })   
        .catch(err => console.log(err));
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );        
  }

  ClickList = index => () => {
    console.log(index);
    //AsyncStorage.setItem('Freight', index);
    this.props.navigation.navigate(AppRoute.SEARCH_DETAIL);
  }

  _renderItem = ({item}) => (
    <TouchableOpacity onPress={this.ClickList(item)}>    
    <View style={styles.container}>
      <View style={styles.geoInfo}>
        <View style={styles.geoInfo1}>
          <View style={styles.geoInfo11}><Text style={styles.geoText}>대전 서구</Text></View>
          <View style={styles.geoInfo12}><Icon style={styles.icon} fill='#8F9BB3' name='arrow-forward-outline'/></View>
          <View style={styles.geoInfo11}><Text style={styles.geoText}>서울 성북</Text></View>
        </View>
        <View style={styles.geoInfo2}> 
          <View style={styles.geoInfo21}><Text style={styles.timeText}>당상 10:00</Text></View>
          <View style={styles.geoInfo12}></View>
          <View style={styles.geoInfo21}><Text style={styles.timeText}>당착 16:00</Text></View>
        </View>
        <View style={styles.geoInfo3}><Text style={styles.timeText}>    혼적</Text></View>
        <View style={styles.geoInfo3}><Text style={styles.timeText}>    5톤 / 탑차 / 6파렛 / 4500k / 수작업</Text></View>
      </View>
      <View style={styles.driveInfo}>
        <View style={styles.driveInfo1}>
          <Text style={styles.driveText}></Text>
          <Text style={styles.driveText}>189Km</Text>
          <Text style={styles.timeText}>3시간 20분</Text>
          <Text style={styles.timeText}>스마트 확률 : 80%</Text>
          <Text style={styles.timeText}></Text>
        </View>
        <View style={styles.moneyInfo}>
          <Text style={styles.driveText}>200,000원</Text>
        </View>
      </View>                          
    </View>
    </TouchableOpacity>
  );
  

  render(){
    return (
    <React.Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <View style={{height: "8%", flexDirection: "row", backgroundColor : 'white'}}>
        <View style={{flex: 3, justifyContent: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 18, margin: 5}}>
            검색 위치 : {this.state.city} {this.state.gu} {this.state.myeon} {this.state.dong}
          </Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Button 
            style={{margin: 5}} 
            size='small'
          >
            새로고침
          </Button>
        </View>      
      </View>     
      <Divider style={{backgroundColor: 'black'}}/>
     
        <FlatList 
          style={{backgroundColor : 'white'}}
          data={this.state.data}
          renderItem={this._renderItem}
        />
      
      
                        
    </React.Fragment>
    
    );
  }
};



const styles = StyleSheet.create({
  container: {
    flex : 1,
    flexDirection: 'row',
  },
  geoInfo: {
    flex: 4,
    flexDirection: 'column',
    //height : "20%",
  },
  geoInfo1: {
    flex : 2,
    flexDirection: 'row',
  },
  geoText:{
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 24,    
  },
  timeText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  driveText: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  geoInfo11: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex : 2,
  },
  geoInfo12: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex : 1,    
  },
  geoInfo3: {
    justifyContent: 'center',

    flex : 1,
  },
  geoInfo2: {
    flex : 1,
    flexDirection: 'row',
  },
  geoInfo21: {
    justifyContent: 'center',
    alignItems: 'center',
    flex : 2,
  },
  driveInfo:{
    flex: 2,
    height : "20%",
  },
  driveInfo1:{
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  moneyInfo:{
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 32,
    height: 32,
  },
});