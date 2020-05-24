import React from 'react';
import { AppRoute } from './app-routes';
import { StopoverScreen1, StopoverScreen2, StopoverScreen3 } from '../scene/stopoverFreight'
import { TopTapBar } from '../component/toptabbar'
import { SearchTabBar } from '../component/search.Topbar'
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { CARIcon } from '../assets/icons'

const TopTab = createMaterialTopTabNavigator();
const TopTab2 = createMaterialTopTabNavigator();
const Stack = createStackNavigator();


export const StopoverADNavigator = (): React.ReactElement => (
  <TopTab2.Navigator tabBar={props => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.STOPOVERAD_MAIN} component={StopoverNavigator}/>
  </TopTab2.Navigator>
);

export const StopoverNavigator = (): React.ReactElement => (
  <TopTab2.Navigator tabBar={props => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.STOPOVER_MAIN} component={StopoverMainNavigator}/>
  </TopTab2.Navigator>
);


export const StopoverMainNavigator = (): React.ReactElement => (
  <TopTab.Navigator swipeEnabled={true} tabBar={props => <SearchTabBar {...props}/>}>
    <TopTab.Screen 
        name={AppRoute.STOPOVER1} 
        component={StopoverScreen1}
        options={{ title: '경유지 1', tabBarIcon: CARIcon}}
    />
    <TopTab.Screen 
        name={AppRoute.STOPOVER2} 
        component={StopoverScreen2}
        options={{ title: '경유지 2', tabBarIcon: CARIcon}}
    />
    <TopTab.Screen 
        name={AppRoute.STOPOVER3} 
        component={StopoverScreen3}
        options={{ title: '경유지 3', tabBarIcon: CARIcon}}
    />
  </TopTab.Navigator>
);