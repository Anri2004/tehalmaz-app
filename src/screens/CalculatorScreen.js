import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';

/* ============================================================
   ЧИСЛОВЫЕ ДАННЫЕ ИЗ ПРАЙС-ЛИСТА (не переводятся)
   ============================================================ */

// Алмазное сверление — цена за 1 см глубины, по диаметру коронки.
const DRILL = [
  { d: 27,  label: '≤27', cash: 53,  ip: 58.3,  nds: 63  },
  { d: 32,  label: '32',  cash: 33,  ip: 36.3,  nds: 40  },
  { d: 42,  label: '42',  cash: 33,  ip: 36.3,  nds: 40  },
  { d: 52,  label: '52',  cash: 29,  ip: 31.9,  nds: 35  },
  { d: 62,  label: '62',  cash: 29,  ip: 31.9,  nds: 35  },
  { d: 72,  label: '72',  cash: 31,  ip: 34.1,  nds: 37  },
  { d: 82,  label: '82',  cash: 31,  ip: 34.1,  nds: 37  },
  { d: 92,  label: '92',  cash: 31,  ip: 34.1,  nds: 37  },
  { d: 102, label: '102', cash: 33,  ip: 36.3,  nds: 39  },
  { d: 112, label: '112', cash: 33,  ip: 36.3,  nds: 40  },
  { d: 122, label: '122', cash: 33,  ip: 36.3,  nds: 40  },
  { d: 132, label: '132', cash: 36,  ip: 39.6,  nds: 43  },
  { d: 142, label: '142', cash: 38,  ip: 41.8,  nds: 45  },
  { d: 152, label: '152', cash: 42,  ip: 46.2,  nds: 50  },
  { d: 162, label: '162', cash: 48,  ip: 52.8,  nds: 57  },
  { d: 172, label: '172', cash: 50,  ip: 55,    nds: 60  },
  { d: 182, label: '182', cash: 58,  ip: 63.8,  nds: 70  },
  { d: 192, label: '192', cash: 67,  ip: 73.7,  nds: 80  },
  { d: 200, label: '200', cash: 71,  ip: 78.1,  nds: 85  },
  { d: 220, label: '220', cash: 75,  ip: 82.5,  nds: 90  },
  { d: 250, label: '250', cash: 83,  ip: 91.3,  nds: 100 },
  { d: 270, label: '270', cash: 100, ip: 110,   nds: 120 },
  { d: 300, label: '300', cash: 108, ip: 118.8, nds: 130 },
  { d: 320, label: '320', cash: 121, ip: 133.1, nds: 145 },
  { d: 350, label: '350', cash: 158, ip: 173.8, nds: 190 },
  { d: 400, label: '400', cash: 208, ip: 228.8, nds: 250 },
  { d: 500, label: '500', cash: 250, ip: 275,   nds: 300 },
  { d: 600, label: '600', cash: 320, ip: 352,   nds: 384 },
];

// Алмазная резка — цена за 1 м.п. по толщине (с НДС 20%).
const CUT = [
  { max: 49,  brick: 368,  rc: 511  },
  { max: 69,  brick: 518,  rc: 719  },
  { max: 99,  brick: 743,  rc: 1032 },
  { max: 119, brick: 893,  rc: 1240 },
  { max: 149, brick: 1118, rc: 1600 },
  { max: 200, brick: 1500, rc: 2300 },
  { max: 220, brick: 1650, rc: 2750 },
  { max: 250, brick: 2000, rc: 3125 },
  { max: 300, brick: 2250, rc: 3750 },
  { max: 350, brick: 2625, rc: 4375 },
  { max: 400, brick: 3000, rc: 5000 },
  { max: 450, brick: 3375, rc: 5625 },
  { max: 500, brick: 3750, rc: 6250 },
];

const DEMO_MIN = 4500; // минимальный выезд (демонтаж)

/* ============================================================
   ВСПОМОГАТЕЛЬНЫЕ ВЫЧИСЛЕНИЯ
   ============================================================ */
