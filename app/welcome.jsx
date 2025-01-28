import { Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Welcome({navigation}) {
  return (
    <SafeAreaView
    
    >
      <Text>This is the welcome screen where users can log in or create accounts</Text>

      <Button title='Log In' onPress={() => {navigation.navigate('Home')}} />
    </SafeAreaView>
  )
}