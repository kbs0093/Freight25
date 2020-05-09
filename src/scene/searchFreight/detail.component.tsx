import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  StyleSheet,
  View,
  Linking,
  Platform,
  SafeAreaView,
  FlatList,
  FlatListProps,
  ScrollView,
} from 'react-native';
import {
  LayoutElement,
  Icon,
  Divider,
  Button,
} from '@ui-kitten/components';
import { WebView } from 'react-native-webview';
import { DetailScreenProps } from '../../navigation/search.navigator';
import { AppRoute } from '../../navigation/app-routes';
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler';

const myHtmlFile = require('../../component/tmap.html');
const isAndroid = Platform.OS ==='android';


export class DetailScreen extends React.Component <DetailScreenProps> {

  WebViewRef;
  state = {
    index: 0,
    data: [
      {
        id: '1',
        startX: '127.370187',
        startY: '36.334634',
        finishX: '127.043625',
        finishY: '37.280209',
      },
      {
        id: '2',
        startX: '127.370187',
        startY: '36.334634',
        finishX: '127.043625',
        finishY: '37.280209',
      },
      {
        id: '3',
        startX: '127.370187',
        startY: '36.334634',
        finishX: '127.043625',
        finishY: '37.280209',
      }
    ]
  };

  reload(){
    this.WebViewRef && this.WebViewRef.reload();
  };

  componentDidMount() {
    this.reload();
  };


  
  renderItem = ({item}) => (
    <TouchableOpacity>
      <View style={{height: 25, flexDirection: 'row'}}>
      <View style={{flex:3, flexDirection: 'row'}}>
        <View style={{flex:5, flexDirection: 'row'}}>
          <View style={{flex: 2}}><Text style={{textAlign: 'center',fontWeight: 'bold'}}>충남 천안</Text></View>
          <View style={{flex: 1}}><Text style={{fontWeight: 'bold', color: '#2F80ED'}}>당상</Text></View>
        </View>
        <View style={{flex:1}}><Icon style={styles.icon2} fill='black' name='arrow-forward-outline'/></View>
        <View style={{flex:5, flexDirection: 'row'}}>
          <View style={{flex: 2}}><Text style={{textAlign: 'center',fontWeight: 'bold'}}>서울 송파</Text></View>
          <View style={{flex: 1}}><Text style={{fontWeight: 'bold', color: '#EB5757'}}>당착</Text></View>
        </View>
      </View>
      <View style={{flex:1}}><Text style={{fontWeight: 'bold'}}>120,000원</Text></View>
    </View>
    </TouchableOpacity>    
  );

