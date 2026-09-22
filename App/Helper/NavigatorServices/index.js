import { Platform } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation';
let _container; // eslint-disable-line

function setContainer(container: Object) {
  _container = container;
}

async function reset(routeName: string, params?: NavigationParams) {
  _container.dispatch(
    StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          type: 'Navigation/NAVIGATE',
          routeName,
          params,
        }),
      ],
    }),
  );
}

async function navigate(routeName: string, params?: NavigationParams) {
  _container.dispatch(
    NavigationActions.navigate({
      type: 'Navigation/NAVIGATE',
      routeName,
      params,
    }),
  )
}

export default {
  setContainer,
  reset,
  navigate
}
