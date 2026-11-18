// 설명 사전: 세력·유닛·건물·능력·업그레이드 설명문 (영어 원문 → 한국어)
export const DICT_DESCS = new Map(Object.entries({
  // 세력 설명
  'Priest-king city-states of the river valleys. Bronze, grain, and the favor of heaven hold their walls against the coming dark.':
    '강 유역의 제사장-왕 도시 국가들. 청동과 곡물, 하늘의 은총이 다가오는 어둠에 맞서 성벽을 지킨다.',
  'Fallen sons of heaven and their bound disciples. Star-metal, forbidden writing, and flesh remade in obsidian halls.':
    '타락한 하늘의 아들들과 그들에게 속박된 추종자들. 별의 금속, 금단의 문자, 흑요석 전당에서 다시 빚어진 육신.',
  'Giant-blooded clans of the burning mountains. They do not build walls; they break them.':
    '불타는 산맥의 거인 혈통 부족들. 그들은 성벽을 쌓지 않는다. 부술 뿐이다.',
  // 언약 유닛·능력 설명
  'Tends the fields and raises the walls of the faithful.': '밭을 일구고 신자들의 성벽을 쌓는다.',
  'Phalanx of the city levy. Spears against chariot and beast.': '도시 징집병의 방진. 전차와 짐승을 창으로 받는다.',
  'Brace spears: +2 armor & −40% speed for 6 s. Spearwall stands firm against cavalry.':
    '창을 받쳐 세움: 6초간 방어력 +2, 이동속도 -40%. 창벽은 기병 앞에서도 흔들리지 않는다.',
  'Slingers of the outer villages. Stones fell the slow and the great.': '변방 마을의 투석병. 돌멩이가 느린 자와 거대한 자를 쓰러뜨린다.',
  'Channel a killing blow: next sling stone deals 2.5× damage.': '치명의 일격을 모은다: 다음 투석이 2.5배 피해를 준다.',
  'Bronze-shod wheels of the king. Runs down the light of foot.': '왕의 청동 바퀴. 가벼운 보병을 들이받는다.',
  '+70% speed & 2× damage for 2 s. Run them down before they scatter.': '2초간 이동속도 +70%, 피해 2배. 흩어지기 전에 들이받아라.',
  'Sworn wardens of the inner sanctuary. Anathema to corrupted flesh.': '내성소의 맹세한 수호자. 타락한 육신의 천적.',
  'Lay on hands: restore 70 HP to every nearby ally and mend allied walls.': '손을 얹어 치유: 주변 모든 아군의 HP 70 회복, 아군 성벽 수리.',
  'Speaks the burning word. Fire from heaven scatters the gathered host.': '불타는 말씀을 전한다. 하늘의 불이 모인 군중을 흩뜨린다.',
  'Call down fire: 3× AoE damage to all enemies within 5 tiles of the prophet.': '불을 불러내린다: 예언자 주변 5타일의 모든 적에게 3배 광역 피해.',
  'The first king of the world\'s last age. His word is law; his staff is judgment. One hero may walk with your host — and grows in might with every foe felled.':
    '세상 마지막 시대의 첫 왕. 그의 말이 곧 법이고 지팡이가 곧 심판이다. 영웅 한 명이 그대의 군대와 함께하며, 쓰러뜨린 적마다 강해진다.',
  'The king speaks: 4× AoE holy fire in a 6-tile radius. None are spared the verdict.': '왕이 선언한다: 반경 6타일에 4배 광역 성화(聖火). 그 판결을 피할 자 없다.',
  // 언약 건물 설명
  'Seat of the priest-king. If it falls, the covenant is broken.': '제사장-왕의 자리. 무너지면 언약도 깨진다.',
  'Stores the harvest against famine and siege. Houses the people.': '기근과 포위에 대비해 수확을 저장한다. 백성을 수용한다.',
  'Levy hall of the city. Spear and sling are mustered here.': '도시의 징집소. 창과 투석대가 여기서 모인다.',
  'Furnaces of tin and copper. Arms the host and builds the chariots of war.': '주석과 구리의 용광로. 군대를 무장시키고 전차를 만든다.',
  'High place of offering. Favor descends upon the faithful city.': '제물을 바치는 높은 곳. 은총이 신실한 도시에 내린다.',
  'Eyes upon the wilderness. Slingers man the heights.': '황야를 지켜보는 눈. 투석병이 높은 곳을 지킨다.',
  // 감시자 유닛·능력 설명
  'Oath-bound flesh that labors without rest beneath the sigils.': '인장 아래에서 쉬지 않고 일하는, 맹세에 묶인 육신.',
  'Clad in iron that fell burning from the sky.': '하늘에서 불타며 떨어진 철로 무장했다.',
  'Star-metal awakens: attack cooldown cut by 45% for 6 s (nearly twice the strike rate).':
    '별금속이 깨어난다: 6초간 공격 재사용 시간 45% 감소 (거의 두 배의 타격 속도).',
  'Reads the unlawful names. Burning script unbinds bronze and bone.': '금지된 이름들을 읽는다. 불타는 문자가 청동과 뼈를 풀어낸다.',
  'Inscribe the curse of unmaking: target takes 1.8× damage from all sources for 8 s.': '해체의 저주를 새긴다: 대상이 8초간 모든 피해를 1.8배로 받는다.',
  'Calls down the falling star. The gathered host is made ash.': '떨어지는 별을 불러내린다. 모인 군중이 재가 된다.',
  'Star-metal awakens: attack cooldown cut by 45% for 6 s (nearly twice the strike rate). ': '별금속이 깨어난다: 6초간 공격 재사용 시간 45% 감소.',
  'Unleash the archive: simultaneously fires skyfire bolts at up to 3 nearby enemies.': '기록보관소를 해방한다: 주변 적 최대 3명에게 천화 탄환을 동시 발사.',
  'Born of two worlds in the pits. Walls mean nothing to it.': '구덩이에서 두 세계의 피로 태어났다. 성벽 따위는 의미가 없다.',
  'Tear the veil: 3.5× corruption damage and 3 s stun in a 5.5-tile radius.': '장막을 찢는다: 반경 5.5타일에 3.5배 타락 피해와 3초 기절.',
  'The Watcher who did not ascend. Old beyond memory, armor wrought from fallen stars. One hero walks with the Remnant — and grows in might with every foe felled.':
    '승천하지 못한 감시자. 기억보다 오래되었고, 떨어진 별로 갑옷을 벼려냈다. 영웅 한 명이 잔당과 함께하며, 쓰러뜨린 적마다 강해진다.',
  'Tear into flesh and stone: next attack deals 3× damage.': '살과 돌을 찢는다: 다음 공격이 3배 피해.',
  // 감시자 건물 설명
  'Where the Watcher descended and did not return. The remnant gathers beneath it.': '감시자가 내려왔으나 돌아가지 않은 곳. 잔당이 그 아래 모인다.',
  'Smelts the sky-fallen iron. Shelters the bound.': '하늘에서 떨어진 철을 녹인다. 속박된 자들을 수용한다.',
  'A ring of black stone. What is summoned through it serves.': '검은 돌의 고리. 그것을 통해 소환된 것은 복종한다.',
  'Tablets that should have burned. Each shelf is a sin and a weapon.': '불탔어야 할 서판들. 선반마다 죄악이자 무기다.',
  'Born of two worlds in the pits. Walls mean nothing to it. ': '구덩이에서 두 세계의 피로 태어났다.',
  'Flesh is rewritten here. The screaming is part of the process.': '육신이 여기서 다시 쓰인다. 비명도 과정의 일부다.',
  'An unblinking eye of obsidian. It remembers every trespass.': '감기지 않는 흑요석의 눈. 모든 침입을 기억한다.',
  // 네필림 유닛·능력 설명
  'Taken in raids, kept by fear. Hauls bone and timber for the clans.': '약탈로 잡혀와 공포로 묶여 있다. 부족을 위해 뼈와 목재를 나른다.',
  'Fast, half-giant, and hungry. Strikes the fields before the alarm sounds.': '빠르고, 반은 거인이며, 굶주려 있다. 경보가 울리기 전에 들녘을 친다.',
  'Half-giant fury: +60% speed & +40% attack speed for 8 s.': '반거인의 분노: 8초간 이동속도 +60%, 공격속도 +40%.',
  'Carries the thighbone of his grandsire. It has opinions about your shield wall.': '조부의 넓적다리뼈를 들고 다닌다. 그것은 그대의 방벽에 할 말이 있다.',
  'Thighbone of the grandsire swings true: next strike deals 3× damage and stuns for 2 s.': '조부의 넓적다리뼈가 정확히 휘둘린다: 다음 타격이 3배 피해와 2초 기절.',
  'Bred in the dens from things that should have drowned long ago.': '오래전에 익사했어야 할 것들로 소굴에서 길러졌다.',
  'The pack answers: nearby allied beasts gain +40% speed & +30% damage for 6 s.': '무리가 응답한다: 주변 아군 야수가 6초간 이동속도 +40%, 피해 +30%.',
  'Older than the cities he ends. Gates are a suggestion.': '자신이 끝장낼 도시들보다 오래되었다. 성문 따위는 권고일 뿐.',
  'Shake the earth: 1.5× damage and 2 s stun to all enemies within 4.5 tiles.': '대지를 흔든다: 4.5타일 내 모든 적에게 1.5배 피해와 2초 기절.',
  'Burns the marrow of giants and speaks with what answers.': '거인의 골수를 태우고, 응답하는 것과 대화한다.',
  'Call the drowned dead back to the fight: 3 raiders rise for 18 s, then crumble to silt.': '익사한 망자를 전투로 불러낸다: 약탈자 3명이 18초간 일어났다가 흙으로 돌아간다.',
  'Born when the first men were young. The world trembles at each step. Og walks last into battle and last out of legend. One hero walks with the Clans — and grows in might with every foe felled.':
    '첫 인류가 어렸을 때 태어났다. 세상이 그의 발걸음마다 떨린다. 오그는 전투에도 전설에도 가장 마지막으로 들어서고 나온다. 영웅 한 명이 부족과 함께하며, 쓰러뜨린 적마다 강해진다.',
  'Og brings down his fist. 5× damage and 2.5 s stun in a 5.5-tile radius. Gates remember it.': '오그가 주먹을 내리꽂는다. 반경 5.5타일에 5배 피해와 2.5초 기절. 성문들이 그것을 기억한다.',
  // 네필림 건물 설명
  'The fire that may not die. While it burns, the clans are one.': '꺼져서는 안 되는 불. 타오르는 한 부족은 하나다.',
  'Trophies, stores, and sleeping holes. Mind the smell.': '전리품, 저장고, 잠자리 구덩이. 냄새는 감수하시길.',
  'Where boasts are made and then, occasionally, kept.': '허세가 부려지고, 가끔은 지켜지기도 하는 곳.',
  'Chains, meat, and patience. Two of the three usually hold.': '사슬, 고기, 인내. 셋 중 둘은 대개 버틴다.',
  'Skulls of the drowned world. Enemies remember why they fear the mountains.': '물에 잠긴 세상의 해골들. 적들은 산맥을 두려워한 이유를 기억한다.',
  "A dead giant's barrow. The clan throws stones from his shoulders.": '죽은 거인의 무덤. 부족은 그의 어깨 위에서 돌을 던진다.',
  'A stubborn pre-flood manor at the heart of the Fields of Evil. It stood before the quarrel and means to outlast it. Topple it for a trove of forbidden knowledge.':
    '악의 들녘 한가운데 버티는 고집 센 대홍수 이전의 저택. 분쟁 이전부터 서 있었고 분쟁보다 오래 버틸 작정이다. 쓰러뜨리면 금단의 지식 보화를 얻는다.',
  // 업그레이드 설명
  '+20% unit damage.': '유닛 피해 +20%.',
  '+25% more unit damage (stacks with Tempered Bronze).': '유닛 피해 추가 +25% (단련된 청동과 중첩).',
  '+1 unit armor.': '유닛 방어력 +1.',
  '+2 more unit armor (stacks with Scale Hauberks).': '유닛 방어력 추가 +2 (비늘 사슬갑옷과 중첩).',
  '+15% unit health.': '유닛 체력 +15%.',
  '+25% more unit damage (stacks with Burning Script).': '유닛 피해 추가 +25% (불타는 문자와 중첩).',
  '+20% unit health.': '유닛 체력 +20%.',
  '+25% more unit health (stacks with Graven Flesh).': '유닛 체력 추가 +25% (새겨진 살과 중첩).',
  '+25% more unit damage (stacks with Blood of the First).': '유닛 피해 추가 +25% (태초의 피와 중첩).',
  '+2 more unit armor (stacks with Scarred Hides).': '유닛 방어력 추가 +2 (흉터투성이 가죽과 중첩).',
  // 중립·보스 설명
  'It was left to guard the obelisk. It does not remember by whom.': '오벨리스크를 지키도록 남겨졌다. 누가 남겼는지는 기억하지 못한다.',
  'A serpent of the drowned world, scaled in basalt and brine. It remembers the Flood, and means to repeat it.':
    '물에 잠긴 세상의 뱀. 현무암과 소금물의 비늘을 지녔다. 대홍수를 기억하며, 그것을 되풀이하려 한다.',
  'Calls down the waters of the deep — an engulfing wave that batters and staggers everything near. Telegraphed: pull out of the ring to dodge.':
    '심해의 물을 불러내린다 - 삼켜버리는 파도가 주변 모든 것을 때리고 비틀거리게 한다. 예고됨: 피하려면 원 밖으로 빠져나가라.',
  'One of the giants of old, taller than the gatehouse, older than the kingdom. The ground keeps its footprints.':
    '옛 거인들 중 하나. 문루보다 크고 왕국보다 오래되었다. 대지가 그의 발자국을 간직하고 있다.',
  'Brings both fists down like falling mountains — a shockwave that stuns and crushes. Telegraphed: clear the ring before it lands.':
    '두 주먹을 무너지는 산처럼 내리꽂는다 - 기절시키고 짓누르는 충격파. 예고됨: 떨어지기 전에 원 밖으로 빠져나가라.',
  'A construct the Watchers left behind — all geometry and judgement, still enforcing a law no one living recalls.':
    '감시자들이 남기고 간 구조물 - 전부 기하학과 심판이며, 살아 있는 누구도 기억 못 하는 법을 아직 집행하고 있다.',
  'Looses a fan of searing glyph-bolts at everything in range at once.': '사거리 안 모든 것을 향해 작열하는 문자 탄환의 부채를 한꺼번에 쏜다.',
  'A clan that insists the Fields were theirs first. Loud, relentless, weirdly organized.':
    '들녘이 원래 자기네 것이라고 우기는 부족. 시끄럽고, 집요하고, 이상할 정도로 조직적이다.',
  'Sworn rivals of the Landonians over a boundary no one else can see. They will not be moved.':
    '다른 누구에게도 보이지 않는 경계를 두고 랜도니아와 맹렬히 다투는 숙적. 그들은 물러나지 않는다.',
  'A white war-chariot of impossible make, grille agleam, its lord reclined in the bed with a drink. The Landonians do not explain it. They simply arrive.':
    '있을 수 없는 구조의 하얀 전쟁전차. 반짝이는 그릴, 짐칸에는 술을 든 군주가 기대어 있다. 랜도니아인들은 설명하지 않는다. 그저 나타날 뿐이다.',
  'The Shepherd of the Fields. He means no one harm — he only wants to know how you are doing, and to keep his flock from spooking. Raise a hand against him and even shepherds defend the fold.':
    '들녘의 목자. 그는 누구에게도 해를 끼칠 뜻이 없다 - 그저 당신이 잘 지내는지 알고 싶고, 양 떼가 놀라지 않기를 바랄 뿐이다. 그에게 손을 대면 목자라도 우리를 지킨다.',
  'Small, stout, and utterly unbothered. The House of Greene\'s second hound holds the line with supreme indifference.':
    '작고, 뚱뚱하고, 완전히 태연하다. 그린 가문의 둘째 사냥개가 지극한 무관심으로 전선을 지킨다.',
  'Mr Greene\'s right-hand hound and the warmest soul in the Fields of Evil. Catches your scent a mile off.':
    '그린 씨의 오른팔 사냥개이자 악의 들녘에서 가장 따뜻한 영혼. 1마일 밖에서도 당신의 냄새를 맡는다.',
  'A sentinel in white plate, green optics aglow beneath a dark visor. He lifts his helm, smiles — then the smile is gone and the rings begin. Few who summon him are ready for what answers.':
    '하얀 판금갑옷의 파수꾼. 어두운 면갑 아래 초록 광학이 빛난다. 그는 투구를 들어 올리고 미소짓는다 - 그리고 미소가 사라지면 고리가 시작된다. 그를 소환한 자 중 그 답변에 준비된 자는 드물다.',
  'His visor flares and a ring of green force erupts where he stands — pull your units out of the ring before it lands to dodge.':
    '면갑이 타오르고 그가 선 자리에 초록 기운의 고리가 솟는다 - 피하려면 고리가 떨어지기 전에 유닛을 빼내라.',
}));
