declare module 'expo/config' {
  export interface ConfigContext {
    config: any;
  }
  
  export interface ExpoConfig {
    name: string;
    slug: string;
    version: string;
    orientation: string;
    icon: string;
    userInterfaceStyle: string;
    splash: {
      image: string;
      resizeMode: string;
      backgroundColor: string;
    };
    updates: any;
    assetBundlePatterns: string[];
    ios: any;
    android: any;
    plugins: any[];
    extra: {
      [key: string]: any;
    };
    [key: string]: any;
  }
} 