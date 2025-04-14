import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

export default function FullscreenImage({route, navigation}) {
    const params = route.params;
    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={() => navigation.goBack()}>
                <Ionicons name='chevron-back-outline' size={24}/>
                <Text style={{fontSize: 20}}>Back</Text>
            </Pressable>
            <Image source={{uri : params.url}} style={styles.image} />
        </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }, 
    image: {
        flex: 1,
        zIndex: 1,
    },
    button: {
        zIndex: 2,
        padding: 10,
        paddingRight: 15,
        margin: 10,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.50)',
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
    }
});