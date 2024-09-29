import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Button, Pressable, StyleSheet } from "react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { getUserData, logoutSuccess } from "@/redux/actions/auth";
import Toast from "react-native-toast-message";

export default function TabLayout() {
  const dispatch = useDispatch();

  const colorScheme = useColorScheme();

  // id_photo
  // potrait
  // nickname
  // name
  // gender

  const LOGOUT_MUTATION = gql`
    mutation {
      logout {
        status
        message
      }
    }
  `;

  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const logout = () => {
    // setLoading(true);
    try {
      logoutMutation({
        onCompleted: (infoData: Object) => {
          console.log(infoData);
          // setLoading(false);
          Toast.show({
            type: "success",
            text1: "Logged Out, Please Relogin",
            visibilityTime: 3000,
          });
        },
        onError: ({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) => {
              // alert("Registration failed. Please try again. /n" + message);
              console.log(message);
              Toast.show({
                type: "error",
                text1: "Logged Out with Error",
                visibilityTime: 3000,
              });
            });
          }
          if (networkError) {
            console.log(networkError);
            // console.log(message);
            Toast.show({
              type: "error",
              text1: "Logged Out with Network Error",
              visibilityTime: 3000,
            });
          }
        },
      });
    } catch (err) {
      console.log("functionerror, ", err);
      Toast.show({
        type: "error",
        text1: "An Error occuered. Please try again later",
        visibilityTime: 3000,
      });
    } finally {
      // setLoading(false);
      dispatch(logoutSuccess());
      router.replace("/");
    }
  };

  const GET_USER_DATA = gql`
    query Query {
      me {
        id
        mobile_number
        agent_linked_code
        balance
        has_pin
      }
    }
  `;
  const { loading, data, error, refetch } = useQuery(GET_USER_DATA);

  // useEffect(() => {X
  //   try {
  //     refetch();
  //   } catch (error) {
  //     logout();
  //   }
  // }, []); // Empty dependency array to run on mount

  if (data) {
    console.log("test", data);
    dispatch(getUserData(data?.me));
  }

  if(error){
    logout();
  }

  // useEffect(() => {
  //   console.log(data)
  //   // dispatch((infoData));
  // },[])

  return (
    <Tabs
    
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: styles.tabBar
      }}
    >
      <Tabs.Screen
      
        name="home"
        options={{
          tabBarStyle: styles.tabBar,
          title: "Homes",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
          tabBarButton: (props) => (
            <Pressable
              android_ripple={{
                color: "white", // Color of the ripple effect
                borderless: false, // Makes the ripple confined to the button area
              }}
              {...props} // Spread props to ensure tab functionality (like navigation) still works
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "code-slash" : "code-slash-outline"}
              color={color}
            />
          ),
          tabBarButton: (props) => (
            <Pressable
              android_ripple={{
                color: "white", // Color of the ripple effect
                borderless: false, // Makes the ripple confined to the button area
              }}
              {...props} // Spread props to ensure tab functionality (like navigation) still works
            />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "About Me",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
            />
          ),
          tabBarButton: (props) => (
            <Pressable
              android_ripple={{
                color: "white", // Color of the ripple effect
                borderless: false, // Makes the ripple confined to the button area
              }}
              {...props} // Spread props to ensure tab functionality (like navigation) still works
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
            />
          ),
          tabBarButton: (props) => (
            <Button
              title="Go to Index Page"
              onPress={() => router.replace('/index')} // Use router.push to navigate
            />
          ),
        }}
      /> */}
    </Tabs>
  );
}


const styles = StyleSheet.create({
  tabBar: {
    // backgroundColor: "#ffffff", // Custom background color for the tab bar
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0", // Border for the top of the tab bar
    height: 65, // Height of the tab bar
    // borderTopLeftRadius: 50,
    // borderTopRightRadius: 50
    paddingBottom:10
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // paddingVertical: 20, // Padding for the tab button
  },
});