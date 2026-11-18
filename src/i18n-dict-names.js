// 명칭 사전: 자원·세력·유닛·건물·업그레이드·능력·지형 이름 (영어 원문 → 한국어)
export const DICT_NAMES = new Map(Object.entries({
  // 자원
  'Grain': '곡물', 'Timber': '목재', 'Bronze': '청동',
  'Divine Favor': '신성한 은총', 'Forbidden Knowledge': '금단의 지식',
  // 세력
  'The Covenant Cities': '언약의 도시들',
  'The Watcher Remnant': '감시자 잔당',
  'The Nephilim Clans': '네필림 부족',
  // 언약 유닛
  'Laborer': '노동자', 'Bronze Spearman': '청동 창병', 'Sling Archer': '투석 궁수',
  'War Chariot': '전차', 'Temple Guard': '신전 근위병', 'Prophet': '예언자',
  'Nimrod the Priest-King': '제사장-왕 니므롯',
  'Phalanx Brace': '방진 결속', 'Aimed Shot': '조준 사격', 'Trample Charge': '짓밟기 돌진',
  'Sacred Balm': '신성한 연고', "Heaven's Wrath": '하늘의 진노', 'Judgment of Heaven': '하늘의 심판',
  // 언약 건물
  'City Center': '도시 중심지', 'Granary': '곡물창고', 'Barracks': '병영',
  'Bronze Foundry': '청동 주조소', 'Temple': '신전', 'Watchtower': '망루',
  // 감시자 유닛
  'Bound Servitor': '속박된 하인', 'Star-Metal Warrior': '별금속 전사',
  'Watcher Adept': '감시자 술사', 'Skyfire Caster': '천화 술사',
  'Nephilim Hybrid': '네필림 혼혈', 'The Fallen Watcher': '타락한 감시자',
  'Iron Surge': '철의 격류', 'Wither': '시듦', 'Nova Cascade': '신성 폭발 연사',
  'Rend': '찢어발기기', 'Void Rend': '공허 찢기',
  // 감시자 건물
  'Fallen Spire': '타락의 첨탑', 'Star Forge': '별의 대장간', 'Obsidian Gate': '흑요석 문',
  'Forbidden Archive': '금단의 기록보관소', 'Hybrid Pit': '혼혈의 구덩이', 'Watcher Tower': '감시자의 탑',
  // 네필림 유닛
  'Thrall Worker': '노예 일꾼', 'Giant-Blood Raider': '거인혈통 약탈자',
  'Bone Club Champion': '뼈곤봉 용사', 'War Beast': '전쟁 야수',
  'Mountain Giant': '산악 거인', 'Clan Shaman': '부족 주술사',
  'Og, Last of the Giants': '오그, 마지막 거인',
  'Blood Rage': '피의 격노', 'Savage Blow': '야만의 일격', 'Pack Howl': '무리의 울부짖음',
  'Ground Slam': '대지 강타', 'Raise the Drowned': '익사자 소생', "World-Ender's Blow": '세계종결자의 일격',
  // 네필림 건물
  'Clan Hearth': '부족의 화로', 'Bone Pit': '뼈 구덩이', 'War Lodge': '전쟁 오두막',
  'Beast Den': '야수 소굴', 'Totem of Dread': '공포의 토템', 'Giant Cairn': '거인의 돌무덤',
  // 업그레이드
  'Tempered Bronze': '단련된 청동', 'Consecrated Edges': '축성된 날',
  'Scale Hauberks': '비늘 사슬갑옷', 'Sanctified Plate': '성화된 판금갑옷',
  'Anointing Oil': '성유', 'Burning Script': '불타는 문자', 'Elder Script': '태고의 문자',
  'Graven Flesh': '새겨진 살', 'Obsidian Flesh': '흑요석 육신',
  'Blood of the First': '태초의 피', 'Blood of the Fallen': '몰락자의 피',
  'Scarred Hides': '흉터투성이 가죽', 'Titan Hides': '티탄의 가죽',
  // 중립·보스·들녘 세력
  'Devourer': '포식자', 'Leviathan, the Flood-Wyrm': '리바이어던, 홍수의 뱀',
  'A Nephilim Titan': '네필림 티탄', 'Sentinel of the Watchers': '감시자의 파수기계',
  'Deluge': '대홍수', 'Worldbreaker Slam': '세계파괴 강타', 'Sigil Barrage': '인장 일제사격',
  'Landonian Marauder': '랜도니아 약탈자', 'Boydonian Zealot': '보이도니아 광신도',
  'Landonian Warwagon': '랜도니아 전투수레',
  'Parker, Shepherd of the Fields': '파커, 들녘의 목자',
  'Tucker, the Goldendoodle': '터커, 골든두들',
  'Gatsby, the French Bulldog': '개츠비, 프렌치 불도그',
  'The House of Greene': '그린 가문의 저택',
  'SCOTT · the Green-Eyed Sentinel': 'SCOTT · 초록 눈의 파수꾼',
  'Optic Overload': '광학 과부하',
  // 자원 노드
  'Wild Grain Field': '야생 곡물밭', 'Cedar Stand': '삼나무 숲',
  'Bronze Lode': '청동 광맥', 'Graven Obelisk': '새김 오벨리스크',
  // 지형(바이옴)
  'Fertile River Valley': '비옥한 강 유역', 'Ancient Cedar Stands': '태고의 삼나무 숲',
  'Basalt Highlands': '현무암 고지대', 'Nephilim Wasteland': '네필림 황무지',
  'The Watcher Ruins': '감시자의 폐허', 'Sacred Mountain Foothills': '성스러운 산기슭',
  'Salt Wastes of Uz': '우즈의 소금 황야', 'The Drowned Delta': '물에 잠긴 삼각주',
  // 캠페인 임무
  'The Shepherd’s Plea': '목자의 간청', 'The Feud of Fields': '들녘의 분쟁',
  'The Green-Eyed Sentinel': '초록 눈의 파수꾼', 'The Deluge': '대홍수',
  // 업적
  'First Light': '첫 새벽', 'Line of Seth': '셋의 계보', 'Blood of Giants': '거인의 피',
  'Against the Storm': '폭풍에 맞서', 'Before the Rains': '비가 오기 전에',
  'Last House Standing': '마지막까지 남은 가문', 'Word Made Flesh': '말씀이 육신이 되어',
  'Monster Hunter': '괴물 사냥꾼', 'The Green Eye Closes': '감긴 초록 눈',
  'Fields of Ruin': '폐허가 된 들녘', 'Storm-Tested': '폭풍이 단련한',
  'The Unbowed': '굴하지 않는 자', 'Pilgrim': '순례자',
}));
