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

import RNPickerSelect from 'react-native-picker-select';

const server = "https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&"
const isAndroid = Platform.OS ==='android';

export class SearchScreen extends React.Component <SearchScreenProps> {
  state = {
    latitude: 'unknown',
    longitude: 'unknown',
    city: '',
    gu: '',
    myeon: '',
    dong: '',
    value: '1'
  };

  list = [
    {
      id:      'A1234567',
      startAddress:   '대전 서구',
      startX:         '127.370187',
      startY:         '36.334634',
      endAddress:     '서울 성북',
      startType:      '당상',
      endType:        '당착',
      Type:           '혼적',
      carType: '5톤', carType2: '카고', freightSize: '6파렛', freightWeight: '4500Kg', loadType: '지게차',
      distanceX:      '',  //빈 칸으로 남겨둬라
      distanceY:      190,
      time:           '3시간 20분',
      smart:          90,
      money:          200000,
      
    },
    {
      id:      'A1234568',
      startAddress:   '대전 유성',
      startX:         '127.370187',
      startY:         '36.334634',
      endAddress:     '수원 영통',
      startType:      '당상',
      endType:        '당착',
      Type:           '혼적',
      carType: '5톤', carType2: '카고', freightSize: '6파렛', freightWeight: '4500Kg', loadType: '지게차',
      distanceX:      '',  //빈 칸으로 남겨둬라
      distanceY:      120,
      time:           '3시간 20분',
      smart:          60,
      money:          190000,
      
    },  
    {
      id:      'A1234569',
      startAddress:   '대전 대덕',
      startX:         '127.370187',
      startY:         '36.334634',
      endAddress:     '분당 정자',
      startType:      '당상',
      endType:        '내일착',
      Type:           '독차',
      carType: '5톤', carType2: '카고', freightSize: '6파렛', freightWeight: '4500Kg', loadType: '지게차',
      distanceX:      '',  //빈 칸으로 남겨둬라
      distanceY:      170,
      time:           '3시간 20분',
      smart:          70,
      money:          180000,
      
    },  
  ];

  componentDidMount() {

    if(this.state.value == '1'){
      this.list.sort(this.smartSort);

    }
    else if(this.state.value == '2'){
      this.list.sort(this.moneySort);

    }
    else{
      this.list.sort(this.distanceSort);

    }
    

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

        for(let i=0; i<this.list.length; i++){

          fetch('https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=response',{
            method: 'POST',
            headers:{
              "appKey" : "l7xxce3558ee38884b2da0da786de609a5be",
            },
            body: JSON.stringify({
              "startX" : this.state.longitude,
              "startY" : this.state.latitude,
              "endX" : this.list[i].startX,
              "endY" : this.list[i].startY,
              "reqCoordType" : "WGS84GEO",
              "resCoordType" : "WGS84GEO",
              "searchOption" : '0',
              "totalValue" : '2',
              "trafficInfo" : 'N'
            })})
          .then(response => response.json())
          .then(response =>{
            this.list[i].distanceX = (response.features[0].properties.totalDistance/1000) + "";
   
          })
          .catch(err => console.log(err));

       }


      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},     
    );  
    

    
  };

  ClickList = index => () => {
    //AsyncStorage.setItem('Freight', index);
    this.props.navigation.navigate(AppRoute.SEARCH_DETAIL);
  };

  moneySort(a, b) {
    if(a.money == b.money){ return 0} return a.money < b.money ? 1 : -1;
  };

  distanceSort(a, b) {
    if(a.distanceY == b.distanceY){ return 0} return a.distanceY < b.distanceY ? 1 : -1;
  };

  smartSort(a, b) {
    if(a.smart == b.smart){ return 0} return a.smart < b.smart ? 1 : -1;
  };
  

  _renderItem = ({item}) => (
    <TouchableOpacity onPress={this.ClickList(item)}>    
    <View style={styles.container}>
      <View style={styles.geoInfo}>
        <View style={styles.geoInfo1}>
          <View style={styles.geoInfo11}><Text style={styles.geoText}>{item.startAddress}</Text></View>
          <View style={styles.geoInfo12}><Icon style={styles.icon} fill='#8F9BB3' name='arrow-forward-outline'/></View>
          <View style={styles.geoInfo11}><Text style={styles.geoText}>{item.endAddress}</Text></View>
        </View>
        <View style={styles.geoInfo2}> 
          <View style={styles.geoInfo21}><Text style={styles.startType}>{item.startType}</Text></View>
          <View style={styles.geoInfo12}></View>
          <View style={styles.geoInfo21}><Text style={styles.endType}>{item.endType}</Text></View>
        </View>
          <View style={styles.geoInfo3}>
            <View style={{flex:1, alignItems: 'center'}}><Text style={styles.Type}>{item.Type}</Text></View>
            <View style={{flex:2}}><Text style={styles.distance}> 상차지 까지 {item.distanceX} Km</Text></View>            
          </View>
          <View style={styles.geoInfo3}><Text style={styles.timeText}>{item.carType} / {item.carType2} / {item.freightSize} / {item.freightWeight} / {item.loadType}</Text></View>
        </View>
      <View style={styles.driveInfo}>
        <View style={styles.driveInfo1}>
          <Text style={styles.driveText}></Text>
          <Text style={styles.driveText}>{item.distanceY} Km</Text>
          <Text style={styles.timeText}>{item.time}</Text>
          <Text style={styles.timeText}>스마트 확률 : {item.smart} %</Text>
          <Text style={styles.timeText}></Text>
        </View>
        <View style={styles.moneyInfo}>
          <Text style={styles.driveText}>{item.money} 원</Text>
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
          
        </View>      
      </View>
      <View style={{height: "8%", flexDirection: "row", backgroundColor : 'white'}}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 18, margin: 5}}>
            검색 조건 : 
          </Text>
        </View>
        <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
          <RNPickerSelect
              onValueChange={(value) => {
                this.setState({value})  
              }}
              placeholder={{
                label: '정렬 순서',
                value: null,
              }}
              useNativeAndroidPickerStyle={isAndroid? true: false}
              items={[
                {label: '운행거리 순', value: '3'},
                {label: '운임 순', value: '2'},
                {label: '스마트 확률 순', value: '1'},
              ]}
      
            />
        </View>      
      </View>     
      <Divider style={{backgroundColor: 'black'}}/>     
        <FlatList 
          style={{backgroundColor : 'white'}}
          data={this.state.value? this.list : this.list}
          renderItem={this._renderItem}
        />                             
    </React.Fragment>
    
    );
  }
};



const styles = StyleSheet.create({
  startType: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#2F80ED'
  },
  endType: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#EB5757'
  },
  Type: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#9B51E0',
  },
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
    flexDirection: 'row',
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
  distance: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#E5E5E5',
  }
});