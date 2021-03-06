import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { firebase } from "./src/firebase/config";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView, Text, View, Button, Alert } from "react-native";
import {
  LoginScreen,
  HomeScreen,
  RegistrationScreen,
  CalendarScreen,
  UserScreen,
  PetScreen,
  TouchableOpacity,
} from "./src/screens";
import { Image } from "react-native-elements";
import { decode, encode } from "base-64";
import BottomNav from "./src/Navigation/BottomNav";
import { navigationRef } from "./src/Navigation/RootNavigator";
import {
  Provider as PaperProvider,
  Drawer as PaperDrawer,
} from "react-native-paper";
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerItemList,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import styles, { colors } from "./src/screens/combinedStyles";
import { Avatar } from "react-native-elements";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const ProfileStack = createStackNavigator();
const CalStack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(null);

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#fdf9f1",
    },
  };

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => console.log(token))
      .catch((err) => console.log(err));
    return () => console.log("unmounting...");
  }, []);

  //function that checks for push notification permissions and sets the push notification token if yes
  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      this.setState({ expoPushToken: token });
    } else {
      // alert('Must use physical device for Push Notifications');
    }
  };

  //logout drawer item

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          icon={() => (
            <Ionicons name="ios-exit-outline" size={32} color={colors.yellow} />
          )}
          onPress={() => {
            firebase
              .auth()
              .signOut()
              .then(() =>
                Alert.alert(
                  "Logged Out",
                  "You are now logged out"
                  // [
                  //   {
                  //     text: "Return to login page",
                  //     onPress: () => props.navigation.navigate("Login"),
                  //   },
                  // ]
                )
              )
              .catch((error) => {
                alert(error);
              });
          }}
        />
      </DrawerContentScrollView>
    );
  }
  //pawsome logo that goes back to My Pets screen
  function LogoTitle(props) {
    return (
      <Image
        style={{ width: 200, height: 40, resizeMode: "contain" }}
        source={require("./assets/pawsome_logo.png")}
        onPress={() => props.navigation.jumpTo("My Pets")}
      />
    );
  }
  //stack navigator that renders My Profile and enables clicking to individual pet screen
  function UserProfileStack() {
    return (
      <ProfileStack.Navigator>
        <ProfileStack.Screen
          name="My Profile"
          options={({ navigation }) => ({
            headerStyle: { backgroundColor: colors.pawsomeblue },
            headerTitle: <LogoTitle navigation={navigation} />,
            headerLeft: () => (
              <Ionicons
                name="ios-menu"
                size={32}
                color={colors.yellow}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerLeftContainerStyle: { paddingLeft: 10 },
          })}
        >
          {(props) => (
            <UserScreen
              {...props}
              extraData={user}
              navigation={props.navigation}
            />
          )}
        </ProfileStack.Screen>
        <ProfileStack.Screen
          name="Pet"
          options={({ navigation }) => ({
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <Ionicons
                name={"ios-arrow-back"}
                size={32}
                color={colors.yellow}
              />
            ),
            headerStyle: { backgroundColor: colors.pawsomeblue },
            headerTitle: <LogoTitle navigation={navigation} />,
            headerLeftContainerStyle: { paddingLeft: 10 },
          })}
        >
          {(props) => <PetScreen {...props} navigation={props.navigation} />}
        </ProfileStack.Screen>
      </ProfileStack.Navigator>
    );
  }
  //stack navigator that renders My Pets screen and enables clicking to individual pet screen
  function HomeStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="My Pets"
          options={({ navigation }) => ({
            headerBackImage: () => <Ionicons name={"ios-arrow-back"} />,
            headerStyle: { backgroundColor: colors.pawsomeblue },
            headerTitle: <LogoTitle navigation={navigation} />,
            headerLeft: () => (
              <Ionicons
                name="ios-menu"
                size={32}
                color={colors.yellow}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerLeftContainerStyle: { paddingLeft: 10 },
          })}
        >
          {(props) => <BottomNav {...props} extraData={user} />}
        </Stack.Screen>
        <Stack.Screen
          name="Pet"
          options={({ navigation }) => ({
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <Ionicons
                name={"ios-arrow-back"}
                size={32}
                color={colors.yellow}
              />
            ),
            headerStyle: { backgroundColor: colors.pawsomeblue },
            headerTitle: <LogoTitle navigation={navigation} />,
            headerLeftContainerStyle: { paddingLeft: 10 },
          })}
        >
          {(props) => <PetScreen {...props} navigation={props.navigation} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }
  //stack navigator that renders the calendar/add task functionality
  function CalendarStack() {
    return (
      <CalStack.Navigator>
        <CalStack.Screen
          name="Tasks"
          options={({ navigation }) => ({
            headerStyle: { backgroundColor: colors.pawsomeblue },
            headerTitle: <LogoTitle navigation={navigation} />,
            headerLeft: () => (
              <Ionicons
                name="ios-menu"
                size={32}
                color={colors.yellow}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerLeftContainerStyle: { paddingLeft: 10 },
          })}
        >
          {(props) => <CalendarScreen {...props} extraData={user} />}
        </CalStack.Screen>
      </CalStack.Navigator>
    );
  }
  //drawer navigation
  function MyDrawer() {
    return (
      <Drawer.Navigator
        initialRouteName="My Pets"
        drawerContentOptions={{
          activeTintColor: colors.yellow,
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        drawerType="slide"
        drawerStyle={{
          backgroundColor: colors.pawsomeblue,
          width: 200,
        }}
      >
        <Drawer.Screen
          name="Profile"
          component={UserProfileStack}
          options={{
            drawerIcon: () => (
              <Avatar
                activeOpacity={0.2}
                containerStyle={{ backgroundColor: "#BDBDBD" }}
                onPress={() => alert("onPress")}
                rounded
                size="medium"
                source={{ uri: user.image }}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="My Pets"
          component={HomeStack}
          options={{
            drawerIcon: () => (
              <Ionicons
                name="ios-paw-outline"
                size={32}
                color={colors.yellow}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Tasks"
          component={CalendarStack}
          options={{
            drawerIcon: () => (
              <Ionicons
                name="ios-calendar-outline"
                size={32}
                color={colors.yellow}
              />
            ),
          }}
        />
      </Drawer.Navigator>
    );
  }

  useEffect(() => {
    const usersRef = firebase.firestore().collection("users");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            setLoading(false);
            setUser(userData);
            setIsSignedIn(true);
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        setLoading(false);
        setIsSignedIn(false);
      }
    });
    return () => console.log("unmounting...");
  }, []);

  if (loading) {
    return (
      <SafeAreaView>
        <Text>Starting up</Text>
      </SafeAreaView>
    );
  }
  //the drawer renders if logged in otherwise it renders a stack navigator for logging in or signing up
  return (
    <PaperProvider>
      <NavigationContainer theme={MyTheme} ref={navigationRef}>
        {isSignedIn ? (
          <>
            <MyDrawer />
          </>
        ) : (
          <Stack.Navigator>
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  headerBackTitleVisible: false,
                  headerStyle: { backgroundColor: colors.pawsomeblue },
                }}
              />
              <Stack.Screen
                name="Registration"
                component={RegistrationScreen}
                options={{
                  headerBackTitleVisible: false,
                  headerBackImage: () => (
                    <Ionicons
                      name={"ios-arrow-back"}
                      size={32}
                      color={colors.yellow}
                    />
                  ),
                  headerStyle: { backgroundColor: colors.pawsomeblue },
                }}
              />
            </>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}
