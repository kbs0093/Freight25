import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { MainScreen } from '../scene/home'
import { TopTapBar } from '../component/toptabbar'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

export const HomeNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={props => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.MAIN} component={MainScreen}/>
  </TopTab.Navigator> 
);