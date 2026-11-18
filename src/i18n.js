// 한국어 로컬라이제이션 오버레이 (비공식 한글화 패치).
// 원본 영어 문자열은 소스에 그대로 두고, 표시 시점에 사전으로 한국어로 바꿔 보여준다.
// 기본 언어는 한국어이며 설정에서 English로 전환할 수 있다.
import { FACTIONS, UPGRADES, RESOURCE_INFO, NEUTRALS, MONSTERS, FIELDS_OF_EVIL, SCOTT, RESOURCE_NODES } from './data.js';
import { BIOMES } from './terrain.js';
import { MISSIONS } from './campaign.js';
import { ACHIEVEMENTS } from './achievements.js';
import { DICT_NAMES } from './i18n-dict-names.js';
import { DICT_DESCS } from './i18n-dict-descs.js';
import { DICT_UI } from './i18n-dict-ui.js';
import { DOM_KO } from './i18n-dom.js';

const LANG_KEY = 'sotw_lang';
let lang = 'ko';
try { lang = localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'ko'; } catch {}

// DOM_KO의 en/ko 쌍도 사전에 합쳐 두면 JS가 동적으로 다시 그리는 문자열도 T()로 번역된다.
const DICT = new Map([...DICT_NAMES, ...DICT_DESCS, ...DICT_UI, ...DOM_KO.map((e) => [e.en, e.ko])]);

export function getLang() { return lang; }

// 사전 조회: 한국어 모드에서만 번역하고, 없으면 원문을 그대로 돌려준다.
export function T(s) {
  if (lang !== 'ko' || s == null) return s;
  return DICT.get(s) ?? s;
}

// 동적 문자열용: 영어/한국어 템플릿을 직접 고른다.
export function L(en, ko) { return lang === 'ko' ? ko : en; }

// ---- 데이터 객체의 표시 필드(name/desc 등)를 언어에 맞게 교체 ----
// 원본 값은 최초 1회 보관해 두고 English 전환 때 복원한다.
const originals = new Map(); // object -> {field: originalValue}
function keepOrig(obj, field) {
  if (obj == null) return;
  let rec = originals.get(obj);
  if (!rec) { rec = {}; originals.set(obj, rec); }
  if (!(field in rec)) rec[field] = obj[field];
}
function setF(obj, field) {
  if (obj == null || obj[field] == null) return;
  keepOrig(obj, field);
  obj[field] = lang === 'ko' ? (DICT.get(originals.get(obj)[field]) ?? originals.get(obj)[field]) : originals.get(obj)[field];
}
function localizeDef(def) {
  if (!def) return;
  setF(def, 'name'); setF(def, 'desc');
  if (def.ability) { setF(def.ability, 'name'); setF(def.ability, 'desc'); }
}

export function applyDataLang() {
  for (const k of Object.keys(RESOURCE_INFO)) setF(RESOURCE_INFO[k], 'name');
  for (const f of Object.values(FACTIONS)) {
    setF(f, 'name'); setF(f, 'desc');
    for (const u of Object.values(f.units || {})) localizeDef(u);
    for (const b of Object.values(f.buildings || {})) localizeDef(b);
  }
  for (const u of Object.values(UPGRADES)) { setF(u, 'name'); setF(u, 'desc'); }
  for (const b of Object.values(BIOMES)) setF(b, 'name');
  for (const m of MISSIONS) { setF(m, 'name'); setF(m, 'brief'); setF(m, 'objective'); }
  for (const a of Object.values(ACHIEVEMENTS)) { setF(a, 'name'); setF(a, 'desc'); }
  for (const d of Object.values(NEUTRALS)) localizeDef(d);
  for (const d of Object.values(MONSTERS)) localizeDef(d);
  for (const d of Object.values(FIELDS_OF_EVIL.units || {})) localizeDef(d);
  if (FIELDS_OF_EVIL.building) localizeDef(FIELDS_OF_EVIL.building);
  localizeDef(SCOTT);
  for (const n of Object.values(RESOURCE_NODES)) setF(n, 'name');
}

// ---- index.html의 고정 UI 문구 교체 ----
// DOM_KO 항목: { sel, attr('text'|'html'|'title'|'placeholder'), en, ko }
export function translateStaticDom() {
  for (const e of DOM_KO) {
    const el = document.querySelector(e.sel);
    if (!el) continue;
    const v = lang === 'ko' ? e.ko : e.en;
    if (e.attr === 'html') el.innerHTML = v;
    else if (e.attr === 'text') el.textContent = v;
    else el.setAttribute(e.attr, v);
  }
  document.documentElement.lang = lang;
}

export function setLang(next) {
  lang = next === 'en' ? 'en' : 'ko';
  try { localStorage.setItem(LANG_KEY, lang); } catch {}
  applyDataLang();
  translateStaticDom();
  window.dispatchEvent(new CustomEvent('lang-changed'));
}

export function initI18n() {
  applyDataLang();
  translateStaticDom();
}
