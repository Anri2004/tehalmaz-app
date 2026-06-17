import 'react-native-gesture-handler';
import React, { useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';

import HomeScreen       from './src/screens/HomeScreen';
import ServicesScreen   from './src/screens/ServicesScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';
import OrderScreen      from './src/screens/OrderScreen';
import AboutScreen      from './src/screens/AboutScreen';
import SplashScreen     from './src/screens/SplashScreen';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
import { LanguageProvider, useLang } from './src/context/LanguageContext';
import { IconHome, IconServices, IconCalc, IconOrder, IconAbout, IconMoon, IconSun } from './src/components/Icons';
import LangToggle from './src/components/LangToggle';

const Tab = createBottomTabNavigator();

// Ключ перевода названия вкладки по имени маршрута (имена маршрутов остаются русскими).
const TAB_KEY = {
  'Главная': 'tab_home',
  'Услуги': 'tab_services',
  'Калькулятор': 'tab_calc',
  'Заявка': 'tab_order',
  'О нас': 'tab_about',
};

function NavIcon({ name, color }) {
  const size = 24;
  if (name === 'Главная')     return <IconHome     color={color} size={size} />;
  if (name === 'Услуги')      return <IconServices color={color} size={size} />;
  if (name === 'Калькулятор') return <IconCalc     color={color} size={size} />;
  if (name === 'Заявка')      return <IconOrder    color={color} size={size} />;
  if (name === 'О нас')       return <IconAbout    color={color} size={size} />;
  return null;
}

function ThemeToggle() {
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{
        width: 34, height: 34, borderRadius: 17,
        backgroundColor: theme.chip,
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      {isDark
        ? <IconSun  color={theme.text} size={18} />
        : <IconMoon color={theme.text} size={18} />
      }
    </TouchableOpacity>
  );
}

// Заголовок экрана: крупный текст + красная чёрточка-акцент снизу.
function HeaderTitle({ text, theme }) {
  return (
    <View style={{ justifyContent: 'center' }}>
      <Text style={{ color: theme.text, fontWeight: '700', fontSize: 17 }}>{text}</Text>
      <View style={{ width: 26, height: 3, borderRadius: 2, backgroundColor: theme.red, marginTop: 4 }} />
    </View>
  );
}

// Группа кнопок в шапке: язык + тема.
function HeaderControls() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 16 }}>
      <LangToggle />
      <ThemeToggle />
    </View>
  );
}

function AppNavigator() {
  const { theme, isDark } = useContext(ThemeContext);
  const { t } = useLang();

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
        translucent={false}
      />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          title: t(TAB_KEY[route.name]),
          tabBarIcon: ({ color }) => <NavIcon name={route.name} color={color} />,
          tabBarActiveTintColor:   theme.red,
          tabBarInactiveTintColor: theme.textMuted,
          tabBarStyle: {
            backgroundColor: theme.navbar,
            borderTopColor:  theme.border,
            borderTopWidth:  0.5,
            paddingBottom:   6,
            paddingTop:      4,
            height:          58,
          },
          tabBarLabelStyle: { fontSize: 11 },
          headerStyle: {
            backgroundColor: theme.header,
            borderBottomWidth: 0,
            shadowColor:   '#000',
            shadowOffset:  { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius:  5,
            elevation:     5,
          },
          headerTintColor:      theme.text,
          headerTitle:          () => <HeaderTitle text={t(TAB_KEY[route.name])} theme={theme} />,
          headerTitleAlign:     'left',
          headerRight: () => <HeaderControls />,
        })}
      >
        <Tab.Screen name="Главная"     component={HomeScreen}     options={{ headerShown: false }} />
        <Tab.Screen name="Услуги"      component={ServicesScreen} />
        <Tab.Screen name="Калькулятор" component={CalculatorScreen} />
        <Tab.Screen name="Заявка"      component={OrderScreen} />
        <Tab.Screen name="О нас"       component={AboutScreen} />
      </Tab.Navigator>
    </>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
