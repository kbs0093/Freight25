import React, {useState} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  LayoutElement,
  Icon,
  Text,
} from '@ui-kitten/components';
import {StopoverADScreenProps} from '../../navigation/home.navigator';
import {AppRoute} from '../../navigation/app-routes';


export const StopoverADScreen = (props: StopoverADScreenProps): LayoutElement => {

  const ApplyButton = () => {
    props.navigation.navigate(AppRoute.STOPOVER);
  };

  const DenyButton = () => {
    props.navigation.navigate(AppRoute.HOME);
  };

  return (
    <React.Fragment>
      <View style={{backgroundColor: 'white', flex: 1}}>        
      <View style={{backgroundColor: 'white', flexDirection: 'row'}}>
        <View style={{flex:3, flexDirection: 'row', margin: 5}}>
          <View style={{flex:1, alignItems: 'center'}}><Text style={{textAlign: 'center',fontWeight: 'bold', fontSize: 16,}}>1.</Text></View>
          <View style={{flex:5, flexDirection: 'row'}}>
            <View style={{flex: 2}}><Text style={{textAlign: 'center',fontWeight: 'bold',fontSize: 16,}}>충남 천안</Text></View>
            <View style={{flex: 1}}><Text style={{fontWeight: 'bold', color: '#2F80ED' ,fontSize: 16,}}>당상</Text></View>
          </View>
          <View style={{flex:1}}><Icon style={styles.icon2} fill='black' name='arrow-forward-outline'/></View>
          <View style={{flex:5, flexDirection: 'row'}}>
            <View style={{flex: 2}}><Text style={{textAlign: 'center',fontWeight: 'bold', fontSize: 16,}}>서울 송파</Text></View>
            <View style={{flex: 1}}><Text style={{fontWeight: 'bold', color: '#EB5757', fontSize: 16,}}>당착</Text></View>
          </View>
        </View>
        <View style={{flex:1, margin: 5}}><Text style={{fontWeight: 'bold',fontSize: 16,}}>120,000원</Text></View>
      </View>

      <View style={{backgroundColor: 'white', flexDirection: 'row'}}>
        <View style={{flex:3, flexDirection: 'row', margin: 5}}>
          <View style={{flex:1, alignItems: 'center'}}><Text style={{textAlign: 'center',fontWeight: 'bold', fontSize: 16,}}>2.</Text></View>
          <View style={{flex:5, flexDirection: 'row'}}>
            <View style={{flex: 2}}><Text style={{textAlign: 'center',fontWeight: 'bold',fontSize: 16,}}>충남 천안</Text></View>
            <View style={{flex: 1}}><Text style={{fontWeight: 'bold', color: '#2F80ED' ,fontSize: 16,}}>당상</Text></View>
          </View>
          <View style={{flex:1}}><Icon style={styles.icon2} fill='black' name='arrow-forward-outline'/></View>
          <View style={{flex:5, flexDirection: 'row'}}>
            <View style={{flex: 2}}><Text style={{textAlign: 'center',fontWeight: 'bold', fontSize: 16,}}>서울 송파</Text></View>
            <View style={{flex: 1}}><Text style={{fontWeight: 'bold', color: '#EB5757', fontSize: 16,}}>당착</Text></View>
          </View>
        </View>
        <View style={{flex:1, margin: 5}}><Text style={{fontWeight: 'bold',fontSize: 16,}}>120,000원</Text></View>
      </View>

      <View style={{backgroundColor: 'white', flexDirection: 'row'}}>
        <View style={{flex:3, flexDirection: 'row', margin: 5}}>
          <View style={{flex:1, alignItems: 'center'}}><Text style={{textAlign: 'center',fontWeight: 'bold', fontSize: 16,}}>3.</Text></View>
          <View style={{flex:5, flexDirection: 'row'}}>
            <View style={{flex: 2}}><Text style={{textAlign: 'center',fontWeight: 'bold',fontSize: 16,}}>충남 천안</Text></View>
            <View style={{flex: 1}}><Text style={{fontWeight: 'bold', color: '#2F80ED' ,fontSize: 16,}}>당상</Text></View>
          </View>
          <View style={{flex:1}}><Icon style={styles.icon2} fill='black' name='arrow-forward-outline'/></View>
          <View style={{flex:5, flexDirection: 'row'}}>
            <View style={{flex: 2}}><Text style={{textAlign: 'center',fontWeight: 'bold', fontSize: 16,}}>서울 송파</Text></View>
            <View style={{flex: 1}}><Text style={{fontWeight: 'bold', color: '#EB5757', fontSize: 16,}}>당착</Text></View>
          </View>
        </View>
        <View style={{flex:1, margin: 5}}><Text style={{fontWeight: 'bold',fontSize: 16,}}>120,000원</Text></View>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{flex: 1}}> 
          <Button style={{margin: 8}} onPress={ApplyButton} status='success'>수 락</Button>
        </View>
        <View style={{flex: 1}}>
          <Button style={{margin: 8}} onPress={DenyButton} status='danger'>거 부</Button>
        </View>
      </View>
      </View>
      </React.Fragment>
  ); 
  
};

const styles = StyleSheet.create({
  icon2:{
    justifyContent: 'center',
    width: 20,
    height: 15,
  },
});
