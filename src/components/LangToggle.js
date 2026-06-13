import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';

// Кнопка-переключатель языка. Показывает язык, на который переключит.
export default function LangToggle({ style }) {
  const { theme } = useTheme();
  const { lang, toggleLang } = useLang();
  return (
    <TouchableOpacity
      onPress={toggleLang}
      style={[{
        height: 34, minWidth: 40, paddingHorizontal: 10, borderRadius: 17,
        backgroundColor: theme.chip, alignItems: 'center', justifyContent: 'center',
      }, style]}
    >
      <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13 }}>
        {lang === 'ru' ? 'EN' : 'RU'}
      </Text>
    </TouchableOpacity>
  );
}