function depthCoeff(cm) {
  if (cm >= 200) return 2.0;
  if (cm >= 100) return 1.3;
  if (cm >= 51)  return 1.1;
  return 1.0;
}
function cutRow(thickness) {
  if (thickness > 500) return 'contract';
  return CUT.find(r => thickness <= r.max) || CUT[CUT.length - 1];
}
function fmt(n) {
  return Math.round(n).toLocaleString('ru-RU');
}
const kOf = (arr, id) => arr.find(x => x.id === id)?.k ?? 1;
const lbl = (arr, id) => arr.find(x => x.id === id)?.label ?? '';

/* ============================================================
   СТЕППЕР (− значение +)
   ============================================================ */
function Stepper({ value, onChange, step = 1, min = 0, max = 999, suffix = '', s }) {
  const dec = () => onChange(Math.max(min, +(value - step).toFixed(2)));
  const inc = () => onChange(Math.min(max, +(value + step).toFixed(2)));
  return (
    <View style={s.stepper}>
      <TouchableOpacity style={s.stepBtn} onPress={dec} activeOpacity={0.7}>
        <Text style={s.stepBtnTxt}>−</Text>
      </TouchableOpacity>
      <Text style={s.stepVal}>{value}{suffix}</Text>
      <TouchableOpacity style={s.stepBtn} onPress={inc} activeOpacity={0.7}>
        <Text style={s.stepBtnTxt}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// Группа вариантов в ряд (короткие подписи)
function OptRow({ options, value, onChange, s }) {
  return (
    <View style={s.optRow}>
      {options.map(o => (
        <TouchableOpacity
          key={o.id}
          style={[s.opt, value === o.id && s.chipActive]}
          onPress={() => onChange(o.id)}
        >
          <Text style={[s.optTxt, value === o.id && s.chipTextActive]}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Список вариантов на всю ширину (длинные подписи, с радиокнопкой)
function OptCol({ options, value, onChange, s }) {
  return (
    <View style={s.optCol}>
      {options.map(o => (
        <TouchableOpacity
          key={o.id}
          style={[s.optColItem, value === o.id && s.chipActive]}
          onPress={() => onChange(o.id)}
        >
          <View style={[s.radio, value === o.id && s.radioOn]}>
            {value === o.id && <View style={s.radioDot} />}
          </View>
          <Text style={[s.optColTxt, value === o.id && s.chipTextActive]}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* ============================================================
   ЭКРАН КАЛЬКУЛЯТОРА
   ============================================================ */
export default function CalculatorScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const s = styles(theme);

  // Переводимые варианты (числовые коэффициенты — без изменений).
  const REINF = [
    { id: 'none', label: t('reinf_none'), k: 1.0 },
    { id: 'r16',  label: t('reinf_r16'),  k: 1.3 },
    { id: 'r20',  label: t('reinf_r20'),  k: 1.4 },
    { id: 'r28',  label: t('reinf_r28'),  k: 1.7 },
  ];
  const INSTALL = [
    { id: 'std',  label: t('install_std'),  k: 1.0 },
    { id: 'hand', label: t('install_hand'), k: 1.3 },
    { id: 'vac',  label: t('install_vac'),  k: 1.5 },
  ];
  const POSITION = [
    { id: 'std',     label: t('pos_std'),     k: 1.0 },
    { id: 'angle',   label: t('pos_angle'),   k: 1.2 },
    { id: 'ceiling', label: t('pos_ceiling'), k: 3.0 }, // только при d ≤ 150
  ];
  const HEIGHT = [
    { id: 'low',  label: t('height_low'),  k: 1.0 },
    { id: 'mid',  label: t('height_mid'),  k: 1.2 },
    { id: 'high', label: t('height_high'), k: 1.3 },
    { id: 'auto', label: t('height_auto'), k: 1.3 },
  ];
  const CUT_POS = [
    { id: 'std',   label: t('cutpos_std'),   k: 1.0 },
    { id: 'angle', label: t('cutpos_angle'), k: 1.2 },
  ];
  const METHOD = [
    { id: 'hand', label: t('method_hand'), min: 5000  },
    { id: 'wall', label: t('method_wall'), min: 15000 },
  ];
  const POWER = [
    { id: 'yes',  label: t('power_yes')  },
    { id: 'v220', label: t('power_v220') },
    { id: 'v380', label: t('power_v380') },
  ];
  const WATER = [
    { id: 'yes', label: t('water_yes') },
    { id: 'no',  label: t('water_no')  },
  ];
  const HARD = [{ id: 'no', label: t('hard_no') }, { id: 'yes', label: t('hard_yes') }];
  const TIERS = [
    { id: 'cash', label: t('tier_cash'), min: 4000 },
    { id: 'ip',   label: t('tier_ip'),   min: 5000 },
    { id: 'nds',  label: t('tier_nds'),  min: 5000 },
  ];
  const DEMO = [
    { id: 'brick',   label: t('demo_brick'),   price: 6000  },
    { id: 'rc_low',  label: t('demo_rc_low'),  price: 12500 },
    { id: 'rc_high', label: t('demo_rc_high'), price: 25000 },
  ];

  const [service, setService] = useState('drill'); // drill | cut | demo

  // Предвыбор вида работ при переходе из раздела «Услуги»
  useEffect(() => {
    if (route?.params?.service) setService(route.params.service);
  }, [route?.params?.service, route?.params?.serviceTs]);

  // --- Сверление ---
  const [diameter, setDiameter] = useState(102);
  const [depthCm,  setDepthCm]  = useState(30);
  const [holes,    setHoles]    = useState(1);
  const [tier,     setTier]     = useState('cash');
  const [install,  setInstall]  = useState('std');
  const [position, setPosition] = useState('std');

  // --- Резка ---
  const [cutMat,    setCutMat]    = useState('rc'); // 'brick' | 'rc'
  const [thickness, setThickness] = useState(200);
  const [length,    setLength]    = useState(2);
  const [method,    setMethod]    = useState('hand');
  const [cutPos,    setCutPos]    = useState('std');

  // --- Демонтаж ---
  const [demoMat, setDemoMat] = useState('brick');
  const [volume,  setVolume]  = useState(1);

  // --- Общие условия ---
  const [reinf,  setReinf]  = useState('none');
  const [height, setHeight] = useState('low');
  const [hard,   setHard]   = useState('no');
  const [power,  setPower]  = useState('yes');
  const [water,  setWater]  = useState('yes');

  // «В потолок» доступно только для диаметров до 150 мм
  useEffect(() => {
    if (diameter > 150 && position === 'ceiling') setPosition('std');
  }, [diameter, position]);

  // ---------- Расчёт ----------
  let work = 0, minVisit = 0, contract = false, breakdown = '';
  const supplyNotes = [];

  if (service === 'drill') {
    const row = DRILL.find(r => r.d === diameter);
    const perCm = row ? row[tier] : 0;
    let k = kOf(REINF, reinf) * depthCoeff(depthCm) * kOf(INSTALL, install) * kOf(HEIGHT, height);
    if (position === 'ceiling' && diameter <= 150) k *= 3.0;
    else if (position === 'angle') k *= 1.2;
    work = perCm * depthCm * holes * k;
    minVisit = TIERS.find(t2 => t2.id === tier)?.min ?? 4000;
    breakdown = `${t('bd_diameter')} ${row?.label} ${t('u_mm')} · ${t('bd_depth')} ${depthCm} ${t('u_cm')} · ${holes} ${t('u_pcs')}`;
  } else if (service === 'cut') {
    const row = cutRow(thickness);
    if (row === 'contract') {
      contract = true;
    } else {
      const per = cutMat === 'brick' ? row.brick : row.rc;
      let k = kOf(CUT_POS, cutPos) * kOf(HEIGHT, height);
      if (hard === 'yes') k *= 2.0;
      if (cutMat === 'rc') k *= kOf(REINF, reinf);
      work = per * length * k;
    }
    minVisit = METHOD.find(m => m.id === method)?.min ?? 5000;
    breakdown = `${t('bd_thickness')} ${thickness} ${t('u_mm')} · ${length} ${t('u_m')}`;
  } else {
    const per = DEMO.find(d => d.id === demoMat)?.price ?? 0;
    let k = hard === 'yes' ? 2.0 : 1.0;
    work = per * volume * k;
    minVisit = DEMO_MIN;
    breakdown = `${t('bd_volume')} ${volume} ${t('u_m3')}`;
  }

  // Надбавка за генератор, если нет электроэнергии (ориентир за 1 смену).
  let genCost = 0;
  if (service !== 'demo') {
    if (power === 'v220') genCost = 15000;
    else if (power === 'v380') genCost = 50000;
    if (genCost > 0)    supplyNotes.push(t('calc_note_gen'));
    if (water === 'no') supplyNotes.push(t('calc_note_water'));
  }

  const workOrMin  = contract ? 0 : Math.max(work, minVisit);
  const total      = workOrMin + genCost;
  const minApplied = !contract && work > 0 && work < minVisit;

  // Текст для поля «Что нужно сделать» в заявке
  const buildOrderText = () => {
    const priceStr = contract ? t('calc_contract') : `≈ ${fmt(total)} ₽`;
    const parts = [];
    if (service === 'drill') {
      const row = DRILL.find(r => r.d === diameter);
      parts.push(t('ot_drill'),
        `${t('ot_diameter')}: ${row?.label} ${t('u_mm')}`,
        `${t('ot_depth')}: ${depthCm} ${t('u_cm')}`,
        `${t('ot_qty')}: ${holes} ${t('u_pcs')}`);
      if (reinf !== 'none')   parts.push(`${t('ot_reinf')}: ${lbl(REINF, reinf)}`);
      if (install !== 'std')  parts.push(`${t('ot_install')}: ${lbl(INSTALL, install)}`);
      if (position !== 'std') parts.push(`${t('ot_position')}: ${lbl(POSITION, position)}`);
      if (height !== 'low')   parts.push(`${t('ot_height')}: ${lbl(HEIGHT, height)}`);
      if (power !== 'yes')    parts.push(`${t('ot_power')}: ${lbl(POWER, power)}`);
      if (water !== 'yes')    parts.push(`${t('ot_water')}: ${lbl(WATER, water)}`);
      parts.push(`${t('ot_tier')}: ${lbl(TIERS, tier)}`);
    } else if (service === 'cut') {
      parts.push(t('ot_cut'),
        `${t('ot_material')}: ${cutMat === 'brick' ? t('ot_mat_brick') : t('ot_mat_rc')}`,
        `${t('ot_thickness')}: ${thickness} ${t('u_mm')}`,
        `${t('ot_cutlen')}: ${length} ${t('u_m')}`,
        `${t('ot_method')}: ${lbl(METHOD, method)}`);
      if (cutMat === 'rc' && reinf !== 'none') parts.push(`${t('ot_reinf')}: ${lbl(REINF, reinf)}`);
      if (cutPos !== 'std') parts.push(`${t('ot_cutpos')}: ${lbl(CUT_POS, cutPos)}`);
      if (height !== 'low') parts.push(`${t('ot_height')}: ${lbl(HEIGHT, height)}`);
      if (hard === 'yes')   parts.push(t('ot_hard_yes'));
      if (power !== 'yes')  parts.push(`${t('ot_power')}: ${lbl(POWER, power)}`);
      if (water !== 'yes')  parts.push(`${t('ot_water')}: ${lbl(WATER, water)}`);
    } else {
      const dm = DEMO.find(d => d.id === demoMat);
      parts.push(t('ot_demo'),
        `${t('ot_material')}: ${dm?.label}`,
        `${t('bd_volume')}: ${volume} ${t('u_m3')}`);
      if (hard === 'yes') parts.push(t('ot_hard_yes'));
    }
    parts.push(`${t('ot_approx')}: ${priceStr}`);
    return parts.join('\n');
  };

  const goToOrder = () =>
    navigation.navigate('Заявка', { prefill: buildOrderText(), prefillTs: Date.now() });

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* ВКЛАДКИ ВИДА РАБОТ */}
      <View style={s.tabs}>
        {[{ id: 'drill', t: t('calc_svc_drill') }, { id: 'cut', t: t('calc_svc_cut') }, { id: 'demo', t: t('calc_svc_demo') }].map(o => (
          <TouchableOpacity
            key={o.id}
            style={[s.tab, service === o.id && s.tabOn]}
            onPress={() => setService(o.id)}
            activeOpacity={0.8}
          >
            <Text style={[s.tabTxt, service === o.id && s.tabTxtOn]}>{o.t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ===================== СВЕРЛЕНИЕ ===================== */}
      {service === 'drill' && (
        <>
          <Text style={s.label}>{t('calc_diameter')}</Text>
          <View style={s.diamGrid}>
            {DRILL.map(r => (
              <TouchableOpacity
                key={r.d}
                style={[s.diamChip, diameter === r.d && s.chipActive]}
                onPress={() => setDiameter(r.d)}
              >
                <Text style={[s.diamText, diameter === r.d && s.chipTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.sliderRow}>
            <Text style={s.label}>{t('calc_depth')}</Text>
            <Text style={s.sliderVal}>{depthCm} {t('u_cm')}</Text>
          </View>
          <Slider
            style={s.slider} minimumValue={5} maximumValue={200} step={5}
            value={depthCm} onValueChange={setDepthCm}
            minimumTrackTintColor={theme.red} maximumTrackTintColor={theme.border} thumbTintColor={theme.red}
          />
          <View style={s.sliderLabels}>
            <Text style={s.sliderLbl}>5 {t('u_cm')}</Text><Text style={s.sliderLbl}>200 {t('u_cm')}</Text>
          </View>

          <View style={s.rowBetween}>
            <Text style={s.label}>{t('calc_holes')}</Text>
            <Stepper value={holes} onChange={setHoles} min={1} max={100} s={s} />
          </View>

          <Text style={s.label}>{t('calc_reinf')}</Text>
          <OptRow options={REINF} value={reinf} onChange={setReinf} s={s} />

          <Text style={s.label}>{t('calc_install')}</Text>
          <OptRow options={INSTALL} value={install} onChange={setInstall} s={s} />

          <Text style={s.label}>{t('calc_position')}</Text>
          <OptRow
            options={diameter <= 150 ? POSITION : POSITION.filter(p => p.id !== 'ceiling')}
            value={position} onChange={setPosition} s={s}
          />

          <Text style={s.label}>{t('calc_height')}</Text>
          <OptRow options={HEIGHT} value={height} onChange={setHeight} s={s} />

          <Text style={s.label}>{t('calc_power')}</Text>
          <OptCol options={POWER} value={power} onChange={setPower} s={s} />

          <Text style={s.label}>{t('calc_water')}</Text>
          <OptCol options={WATER} value={water} onChange={setWater} s={s} />

          <Text style={s.label}>{t('calc_tier')}</Text>
          <OptRow options={TIERS} value={tier} onChange={setTier} s={s} />
        </>
      )}

      {/* ===================== РЕЗКА ===================== */}
      {service === 'cut' && (
        <>
          <Text style={s.label}>{t('calc_material')}</Text>
          <View style={s.chipRow}>
            <TouchableOpacity style={[s.chip, cutMat === 'brick' && s.chipActive]} onPress={() => setCutMat('brick')}>
              <Text style={[s.chipText, cutMat === 'brick' && s.chipTextActive]}>{t('mat_brick')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.chip, cutMat === 'rc' && s.chipActive]} onPress={() => setCutMat('rc')}>
              <Text style={[s.chipText, cutMat === 'rc' && s.chipTextActive]}>{t('mat_rc')}</Text>
            </TouchableOpacity>
          </View>

          <View style={s.sliderRow}>
            <Text style={s.label}>{t('calc_thickness')}</Text>
            <Text style={s.sliderVal}>{thickness} {t('u_mm')}</Text>
          </View>
          <Slider
            style={s.slider} minimumValue={30} maximumValue={550} step={10}
            value={thickness} onValueChange={setThickness}
            minimumTrackTintColor={theme.red} maximumTrackTintColor={theme.border} thumbTintColor={theme.red}
          />
          <View style={s.sliderLabels}>
            <Text style={s.sliderLbl}>30 {t('u_mm')}</Text><Text style={s.sliderLbl}>500+ {t('u_mm')}</Text>
          </View>

          <View style={s.rowBetween}>
            <Text style={s.label}>{t('calc_length')}</Text>
            <Stepper value={length} onChange={setLength} step={0.5} min={0.5} max={100} s={s} />
          </View>

          <Text style={s.label}>{t('calc_method')}</Text>
          <OptCol options={METHOD} value={method} onChange={setMethod} s={s} />

          {cutMat === 'rc' && (
            <>
              <Text style={s.label}>{t('calc_reinf_rc')}</Text>
              <OptRow options={REINF} value={reinf} onChange={setReinf} s={s} />
            </>
          )}

          <Text style={s.label}>{t('calc_cutpos')}</Text>
          <OptRow options={CUT_POS} value={cutPos} onChange={setCutPos} s={s} />

          <Text style={s.label}>{t('calc_height')}</Text>
          <OptRow options={HEIGHT} value={height} onChange={setHeight} s={s} />

          <Text style={s.label}>{t('calc_hard')}</Text>
          <OptRow options={HARD} value={hard} onChange={setHard} s={s} />

          <Text style={s.label}>{t('calc_power')}</Text>
          <OptCol options={POWER} value={power} onChange={setPower} s={s} />

          <Text style={s.label}>{t('calc_water')}</Text>
          <OptCol options={WATER} value={water} onChange={setWater} s={s} />
        </>
      )}

      {/* ===================== ДЕМОНТАЖ ===================== */}
      {service === 'demo' && (
        <>
          <Text style={s.label}>{t('calc_demo_material')}</Text>
          <View style={s.chipColumn}>
            {DEMO.map(d => (
              <TouchableOpacity
                key={d.id}
                style={[s.chipWide, demoMat === d.id && s.chipActive]}
                onPress={() => setDemoMat(d.id)}
              >
                <Text style={[s.chipText, demoMat === d.id && s.chipTextActive]}>{d.label}</Text>
                <Text style={[s.chipPrice, demoMat === d.id && s.chipTextActive]}>{fmt(d.price)} ₽/{t('u_m3')}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.rowBetween}>
            <Text style={s.label}>{t('calc_volume')}</Text>
            <Stepper value={volume} onChange={setVolume} step={0.5} min={0.5} max={100} s={s} />
          </View>

          <Text style={s.label}>{t('calc_hard')}</Text>
          <OptRow options={HARD} value={hard} onChange={setHard} s={s} />
        </>
      )}

      {/* ===================== РЕЗУЛЬТАТ ===================== */}
      <View style={s.result}>
        <Text style={s.resultLabel}>{t('calc_approx')}</Text>

        {contract ? (
          <>
            <Text style={s.resultPrice}>{t('calc_contract')}</Text>
            <Text style={s.resultDesc}>{t('calc_contract_desc')}</Text>
          </>
        ) : (
          <>
            <Text style={s.resultPrice}>≈ {fmt(total)} ₽</Text>

            <View style={s.breakRow}>
              <Text style={s.breakLbl}>{t('calc_work_cost')}</Text>
              <Text style={s.breakVal}>{fmt(work)} ₽</Text>
            </View>
            {minApplied && (
              <View style={s.breakRow}>
                <Text style={[s.breakLbl, { color: theme.red }]}>{t('calc_min_visit')}</Text>
                <Text style={[s.breakVal, { color: theme.red }]}>{fmt(minVisit)} ₽</Text>
              </View>
            )}
            {genCost > 0 && (
              <View style={s.breakRow}>
                <Text style={s.breakLbl}>{t('calc_generator')}</Text>
                <Text style={s.breakVal}>+{fmt(genCost)} ₽</Text>
              </View>
            )}

            <Text style={s.resultDesc}>
              {breakdown}{'\n'}
              {supplyNotes.length > 0 ? `⚠ ${supplyNotes.join('; ')}.\n` : ''}
              {minApplied ? t('calc_min_applied') : t('calc_after_measure')}
            </Text>
          </>
        )}
      </View>

      <TouchableOpacity style={s.btnRed} onPress={goToOrder}>
        <Text style={s.btnRedText}>{t('calc_btn_order')}</Text>
      </TouchableOpacity>

      <View style={s.disclaimer}>
        <Text style={s.disclaimerText}>{t('calc_disclaimer')}</Text>
      </View>
    </ScrollView>
  );
}

/* ============================================================
   СТИЛИ  (параметр t — это тема)
   ============================================================ */
const styles = (t) => StyleSheet.create({
  container: { flex: 1, backgroundColor: t.bg },
  content:   { padding: 16, paddingBottom: 40 },

  label: { fontSize: 15, fontWeight: '600', color: t.text, marginBottom: 10, marginTop: 4 },

  // вкладки выбора вида работ (шапка с красным подчёркиванием)
  tabs:    { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: t.border, marginBottom: 22 },
  tab:     { flex: 1, alignItems: 'center', paddingVertical: 14, borderBottomWidth: 2.5, borderBottomColor: 'transparent', marginBottom: -1 },
  tabOn:   { borderBottomColor: t.red },
  tabTxt:  { color: t.textSub, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.3 },
  tabTxtOn:{ color: t.red },

  chipRow:        { flexDirection: 'row', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  chip:           { flex: 1, minWidth: 90, backgroundColor: t.chip, borderRadius: 20, padding: 12, alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent' },
  chipActive:     { backgroundColor: t.red, borderColor: t.red },
  chipText:       { color: t.chipText, fontWeight: '600', fontSize: 14 },
  chipTextActive: { color: '#fff' },

  chipColumn: { gap: 10, marginBottom: 16 },
  chipWide:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: t.chip, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1.5, borderColor: 'transparent' },
  chipPrice:  { color: t.textSub, fontWeight: '700', fontSize: 13 },

  // группа вариантов (чипы в ряд)
  optRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  opt:    { backgroundColor: t.chip, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1.5, borderColor: 'transparent' },
  optTxt: { color: t.chipText, fontWeight: '600', fontSize: 13 },

  // группа вариантов на всю ширину (в столбец, с радиокнопкой)
  optCol:     { gap: 8, marginBottom: 18 },
  optColItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: t.chip, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1.5, borderColor: 'transparent' },
  optColTxt:  { color: t.chipText, fontWeight: '600', fontSize: 14, flex: 1 },
  radio:      { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: t.textMuted, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  radioOn:    { borderColor: '#fff' },
  radioDot:   { width: 9, height: 9, borderRadius: 5, backgroundColor: '#fff' },

  diamGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  diamChip:  { backgroundColor: t.chip, borderRadius: 18, paddingHorizontal: 13, paddingVertical: 8, borderWidth: 1.5, borderColor: 'transparent' },
  diamText:  { color: t.chipText, fontWeight: '600', fontSize: 13 },

  sliderRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sliderVal:    { fontSize: 16, fontWeight: '700', color: t.red },
  slider:       { width: '100%', height: 40, marginBottom: 4 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sliderLbl:    { color: t.textMuted, fontSize: 12 },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },

  stepper:   { flexDirection: 'row', alignItems: 'center', backgroundColor: t.chip, borderRadius: 20, paddingHorizontal: 4 },
  stepBtn:   { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  stepBtnTxt:{ color: t.red, fontSize: 22, fontWeight: '700', lineHeight: 24 },
  stepVal:   { minWidth: 48, textAlign: 'center', color: t.text, fontWeight: '700', fontSize: 15 },

  result: {
    backgroundColor: t.card, borderRadius: 14, padding: 18, marginTop: 8, marginBottom: 14,
    borderWidth: 0.5, borderColor: t.border,
  },
  resultLabel: { fontSize: 12, fontWeight: '700', color: t.textMuted, letterSpacing: 1, marginBottom: 6 },
  resultPrice: { fontSize: 36, fontWeight: '800', color: t.text, marginBottom: 10 },
  resultDesc:  { fontSize: 13, color: t.textSub, lineHeight: 19, marginTop: 8 },

  breakRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  breakLbl: { fontSize: 13, color: t.textSub },
  breakVal: { fontSize: 13, color: t.text, fontWeight: '600' },

  btnRed:     { backgroundColor: t.cta, borderRadius: 14, padding: 17, alignItems: 'center', marginBottom: 14 },
  btnRedText: { color: t.ctaText, fontWeight: '700', fontSize: 16 },

  disclaimer:     { backgroundColor: t.card, borderRadius: 12, padding: 14, borderLeftWidth: 3, borderLeftColor: '#F9A825', borderWidth: 0.5, borderColor: t.border },
  disclaimerText: { color: t.textSub, fontSize: 13, lineHeight: 19 },
});
