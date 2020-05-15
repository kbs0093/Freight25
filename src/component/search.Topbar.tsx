import React from 'react';
import {
  Button,
  Layout,
  LayoutElement,
  Icon,
  Text,
  TopNavigation,
  TopNavigationAction,
  OverflowMenu,
  Divider,
  TabBar, Tab, TabElement
} from '@ui-kitten/components';

export const SearchTabBar = (props): LayoutElement => {

  const onTabSelect = (index: number): void => {
    const selectedTabRoute: string = props.state.routeNames[index];
    props.navigation.navigate(selectedTabRoute);
  };

  const createNavigationTabForRoute = (route): TabElement => {
    const { options } = props.descriptors[route.key];
    return (
      <Tab
        key={route.key}
        title={options.title}
        icon={options.tabBarIcon}
      />
    );
  };

  return (
    <React.Fragment>
      <TabBar selectedIndex={props.state.index} onSelect={onTabSelect}>
        {props.state.routes.map(createNavigationTabForRoute)}
      </TabBar>
      <Divider/>
    </React.Fragment>

  );
};