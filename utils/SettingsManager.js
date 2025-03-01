import AsyncStorage from '@react-native-async-storage/async-storage';

class SettingsManager {
  static instance = null;
  settings = {
    username: 'YourUsername',
    password: 'password',
    securityQuestion: 'Your favorite color?',
    securityAnswer: '',
    notificationsEnabled: true,
    startTime: new Date().setHours(8, 0, 0, 0),
    endTime: new Date().setHours(20, 0, 0, 0),
  };

  constructor() {
    if (!SettingsManager.instance) {
      SettingsManager.instance = this;
      this.loadSettings();
    }
    return SettingsManager.instance;
  }

  async loadSettings() {
    try {
      const storedSettings = await AsyncStorage.getItem('appSettings');
      if (storedSettings) {
        this.settings = JSON.parse(storedSettings);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }

  async saveSettings() {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }

  getSetting(key) {
    return this.settings[key];
  }

  async updateSetting(key, value) {
    this.settings[key] = value;
    await this.saveSettings();
  }
}

export default new SettingsManager();
