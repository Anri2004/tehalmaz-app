import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert, ActivityIndicator, Linking, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';

const API_URL = 'https://functions.yandexcloud.net/d4efrcscfce1vugur7lr';
const APP_TOKEN = 'thalmz_44aa116d0cacaeafcd952f8ec290d145'; // должен совпадать с переменной APP_TOKEN на сервере
const MAX_PHOTOS = 5;
const PRIVACY_URL = 'https://tekhalmaz.ru/privacy.html';

export default function OrderScreen({ route }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const s = styles(theme);

  const [name,        setName]       = useState('');
  const [phone,       setPhone]      = useState('+7 ');
  const [description, setDesc]       = useState('');
  const [agreed,      setAgreed]     = useState(false);
  const [loading,     setLoading]    = useState(false);
  const [sent,        setSent]       = useState(false);
  const [photos,      setPhotos]     = useState([]); // [{ uri, base64 }]

  // Автозаполнение из калькулятора («Заказать по этой цене»)
  useEffect(() => {
    if (route?.params?.prefill != null) {
      setDesc(route.params.prefill);
    }
  }, [route?.params?.prefill, route?.params?.prefillTs]);

  // Предупреждения по полям (мягкие подсказки под полем)
  const phoneDigits = phone.replace(/\D/g, '');
  const nameWarn =
    !name ? '' :
    /\d/.test(name)            ? t('warn_name_digits') :
    name.trim().length < 2     ? t('warn_name_short') :
    name.length > 50           ? t('warn_name_long') : '';
  const phoneWarn =
    (phone && phoneDigits.length > 1 && phoneDigits.length < 11)
      ? t('warn_phone') : '';
  const descWarn = description.length > 600 ? t('warn_desc') : '';

  const handlePhone = (text) => {
    let d = text.replace(/\D/g, '');

    // Стёрли форматирующий символ (пробел/скобку/дефис) — убираем и последнюю цифру,
    // иначе разделитель тут же дописывается обратно и Backspace «не работает».
    if (text.length < phone.length && d === phone.replace(/\D/g, '')) {
      d = d.slice(0, -1);
    }

    if (d.startsWith('8')) d = '7' + d.slice(1);   // 8 → 7
    if (!d.startsWith('7')) d = '7' + d;            // всегда код 7
    d = d.slice(0, 11);                             // максимум 11 цифр
    if (d.length <= 1) { setPhone('+7 '); return; } // остаётся только префикс

    let f = '+7';
    if (d.length > 1) f += ' (' + d.slice(1, 4);
    if (d.length >= 4) f += ') ' + d.slice(4, 7);
    if (d.length >= 7) f += '-' + d.slice(7, 9);
    if (d.length >= 9) f += '-' + d.slice(9, 11);
    setPhone(f);
  };

  // Выбор фото из галереи + сжатие (до ~1280px) для лёгкой отправки
  const pickPhotos = async () => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert(t('ord_photos_label'), t('ord_photo_max'));
      return;
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert(t('ord_photos_label'), t('ord_photo_perm')); return; }

    const res = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photos.length,
      quality: 1,
    });
    if (res.canceled) return;

    try {
      const processed = [];
      for (const asset of res.assets) {
        const m = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 1280 } }],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        processed.push({ uri: m.uri, base64: m.base64 });
      }
      setPhotos(prev => [...prev, ...processed].slice(0, MAX_PHOTOS));
    } catch (e) {
      Alert.alert(t('err_title'), String(e.message || e));
    }
  };

  const removePhoto = (i) => setPhotos(prev => prev.filter((_, idx) => idx !== i));

  const validate = () => {
    if (!name.trim())              { Alert.alert(t('err_title'), t('err_name_empty')); return false; }
    if (/\d/.test(name))           { Alert.alert(t('err_title'), t('err_name_digits')); return false; }
    if (name.trim().length < 2)    { Alert.alert(t('err_title'), t('err_name_short')); return false; }
    if (phoneDigits.length < 11)   { Alert.alert(t('err_title'), t('err_phone')); return false; }
    if (!agreed)                   { Alert.alert(t('err_consent_title'), t('err_consent')); return false; }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res  = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-App-Token': APP_TOKEN },
        body: JSON.stringify({ name, phone, description, photos: photos.map(p => p.base64) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('err_server'));
      setLoading(false); setSent(true);
    } catch (err) {
      setLoading(false);
      Alert.alert(t('err_title'), err.message || t('err_network'));
    }
  };

  if (sent) {
    return (
      <View style={s.successContainer}>
        <View style={s.successCheck}>
          <Text style={s.successCheckMark}>✓</Text>
        </View>
        <Text style={s.successTitle}>{t('ord_success_title')}</Text>
        <Text style={s.successText}>{t('ord_success_text')}{'\n'}<Text style={{ color: theme.red, fontWeight: '700' }}>{phone}</Text></Text>
        <TouchableOpacity style={[s.btnRed, { width: '100%', marginTop: 8 }]} onPress={() => Linking.openURL('tel:+79181409333')}>
          <Text style={s.btnRedText}>{t('ord_success_call')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setSent(false); setName(''); setPhone('+7 '); setDesc(''); setAgreed(false); setPhotos([]); }}>
          <Text style={{ color: theme.textMuted, marginTop: 16, fontSize: 14 }}>{t('ord_success_again')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={s.container} contentContainerStyle={s.content}>
        <Text style={s.label}>{t('ord_name')}</Text>
        <TextInput style={[s.input, nameWarn && s.inputWarn]} placeholder={t('ord_name_ph')} placeholderTextColor={theme.textMuted}
          value={name} onChangeText={setName} autoCapitalize="words" maxLength={60} />
        {nameWarn ? <Text style={s.warn}>⚠ {nameWarn}</Text> : null}

        <Text style={s.label}>{t('ord_phone')}</Text>
        <TextInput style={[s.input, phoneWarn && s.inputWarn]} placeholder="+7 (___) ___-__-__" placeholderTextColor={theme.textMuted}
          value={phone} onChangeText={handlePhone} keyboardType="phone-pad" maxLength={18} />
        {phoneWarn ? <Text style={s.warn}>⚠ {phoneWarn}</Text> : null}

        <Text style={s.label}>{t('ord_task')}</Text>
        <TextInput style={[s.input, s.textarea, descWarn && s.inputWarn]}
          placeholder={t('ord_task_ph')}
          placeholderTextColor={theme.textMuted}
          value={description} onChangeText={setDesc}
          multiline numberOfLines={4} textAlignVertical="top" maxLength={1000} />
        {descWarn ? <Text style={s.warn}>⚠ {descWarn}</Text> : null}

        {/* Прикрепить фото */}
        <Text style={s.label}>{t('ord_photos_label')}</Text>
        <View style={s.photoRow}>
          {photos.map((p, i) => (
            <View key={i} style={s.photoBox}>
              <Image source={{ uri: p.uri }} style={s.photoImg} />
              <TouchableOpacity style={s.photoRemove} onPress={() => removePhoto(i)}>
                <Text style={s.photoRemoveTxt}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          {photos.length < MAX_PHOTOS && (
            <TouchableOpacity style={s.photoAdd} onPress={pickPhotos} activeOpacity={0.7}>
              <Text style={s.photoAddPlus}>＋</Text>
              <Text style={s.photoAddTxt}>{t('ord_add_photo')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={s.checkRow} onPress={() => setAgreed(!agreed)} activeOpacity={0.8}>
          <View style={[s.checkbox, agreed && s.checkboxOn]}>
            {agreed && <Text style={s.checkmark}>✓</Text>}
          </View>
          <Text style={s.checkText}>
            {t('ord_consent_1')}
            <Text style={{ color: theme.red, textDecorationLine: 'underline' }} onPress={() => Linking.openURL(PRIVACY_URL)}>
              {t('ord_consent_link')}
            </Text>
          </Text>
        </TouchableOpacity>

        <Text style={s.callbackNote}>⏱ {t('ord_subtitle')}</Text>
        <TouchableOpacity style={[s.btnRed, !agreed && s.btnOff]} onPress={submit} disabled={!agreed || loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnRedText}>{t('ord_submit')}</Text>}
        </TouchableOpacity>

        <Text style={s.footerNote}>{t('ord_footer')}</Text>
      </ScrollView>
    </>
  );
}

const styles = (t) => StyleSheet.create({
  container: { flex: 1, backgroundColor: t.bg },
  content:   { padding: 16, paddingBottom: 40 },
  callbackNote: { color: t.text, fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 12 },

  label:   { fontSize: 15, fontWeight: '600', color: t.text, marginBottom: 8, marginTop: 4 },
  input:    { backgroundColor: t.input, borderRadius: 12, padding: 14, color: t.text, fontSize: 15, marginBottom: 16, borderWidth: 0.5, borderColor: t.inputBorder },
  inputWarn:{ borderWidth: 1, borderColor: '#F9A825' },
  textarea: { height: 100 },
  warn:     { color: '#F9A825', fontSize: 12.5, marginTop: -10, marginBottom: 12, marginLeft: 2 },

  photoRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20, marginTop: 2 },
  photoBox:   { width: 72, height: 72, borderRadius: 10, overflow: 'visible' },
  photoImg:   { width: 72, height: 72, borderRadius: 10 },
  photoRemove:{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: 11, backgroundColor: t.red, alignItems: 'center', justifyContent: 'center' },
  photoRemoveTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  photoAdd:   { width: 72, height: 72, borderRadius: 10, borderWidth: 1, borderColor: t.inputBorder, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', backgroundColor: t.input },
  photoAddPlus: { color: t.textSub, fontSize: 22, lineHeight: 24 },
  photoAddTxt:  { color: t.textSub, fontSize: 9, marginTop: 2, textAlign: 'center', paddingHorizontal: 2 },

  checkRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 20 },
  checkbox:   { width: 22, height: 22, borderRadius: 5, borderWidth: 1.5, borderColor: t.textMuted, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  checkboxOn: { backgroundColor: t.red, borderColor: t.red },
  checkmark:  { color: '#fff', fontWeight: '800', fontSize: 13 },
  checkText:  { color: t.textSub, fontSize: 13, flex: 1, lineHeight: 19 },

  btnRed:     { backgroundColor: t.red, borderRadius: 14, padding: 17, alignItems: 'center' },
  btnOff:     { opacity: 0.45 },
  btnRedText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  footerNote: { color: t.textMuted, fontSize: 12, textAlign: 'center', marginTop: 12 },

  successContainer: { flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successCheck:     { width: 88, height: 88, borderRadius: 24, backgroundColor: t.red, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successCheckMark: { color: '#fff', fontSize: 50, fontWeight: '800', lineHeight: 56 },
  successTitle: { fontSize: 24, fontWeight: '800', color: t.text, marginBottom: 10 },
  successText:  { color: t.textSub, fontSize: 15, textAlign: 'center', marginBottom: 24, lineHeight: 22 },

  modal:       { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 52, borderBottomWidth: 1 },
  modalTitle:  { fontSize: 16, fontWeight: '700', flex: 1 },
});
