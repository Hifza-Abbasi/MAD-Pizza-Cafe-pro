// import React, { useEffect, useState } from 'react';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { auth } from './firebase/config';

import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import HomeScreen from './Screens/HomeScreen';
import MenuScreen from './Screens/MenuScreen';
import CartScreen from './Screens/CartScreen';
import OrderScreen from './Screens/OrdersScreen';
import ProfileScreen from './Screens/ProfileScreen';
import PaymentScreen from './Screens/PaymentScreen';

const Stack = createStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(user => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return subscriber;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#e67e22" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* //Register all screens unconditionally */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home">
          {() => user ? <HomeScreen /> : <LoginScreen />}
        </Stack.Screen>
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
  <Stack.Screen name="Order" component={OrderScreen} /> 
         <Stack.Screen name="Profile" component={ProfileScreen} />  
        <Stack.Screen name="Payment" component={PaymentScreen} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { View, ActivityIndicator } from 'react-native';
// import { auth } from './firebase/config';

// import LoginScreen from './Screens/LoginScreen';
// import RegisterScreen from './Screens/RegisterScreen';
// import HomeScreen from './Screens/HomeScreen';
// import MenuScreen from './Screens/MenuScreen';
// import CartScreen from './Screens/CartScreen';

// const Stack = createStackNavigator();

// export default function App() {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const subscriber = auth.onAuthStateChanged(user => {
//       setUser(user);
//       if (initializing) setInitializing(false);
//     });

//     return subscriber;
//   }, []);

//   if (initializing) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#e67e22" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {user ? (
//           <Stack.Screen name="Home" component={HomeScreen} />
//         ) : null}
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Register" component={RegisterScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { View, ActivityIndicator } from 'react-native';
// import { auth } from './firebase/config';

// import LoginScreen from './Screens/LoginScreen';
// import HomeScreen from './Screens/HomeScreen';
// import RegisterScreen from './Screens/RegisterScreen';

// const Stack = createStackNavigator();

// export default function App() {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const subscriber = auth.onAuthStateChanged(user => {
//       setUser(user);
//       if (initializing) setInitializing(false);
//     });

//     return subscriber; // unsubscribe on unmount
//   }, []);

//   if (initializing) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#e67e22" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {user ? (
//           <Stack.Screen name="Home" component={HomeScreen} />
//         ) : (
//           <Stack.Screen name="Login" component={LoginScreen} />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import auth from '@react-native-firebase/auth';
// import { View, ActivityIndicator } from 'react-native';
// import LoginScreen from './screens/LoginScreen';
// import HomeScreen from './screens/HomeScreen';
// import MenuScreen from './screens/MenuScreen';
// import CartScreen from './screens/CartScreen';
// import OrderScreen from './screens/OrderScreen';
// import ProfileScreen from './screens/ProfileScreen';
// import SettingsScreen from './screens/SettingsScreen';

// const Stack = createStackNavigator();

// function App() {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState(null);

//   function onAuthStateChanged(user) {
//     setUser(user);
//     if (initializing) setInitializing(false);
//   }

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return subscriber;
//   }, []);

//   if (initializing) return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><ActivityIndicator size="large" /></View>;

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {user ? (
//           <>
//             <Stack.Screen name="Home" component={HomeScreen} />
//             <Stack.Screen name="Menu" component={MenuScreen} />
//             <Stack.Screen name="Cart" component={CartScreen} />
//             <Stack.Screen name="Order" component={OrderScreen} />
//             <Stack.Screen name="Profile" component={ProfileScreen} />
//             <Stack.Screen name="Settings" component={SettingsScreen} />
//           </>
//         ) : (
//           <Stack.Screen name="Login" component={LoginScreen} />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;