  render(){
    return (
      <React.Fragment>
        <View style={{height: 80, backgroundColor: 'white'}}>
          <Text style={styles.Title}>  배차 정보</Text>
          <View style={styles.MainInfo}>
            <View style={styles.MainInfoGeo}>
              <Text style={styles.geoText}>대전 서구</Text>
              <Text style={styles.startType}>  당상</Text>
            </View>
            <View style={styles.MainInfoIcon}>
              <Icon style={styles.icon} fill='black' name='arrow-forward-outline'/>
              <Text style={styles.Type}>혼적</Text>
            </View>            
            <View style={styles.MainInfoGeo2}>
              <Text style={styles.endType}>당착  </Text>
              <Text style={styles.geoText}>서울 성북</Text>              
            </View>
          </View>
          <Divider style={{backgroundColor: 'black'}}/>
        </View> 

        <ScrollView>
          <View style={{height: 230, backgroundColor: 'white'}}>
            <Text style={styles.Title}>  배차 정보 (Tmap)</Text>
            <WebView
              ref={WEBVIEW_REF => (this.WebViewRef = WEBVIEW_REF)}
              source={{uri:isAndroid?'file:///android_asset/tmap.html':'./external/tmap.html'}}
              startInLoadingState={true}
            />
            <Divider style={{backgroundColor: 'black'}}/>
          </View>
                
          <View style={{backgroundColor: 'white'}}>          
            <Text style={styles.Title}>  경유지 정보</Text>
            <FlatList 
              style={{backgroundColor : 'white'}}              
              data={this.state.data}
              renderItem={this.renderItem}
            />
            <Divider style={{backgroundColor: 'black'}}/>
          </View>

          <View style={{backgroundColor: 'white'}}>          
            <Text style={styles.Title}>  화물 상세 정보</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex:3, alignItems:'flex-end'}}><Text style={styles.freightTitle}>운행거리 / 운임 : </Text></View>
              <View style={{flex:5, alignItems:'center'}}><Text style={styles.freightTitle}>187.9Km / 1079원</Text></View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex:3, alignItems:'flex-end'}}><Text style={styles.freightTitle}>화물정보 및 적재 : </Text></View>
              <View style={{flex:5, alignItems:'center'}}><Text style={styles.freightTitle}>6톤 / 6파렛 / 지게차</Text></View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex:3, alignItems:'flex-end'}}><Text style={styles.freightTitle}>상차지 주소 : </Text></View>
              <View style={{flex:5, alignItems:'center'}}><Text style={styles.freightTitle}>대전광역시 서구 내동 27-3</Text></View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex:3, alignItems:'flex-end'}}><Text style={styles.freightTitle}>하차지 주소 : </Text></View>
              <View style={{flex:5, alignItems:'center'}}><Text style={styles.freightTitle}>서울특별시 성북구 정릉동 11-7</Text></View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex:3, alignItems:'flex-end'}}><Text style={styles.freightTitle}>특이사항 : </Text></View>
              <View style={{flex:5, alignItems:'center'}}><Text style={styles.freightTitle}>하차대기 없습니다</Text></View>
            </View>
            <Divider style={{backgroundColor: 'black'}}/>
          </View>   
        </ScrollView>

        <Divider style={{backgroundColor: 'black'}}/>
        <View style={{backgroundColor: 'white', flexDirection: 'row'}}>          
          <View style={{flex:3}}>
            <Text style={{fontWeight: 'bold', fontSize: 16, margin: 5}}>  스마트 확률</Text>
            <View style={{alignItems: 'flex-end', justifyContent: 'flex-start'}}>
              <Text style={{margin:2, fontSize: 14, fontWeight: 'bold', color: '#BDBDBD'}}>   하차지 서울 성북에서 화물이 있을 확률 </Text>
            </View>            
          </View>       
          <View style={{flex:1, alignItems:'center', justifyContent:'flex-end'}}><Text style={{fontSize: 26, fontWeight: 'bold'}}>87%</Text></View>
          <Divider style={{backgroundColor: 'black'}}/>
        </View>

        <Divider style={{backgroundColor: 'black'}}/>
        <View style={{backgroundColor: 'white', flexDirection: 'row'}}>          
          <View style={{flex:5, justifyContent: 'center'}}>
            <Text style={styles.freightTitle}>      총 운행거리 : 250km </Text>
            <Text style={styles.freightTitle}>      총 운행운임 : 200,000원 </Text>
          </View>
          <View style={{flex:2, alignItems: 'center', justifyContent: 'center'}}>
            <Button style={styles.button} status='success'>수 락</Button>
          </View>
        </View>      
      </React.Fragment>      
    );
  };  
};

const styles = StyleSheet.create({
  Title:{
    fontWeight: 'bold',
    fontSize: 16,   
    margin: 5,
  },
  MainInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  MainInfoGeo: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex : 2,
    flexDirection: 'row'
  },
  MainInfoGeo2: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex : 2,
    flexDirection: 'row'
  },
  MainInfoType: {
    justifyContent: 'center',
    alignItems: 'center',
    flex : 2,
  },
  MainInfoIcon: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex : 1,    
  },
  MainInfoType2: {
    justifyContent: 'center',
    alignItems: 'center',
    flex : 1,    
  },
  geoText:{
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 24,    
  },
  icon: {
    width: 32,
    height: 24,
  },
  icon2:{
    justifyContent: 'center',
    width: 20,
    height: 15,
  },
  startType: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#2F80ED'
  },
  Type:{
    fontWeight: 'bold',
    fontSize: 14,
    color: '#9B51E0'
  },
  endType: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#EB5757'
  },
  freightTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    margin: 5
  },
  button:{
    margin: 5
  }
});