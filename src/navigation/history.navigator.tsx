import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { HistoryScreen } from '../scene/historyFreight'
import { TopTapBar } from '../component/toptabbar'

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

export const HistoryNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={props => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.HISTORY_MAIN} component={HistoryScreen}/>
  </TopTab.Navigator>  
);