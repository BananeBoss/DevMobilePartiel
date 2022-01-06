import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Navigation from './src/navigation/Navigation';
import { Store, Persistor } from './src/store/config';

export default function App() {
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={Persistor}>
        <NavigationContainer>
          <Navigation />
          <StatusBar style="auto" />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
