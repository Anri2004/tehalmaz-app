import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';

export default function ServicesScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const s = styles(theme);
  const [expanded, setExpanded] = useState(null);

  // 3 главные категории. Специфика (материал, толщина, коэффициенты) — в калькуляторе.
  const SERVICES = [
    { id: 1, calc: 'drill', title: t('svc_drill_title'), sub: t('svc_drill_sub'), price: t('svc_drill_price'), items: t('svc_drill_items'), note: t('svc_drill_note') },
    { id: 2, calc: 'cut',   title: t('svc_cut_title'),   sub: t('svc_cut_sub'),   price: t('svc_cut_price'),   items: t('svc_cut_items'),   note: t('svc_cut_note') },
    { id: 3, calc: 'demo',  title: t('svc_demo_title'),  sub: t('svc_demo_sub'),  price: t('svc_demo_price'),  items: t('svc_demo_items'),  note: t('svc_demo_note') },
  ];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {SERVICES.map(svc => (
        <TouchableOpacity
          key={svc.id}
          style={s.card}
          onPress={() => setExpanded(expanded === svc.id ? null : svc.id)}
          activeOpacity={0.85}
        >
          <View style={s.row}>
            <View style={s.thumb}>
              <Text style={s.thumbText}>{svc.title.split(' ').slice(-1)[0].toLowerCase()}</Text>
            </View>
            <View style={s.info}>
              <Text style={s.title}>{svc.title}</Text>
              <Text style={s.sub}>{svc.sub}</Text>
              <View style={s.priceBadge}>
                <Text style={s.priceText}>{svc.price}</Text>
              </View>
            </View>
            <Text style={[s.arrow, { color: theme.textMuted }]}>
              {expanded === svc.id ? '⌄' : '›'}
            </Text>
          </View>

          {expanded === svc.id && (
            <View style={s.details}>
              <View style={s.divider} />

              {svc.items.map((it, i) => (
                <View key={i} style={s.bulletRow}>
                  <Text style={s.bulletDot}>•</Text>
                  <Text style={s.bulletText}>{it}</Text>
                </View>
              ))}

              <Text style={s.priceNote}>{svc.note}</Text>

              <View style={s.btnRow}>
                <TouchableOpacity
                  style={s.calcBtn}
                  onPress={() => navigation.navigate('Калькулятор', { service: svc.calc, serviceTs: Date.now() })}
                >
                  <Text style={s.calcBtnText}>{t('svc_btn_calc')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.orderBtn}
                  onPress={() => navigation.navigate('Заявка')}
                >
                  <Text style={s.orderBtnText}>{t('svc_btn_order')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))}

      <View style={s.note}>
        <Text style={s.noteText}>{t('svc_bottom_note')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = (t) => StyleSheet.create({
  container: { flex: 1, backgroundColor: t.bg },
  content:   { padding: 16, paddingBottom: 32 },

  card: {
    backgroundColor: t.card, borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 0.5, borderColor: t.border,
  },
  row:   { flexDirection: 'row', alignItems: 'center' },
  thumb: {
    width: 72, height: 72, borderRadius: 10, backgroundColor: t.bg,
    alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0,
  },
  thumbText: { color: t.textMuted, fontSize: 11, textAlign: 'center' },
  info:      { flex: 1 },
  title:     { fontSize: 15, fontWeight: '700', color: t.text, marginBottom: 4 },
  sub:       { fontSize: 13, color: t.textSub, lineHeight: 18, marginBottom: 6 },
  priceBadge:{ alignSelf: 'flex-start', backgroundColor: t.redLight, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  priceText: { color: t.red, fontWeight: '700', fontSize: 12 },
  arrow:     { fontSize: 22, marginLeft: 8 },

  details:   { marginTop: 12 },
  divider:   { height: 1, backgroundColor: t.border, marginBottom: 12 },

  bulletRow:  { flexDirection: 'row', marginBottom: 7 },
  bulletDot:  { color: t.red, fontSize: 15, marginRight: 8, lineHeight: 19 },
  bulletText: { flex: 1, color: t.textSub, fontSize: 13, lineHeight: 19 },

  priceNote: { color: t.textMuted, fontSize: 12, lineHeight: 17, marginTop: 6, marginBottom: 14 },

  btnRow:       { flexDirection: 'row', gap: 10 },
  calcBtn:      { flex: 1, backgroundColor: t.red, borderRadius: 10, padding: 12, alignItems: 'center' },
  calcBtnText:  { color: '#fff', fontWeight: '700', fontSize: 14 },
  orderBtn:     { flex: 1, backgroundColor: t.card, borderWidth: 0.5, borderColor: t.border, borderRadius: 10, padding: 12, alignItems: 'center' },
  orderBtnText: { color: t.text, fontWeight: '700', fontSize: 14 },

  note:     { backgroundColor: t.card, borderRadius: 12, padding: 14, marginTop: 4, borderLeftWidth: 3, borderLeftColor: t.red, borderWidth: 0.5, borderColor: t.border },
  noteText: { color: t.textSub, fontSize: 13, lineHeight: 19 },
});
