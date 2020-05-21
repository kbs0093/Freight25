import React from 'react';
import { AppRoute } from './app-routes';
import { DetailScreen, StopoverScreen1, StopoverScreen2, StopoverScreen3, aloneDetailScreen } from '../scene/searchFreight'
import { TopTapBar } from '../component/toptabbar'
import { SearchTabBar } from '../component/search.Topbar'
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { CARIcon, MAPIcon} from '../assets/icons'

const TopTab = createMaterialTopTabNavigator();
const TopTab2 = createMaterialTopTabNavigator();
const Stack = createStackNavigator();


export const searchDetailNavigator = (): React.ReactElement => (
  <TopTab2.Navigator tabBar={props => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.SEARCH_DETAIL_NAVIGATOR} component={DetailNavigator}/>
  </TopTab2.Navigator>
);

export const aloneDetailNavigator = (): React.ReactElement => (
  <TopTab2.Navigator tabBar={props => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.ALONE_DETAIL_MAIN} component={aloneDetailScreen}/>
  </TopTab2.Navigator>
);


export const DetailNavigator = (): React.ReactElement => (
  <TopTab.Navigator swipeEnabled={true} tabBar={props => <SearchTabBar {...props}/>}>
    <TopTab.Screen 
        name={AppRoute.SEARCH_DETAIL_MAIN} 
        component={DetailScreen}
        options={{ title: '기본 경로', tabBarIcon: CARIcon}}
    />
    <TopTab.Screen 
        name={AppRoute.STOPOVER1} 
        component={StopoverScreen1}
        options={{ title: '경유지 1', tabBarIcon: MAPIcon}}
    />
    <TopTab.Screen 
        name={AppRoute.STOPOVER2} 
        component={StopoverScreen2}
        options={{ title: '경유지 2', tabBarIcon: MAPIcon}}
    />
    <TopTab.Screen 
        name={AppRoute.STOPOVER3} 
        component={StopoverScreen3}
        options={{ title: '경유지 3', tabBarIcon: MAPIcon}}
    />
  </TopTab.Navigator>
);