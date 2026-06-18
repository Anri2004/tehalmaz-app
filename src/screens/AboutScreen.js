import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { IconPhone, IconWhatsApp, IconMail, IconYandexPin, IconAvito, IconOrder } from '../components/Icons';

const PHONE       = '+79181409333';
const WHATSAPP    = 'https://wa.me/79181409333';
const EMAIL       = 'tehalmaz@bk.ru';
const MAP         = 'https://yandex.ru/maps/?text=45.111375,38.924446';
const AVITO       = 'https://www.avito.ru/brands/tehalmaz_krasnodar';
const PRIVACY_URL = 'https://tekhalmaz.ru/privacy.html';

// Цвета аватарок отзывов (по кругу)
const AVATAR_COLORS = ['#E5733A', '#3A9BE5', '#8E5EE8', '#E5536B', '#2BB673', '#E0A92B', '#5AA9A0'];

export default function AboutScreen() {
  const { theme } = useTheme();
  const { t } = useLang();
  const s = styles(theme);
  const reviews = t('reviews') || [];

  const Row = ({ icon, label, value, onPress }) => (
    <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={0.7}>
      <View style={s.rowIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={s.rowLabel}>{label}</Text>
        {value ? <Text style={s.rowValue}>{value}</Text> : null}
      </View>
      <Text style={s.rowArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* ОТЗЫВЫ */}
      <Text style={s.sectionTitle}>{t('about_reviews_title')}</Text>
      <Text style={s.sectionSub}>{t('about_reviews_sub')}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingVertical: 12, paddingRight: 4 }}
      >
        {reviews.map((r, i) => (
          <View key={i} style={s.reviewCard}>
            <View style={s.reviewHead}>
              <View style={[s.avatar, { backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }]}>
                <Text style={s.avatarTxt}>{(r.name || '?').trim().charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.reviewName}>{r.name}</Text>
                <Text style={s.stars}>★★★★★</Text>
              </View>
            </View>
            <Text style={s.reviewText}>«{r.text}»</Text>
          </View>
        ))}
      </ScrollView>

      {/* ГЕОГРАФИЯ */}
      <Text style={[s.sectionTitle, { marginTop: 24 }]}>{t('about_geo_title')}</Text>
      <View style={s.card}>
        <Text style={s.geoText}>{t('about_geo_text')}</Text>
      </View>

      {/* КОНТАКТЫ */}
      <Text style={[s.sectionTitle, { marginTop: 24 }]}>{t('about_contacts_title')}</Text>
      <View style={s.card}>
        <Row
          icon={<IconPhone color={theme.red} size={18} />}
          label={t('about_phone')} value="+7 (918) 140-93-33"
          onPress={() => Linking.openURL('tel:' + PHONE)}
        />
        <View style={s.divider} />
        <Row
          icon={<IconWhatsApp color="#25D366" size={20} />}
          label={t('about_whatsapp')} value="+7 (918) 140-93-33"
          onPress={() => Linking.openURL(WHATSAPP)}
        />
        <View style={s.divider} />
        <Row
          icon={<IconMail color={theme.text} size={19} />}
          label={t('about_email')} value={EMAIL}
          onPress={() => Linking.openURL('mailto:' + EMAIL)}
        />
        <View style={s.divider} />
        <Row
          icon={<IconYandexPin size={20} />}
          label={t('about_address_label')} value={t('about_address')}
          onPress={() => Linking.openURL(MAP)}
        />
        <View style={s.divider} />
        <Row
          icon={<IconAvito size={22} />}
          label={t('about_avito')}
          onPress={() => Linking.openURL(AVITO)}
        />
      </View>

      {/* ДОКУМЕНТЫ */}
      <Text style={[s.sectionTitle, { marginTop: 24 }]}>{t('about_legal_title')}</Text>
      <View style={s.card}>
        <Row
          icon={<IconOrder color={theme.text} size={18} />}
          label={t('about_privacy')}
          onPress={() => Linking.openURL(PRIVACY_URL)}
        />
      </View>

      <Text style={s.requisites}>{t('about_requisites')}</Text>
    </ScrollView>
  );
}

const styles = (t) => StyleSheet.create({
  container: { flex: 1, backgroundColor: t.bg },
  content:   { padding: 16, paddingBottom: 32 },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: t.text, marginBottom: 2 },
  sectionSub:   { fontSize: 13, color: t.textSub, marginBottom: 2 },

  // отзывы
  reviewCard: {
    width: 260, backgroundColor: t.card, borderRadius: 14, padding: 16,
    borderWidth: 0.5, borderColor: t.border,
  },
  reviewHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar:     { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarTxt:  { color: '#fff', fontSize: 18, fontWeight: '800' },
  stars:      { color: '#F5A623', fontSize: 13, letterSpacing: 2, marginTop: 2 },
  reviewText: { color: t.text, fontSize: 13.5, lineHeight: 20 },
  reviewName: { color: t.text, fontSize: 14, fontWeight: '700' },

  // карточки
  card: {
    backgroundColor: t.card, borderRadius: 14, padding: 4, marginTop: 10,
    borderWidth: 0.5, borderColor: t.border,
  },
  geoText: { color: t.textSub, fontSize: 14, lineHeight: 21, padding: 12 },

  // строка контакта
  row:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 12 },
  rowIcon:  { width: 36, height: 36, borderRadius: 10, backgroundColor: t.chip, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowLabel: { color: t.text, fontSize: 15, fontWeight: '600' },
  rowValue: { color: t.textSub, fontSize: 13, marginTop: 2 },
  rowArrow: { color: t.textMuted, fontSize: 22, marginLeft: 8 },
  divider:  { height: 0.5, backgroundColor: t.border, marginLeft: 60 },

  requisites: { color: t.textMuted, fontSize: 11.5, textAlign: 'center', marginTop: 18, lineHeight: 17 },
});
