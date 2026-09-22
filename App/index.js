import React from "react";
import AppNavigator from './Navigations/AppNavigator';
import NavigatorService from '@NavigatorService';

const BaQi = () => (
  <AppNavigator
    ref={navigatorRef => {
      NavigatorService.setContainer(navigatorRef);
    }}
  />
);

export default BaQi;
