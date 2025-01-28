import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    //this must be in _layout to ignore safe areas are filled
    <Stack 
    screenOptions={{
        headerShown: false
    }}
    />
  )
}

//THIS CAN ALSO BE USED ON INDIVIDUAL COMPONENTS not nav ones
// const insets = useSafeAreaInsets();
// <View
//       style={{
//         marginBottom: -insets.bottom,
//         marginTop: -insets.top,
//       }}
//     />