import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens';
import CalendarScreen from '../screens/CalendarScreen/CalendarScreen';
import {colors} from "../screens/combinedStyles.js"
import UserScreen from "../screens/UserScreen/UserScreen"


// function Feed() {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <HomeScreen />
//       </View>
//     );
//   }
  
  // function Profile() {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <Text>Profile!</Text>
  //     </View>
  //   );
  // }
  
  // function Notifications() {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <Text>Notifications!</Text>
  //     </View>
  //   );
  // }
  
  const Tab = createMaterialBottomTabNavigator();
  
  export default function BottomNav(props) {
    return (
      <Tab.Navigator
        shifting={true}
        initialRouteName="Home"
        activeColor={colors.yellow}
        inactiveColor={'black'}
        labelStyle={{ fontSize: 12 }}
        barStyle={{ backgroundColor: colors.pawsomeblue }}
      >
        <Tab.Screen
          name="Home"
          children={() => <HomeScreen extraData={props.extraData} />}
          options={{
            tabBarLabel: 'My Pets',
            tabBarIcon: ({ color }) => (
              <Ionicons name="ios-paw-outline" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          children={() => <UserScreen extraData={props.extraData} />}
          options={{
            tabBarLabel: 'Pets I Sit',
            tabBarIcon: ({ color }) => (
              <Ionicons name="ios-heart-outline" color={color} size={26} />
            ),
          }}
        /> 
      </Tab.Navigator>
    );
  }