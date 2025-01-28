import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import gallery from "./gallery";
import feed from "./feed";
import { Button, StyleSheet } from "react-native";
import { colors } from '../constants/colors';



     
const Tab = createBottomTabNavigator(); 

export default function Home({navigation}) {
  return (
            <Tab.Navigator 
                screenOptions={{
                    headerStyle: {backgroundColor: colors.primary}, //nav header background
                    tabBarStyle: styles.tabBar, //tab bar background
                    tabBarActiveTintColor: "white",   // Color for active tab icons
                    tabBarInactiveTintColor: "#ccc", // Color for inactive tab icons 

                    //toolbar buttons
                    headerRight: () => ( //user profile settings
                        <Button title="Settings"
                        onPress={() => {navigation.navigate('Settings')}} 
                        color={'white'}
                        />
                    )
            }}
            >
                <Tab.Screen name="Feed" component={feed} />
                <Tab.Screen name="Gallery" component={gallery} />
            </Tab.Navigator>
  );
};

const styles = StyleSheet.create (
    {
        tabBar: {
            backgroundColor: colors.primary,
        },
    }
)
