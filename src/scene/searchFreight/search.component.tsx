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
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  LayoutElement, Icon,
} from '@ui-kitten/components';
import { FORWARDIcon } from '../../assets/icons'
import { AppRoute } from '../../navigation/app-routes';

const myHtmlFile = require('../../component/tmap.html');
const isAndroid = Platform.OS==='android'

{/*<WebView source={{uri:isAndroid?'file:///android_asset/tmap.html':'./tmap.html'}}></WebView>*/}

export class SearchScreen extends Component {
  state = {
    data: [1, 2, 3]
  }

  _renderItem = ({item}) => (
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
  );

  render(){
    return (
    <React.Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <FlatList 
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