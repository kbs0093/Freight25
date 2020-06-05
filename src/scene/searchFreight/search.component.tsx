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
  PermissionsAndroid,
  NavigatorIOS,
} from 'react-native';
import {
  LayoutElement, 
  Icon,
  Divider,
  Button,
  TopNavigation, 
  TopNavigationAction,
} from '@ui-kitten/components';
import { FORWARDIcon } from '../../assets/icons'
import { AppRoute } from '../../navigation/app-routes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { withNavigation } from 'react-navigation';
import { SearchScreenProps } from'../../navigation/search.navigator';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import Geolocation from 'react-native-geolocation-service';


const server = "https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&"
const isAndroid = Platform.OS === 'android';

export class SearchScreen extends Component <SearchScreenProps> {
  
  constructor(props) {
    super(props);       

    this.state = {
      latitude: 'unknown',
      longitude: 'unknown',
      city: '',
      gu: '',
      myeon: '',
      dong: '',
      value: '1',
      value2: '1',
      data: [],
      data2: [],
      distance: []
    };
  }

  requestLocationAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {             
        Geolocation.getCurrentPosition(
          (position) => {
            
            let latitude = JSON.stringify(position.coords.latitude);
            let longitude = JSON.stringify(position.coords.longitude);
   
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
              this.FirebaseRequest();                   
            })   
            .catch(err => console.log(err));     
          },
          error => Alert.alert('Error', JSON.stringify(error)),
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},     
        );
      } else {
        
      }
    } catch (err) {
      console.warn(err)
    }
  }

  requestLocationIos = () => {
    var latitude;
    var longitude;

    Geolocation.getCurrentPosition(
      position => {
        latitude = JSON.stringify(position.coords.latitude);
        longitude = JSON.stringify(position.coords.longitude);

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
          this.FirebaseRequest();       
        })   
        .catch(err => console.log(err));     
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},     
    );
  };

  FirebaseRequest = async() => {    
    var user = auth().currentUser;
    const that = this;
    
    if(user != null){      
      try {
        firestore().collection('freights').where("state", "==", 0)
        .get()
        .then(async function(querySnapshot){
          var list =[];
          
          for(var docCnt in querySnapshot.docs){
              
            const doc = querySnapshot.docs[docCnt].data();
            var parseStart = doc.startAddr + "";
            var startArr = parseStart.split(" ");

            var parseEnd = doc.endAddr + "";
            var endArr = parseEnd.split(" ");
            var moneyprint = doc.expense + "";
            var distance;
            moneyprint = moneyprint.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            var distance = 100 * (Math.acos(Math.sin(that.state.latitude)*Math.sin(doc.startAddr_lat) + Math.cos(that.state.latitude)*Math.cos(doc.startAddr_lat)*Math.cos(that.state.longitude - doc.startAddr_lon)));;
            distance = Math.floor(distance);

            list.push({
              id: doc.id,
              startAddress: startArr,
              endAddress: endArr,
              startX: doc.startAddr_lon,
              startY: doc.startAddr_lat,
              startType: doc.startDate,
              endType: doc.endDate,
              Type: doc.driveOption,
              carType: doc.carSize,
              carType2: doc.carType,
              freightSize: doc.volume,
              freightWeight: doc.weight,
              loadType: doc.freightLoadType,
              distanceX: distance,              
              distanceY: doc.dist,
              time: null,
              smart: null,
              money: doc.expense,
              moneyPrint: moneyprint,
              
            });                 
          }          
          that.setState({data: list});
          that.setState({data2: list});
        })

      } 
      catch (error) {
        console.log(error);
      }      
    }   
  }



  componentDidMount = () => {
    isAndroid ? this.requestLocationAndroid() : this.requestLocationIos()
  }

   ClickList = item => () => {
    AsyncStorage.setItem('FreightID', item.id);
    if(item.Type == '독차'){
      this.props.navigation.navigate(AppRoute.ALONE_DETAIL);
    } else {
      this.props.navigation.navigate(AppRoute.SEARCH_DETAIL);
    }

  };

  moneySort(a, b) {
    if(a.money == b.money){ return 0} return a.money < b.money ? 1 : -1;
  };

  distanceSort(a, b) {
    return Number(a.distanceY) > Number(b.distanceY) ? -1 : Number(a.distanceY) < Number(b.distanceY) ? 1: 0;
  };

  distanceSort2(a, b) {
    return Number(a.distanceY) < Number(b.distanceY) ? -1 : Number(a.distanceY) > Number(b.distanceY) ? 1: 0;
  };    

  smartSort(a, b) {
    if(a.smart == b.smart){ return 0} return a.smart < b.smart ? 1 : -1;
  };

  filtering(value) {
    var temp = [];
    temp = JSON.parse(JSON.stringify(this.state.data));
     
    if(value == '1'){        
      let result = temp.filter(element => {
        return element.distanceX <= 100
      });
      this.setState({data2: result})    
    }
    else if(value == '2'){
      let result = temp.filter(element => {
        return element.distanceX <= 50
      });
      this.setState({data2: result})   
    }
    else if(value == '3'){
      let result = temp.filter(element => {
        return element.distanceX <= 30
      });
      this.setState({data2: result})   
    }
    else if(value == '4'){
      let result = temp.filter(element => {
        return element.distanceX <= 10
      });
      this.setState({data2: result})   
    }    
  };
  
  _renderItem = ({item}) => (   
    <TouchableOpacity onPress={this.ClickList(item)}>    
    <View style={styles.container}>
      <View style={styles.geoInfo}>
        
        <View style={styles.geoInfo1}>
          <View style={styles.geoInfo11}>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <Text style={styles.geoTitleText}>{item.startAddress[0]} {item.startAddress[1]}</Text>
            </View>
            <View>
              <Text style={styles.geoTitleText}>{item.startAddress[2]}</Text>
            </View>             
          </View>

          <View style={styles.geoInfo12}>
            <View>
              <Icon style={styles.icon} fill='#8F9BB3' name='arrow-forward-outline'/>
            </View>
            <View><Text style={styles.Type}>{item.Type}</Text></View>      
          </View>
          
          <View style={styles.geoInfo11}>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <Text style={styles.geoTitleText}>{item.endAddress[0]} {item.endAddress[1]}</Text>
            </View>
            <View>
              <Text style={styles.geoTitleText}>{item.endAddress[2]}</Text>
            </View> 
          </View>          
        </View>

        <View style={styles.geoInfo2}> 
          <View style={styles.geoInfo21}><Text style={styles.startType}>{item.startType}</Text></View>
          <View style={styles.geoInfo12}></View>
          <View style={styles.geoInfo21}><Text style={styles.endType}>{item.endType}</Text></View>
        </View>

          <View style={styles.geoInfo3}/>                        
            <View style={styles.freightType}>
              <Text style={styles.freightTypeText}> {item.carType} / {item.carType2} / {item.freightSize} 파렛 / {item.freightWeight} 톤 / {item.loadType}</Text>
            </View>
      </View>

      <View style={styles.driveInfo}>
        <View style={styles.driveInfo1}>
            <Text style={{fontSize: 8}}></Text>
            <Text style={styles.driveText2}>{item.distanceY} Km</Text>
            <Text style={styles.timeText}>스마트 랭킹 : {item.smart} %</Text>
            <Text style={styles.distance}>{item.distanceX} Km</Text>      
        </View>
        <View style={styles.moneyInfo}>
          <Text style={styles.driveText}>{item.moneyPrint} 원</Text>
        </View>
      </View>                          
    </View>
    </TouchableOpacity>
  );
  
  render(){
      
    if(this.state.value == '1'){  
      this.state.data2.sort(this.smartSort);
    }
    else if(this.state.value == '2'){
      this.state.data2.sort(this.moneySort);
    }
    else if(this.state.value == '3'){
      this.state.data2.sort(this.distanceSort);
    }
    else if(this.state.value == '4'){
      this.state.data2.sort(this.distanceSort2);
    }
    
    
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
                {label: '운행거리 순 (낮음)', value: '4'},
                {label: '운행거리 순 (높음)', value: '3'},
                {label: '운임 순', value: '2'},
                {label: '스마트 확률 순', value: '1'},
              ]}
              style={{
                placeholder: {
                  color: 'orange'
                },
              }}
      
            />
        </View>      
      </View>
      <View style={{height: "8%", flexDirection: "row", backgroundColor : 'white'}}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 18, margin: 5}}>
            검색 반경 : 
          </Text>
        </View>
        <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
          <RNPickerSelect
              onValueChange={(value) => {
                this.filtering(value) 
              }}
              placeholder={{
                label: '검색 반경 Km를 선택하세요',
                value: null,
              }}
              useNativeAndroidPickerStyle={isAndroid? true: false}
              items={[
                {label: '10Km', value: '4'},
                {label: '30Km', value: '3'},
                {label: '50Km', value: '2'},
                {label: '100Km', value: '1'},
              ]}
              style={{
                placeholder: {
                  color: 'orange'
                },
              }}
            />
        </View>      
      </View>     
      <Divider style={{backgroundColor: 'black'}}/>     
        <FlatList 
          style={{backgroundColor : 'white'}}
          data={this.state.value? this.state.data2 : this.state.data2}
          renderItem={this._renderItem}
          keyExtractor={item => item.id}
        />                             
    </React.Fragment>
    
    );
  }
};



const styles = StyleSheet.create({
  startType: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#2F80ED'
  },
  endType: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#EB5757'
  },
  Type: {
    fontWeight: 'bold',
    fontSize: 12,
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
    fontSize: 16,
    margin: 2,  
  },
  geoTitleText: {    
    fontWeight: 'bold',
    fontSize: 15,
    margin: 2,    
  },
  timeText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  driveText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  driveText2: {
    fontWeight: 'bold',
    fontSize: 18,
    justifyContent: 'flex-start',
  },
  geoInfo11: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
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
    alignItems: 'center',
    flex: 2,
  },
  moneyInfo:{
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
  },
  icon: {
    width: 28,
    height: 28,
  },
  distance: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#E5E5E5',
  },
  freightTypeText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#219653'
  },
  freightType: {
    
    flexDirection: 'row',
    flex : 1,
  }
});