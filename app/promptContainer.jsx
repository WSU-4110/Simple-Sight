import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/colors';

export default function PromptContainer() {
    const [dailyPrompt, setDailyPromt] = useState('')

    useEffect(() => {
        async function getPrompt() {
            const dailyPrompt = await AsyncStorage.getItem("dailyPrompt");
            return dailyPrompt;
        }
        setDailyPromt(getPrompt());
    }, [])

    return (
        <View style={styles.promptContainer}>
            <Text style={styles.promptText}>📸 Daily Prompt:</Text>
            <Text style={styles.prompt}>{dailyPrompt || "Loading..."}</Text>
        </View>
  )
}

const styles = StyleSheet.create({
    promptContainer: {
      backgroundColor: colors.prmoptContainerBackground,
      padding: 0.1,
      paddingBottom: 5,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    promptText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    prompt: {
      fontSize: 16,
      fontStyle: "italic",
      textAlign: "center",
      marginTop: 5,
      color: "#FFFFFF",
    },
  });