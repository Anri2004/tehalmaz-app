import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { LogoFull, IconPhone, IconWhatsApp, IconMoon, IconSun } from '../components/Icons';
import LangToggle from '../components/LangToggle';

const PHONE = '+79181409333';
const WHATSAPP = 'https://wa.me/79181409333';

export default function HomeScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { t } = useLang();
  const s = styles(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView style={s.container} contentContainerStyle={s.content}>

        {/* Язык + тема (вместо заголовка) */}
        <View style={s.topRow}>
          <LangToggle />
          <TouchableOpacity
            onPress={toggleTheme}
            style={[s.themeBtn, { backgroundColor: theme.chip }]}
          >
            {isDark
              ? <IconSun  color={theme.text} size={18} />
              : <IconMoon color={theme.text} size={18} />
            }
          </TouchableOpacity>
        </View>

        {/* Логотип из SVG-файла (текст ТЕХАЛМАЗ сверху + бриллиант с обводкой) */}
        <View style={s.logoBlock}>
          <LogoFull width={160} height={128} />
        </View>

        {/* О компании */}
        <View style={s.card}>
          <Text style={s.bodyText}>
            <Text style={s.bold}>{t('home_company')}</Text>
            {t('home_about')}
          </Text>
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statNum}>{t('home_stat_years_num')}</Text>
              <Text style={s.statLabel}>{t('home_stat_years_lbl')}</Text>
            </View>
            <View style={[s.stat, s.statBorder]}>
              <Text style={s.statNum}>{t('home_stat_obj_num')}</Text>
              <Text style={s.statLabel}>{t('home_stat_obj_lbl')}</Text>
            </View>
            <View style={[s.stat, s.statBorder]}>
              <Text style={s.statNum}>{t('home_stat_support_num')}</Text>
              <Text style={s.statLabel}>{t('home_stat_support_lbl')}</Text>
            </View>
          </View>
        </View>

        {/* Кнопка звонка */}
        <TouchableOpacity
          style={s.callCard}
          onPress={() => Linking.openURL('tel:' + PHONE)}
        >
          <View style={s.callIconWrap}>
            <IconPhone color="#fff" size={22} />
          </View>
          <View style={s.callText}>
            <Text style={s.callLabel}>{t('home_call_label')}</Text>
            <Text style={s.callNumber}>+7 (918) 140-93-33</Text>
          </View>
          <Text style={s.callArrow}>{'>'}</Text>
        </TouchableOpacity>

        {/* WhatsApp */}
        <TouchableOpacity
          style={s.btnWhatsApp}
          onPress={() => Linking.openURL(WHATSAPP)}
          activeOpacity={0.85}
        >
          <IconWhatsApp color="#fff" size={20} />
          <Text style={s.btnWhatsAppText}>{t('home_btn_whatsapp')}</Text>
        </TouchableOpacity>

        {/* Калькулятор */}
        <TouchableOpacity
          style={s.btnRed}
          onPress={() => navigation.navigate('Калькулятор')}
        >
          <Text style={s.btnRedText}>{t('home_btn_calc')}</Text>
        </TouchableOpacity>

        {/* Заявка */}
        <TouchableOpacity
          style={s.btnOutline}
          onPress={() => navigation.navigate('Заявка')}
        >
          <Text style={[s.btnOutlineText, { color: theme.text }]}>
            {t('home_btn_order')}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (t) => StyleSheet.create({
  container: { flex: 1, backgroundColor: t.bg },
  content:   { padding: 16, paddingTop: 8, paddingBottom: 40 },

  topRow:   { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, paddingTop: 8, paddingBottom: 4 },
  themeBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  logoBlock:{ alignItems: 'center', paddingBottom: 24 },

  card: {
    backgroundColor: t.card, borderRadius: 14, padding: 16, marginBottom: 12,
    borderWidth: 0.5, borderColor: t.border,
  },
  bodyText:  { fontSize: 15, color: t.text, lineHeight: 22 },
  bold:      { fontWeight: '700' },

  statsRow:   { flexDirection: 'row', marginTop: 14, backgroundColor: t.statBg, borderRadius: 10, overflow: 'hidden' },
  stat:       { flex: 1, alignItems: 'center', paddingVertical: 12 },
  statBorder: { borderLeftWidth: 1, borderLeftColor: t.border },
  statNum:    { fontSize: 16, fontWeight: '700', color: t.text },
  statLabel:  { fontSize: 11, color: t.textSub, marginTop: 2 },

  callCard: {
    backgroundColor: t.card, borderRadius: 14, padding: 14,
    marginTop: 4, marginBottom: 16,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 0.5, borderColor: t.border,
  },
  callIconWrap: {
    width: 46, height: 46, borderRadius: 13,
    backgroundColor: t.red,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  callText:   { flex: 1 },
  callLabel:  { fontSize: 10, color: t.textSub, fontWeight: '600', letterSpacing: 0.3, marginBottom: 3 },
  callNumber: { fontSize: 17, fontWeight: '700', color: t.text },
  callArrow:  { fontSize: 20, color: t.textMuted, marginLeft: 6 },

  btnRed: {
    backgroundColor: t.red, borderRadius: 14, padding: 17,
    alignItems: 'center', marginBottom: 10,
  },
  btnRedText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  btnWhatsApp: {
    backgroundColor: '#25D366', borderRadius: 14, padding: 15, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  btnWhatsAppText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  btnOutline: {
    backgroundColor: t.card, borderRadius: 14, padding: 16,
    alignItems: 'center', borderWidth: 0.5, borderColor: t.border,
  },
  btnOutlineText: { fontWeight: '600', fontSize: 16 },
});
