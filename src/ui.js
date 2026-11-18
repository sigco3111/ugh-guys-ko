// HUD: resource bar, minimap, selection/command panel, health bars, toasts.
import * as THREE from 'three';
import { GRID, TILE, WORLD } from './terrain.js';
import { RESOURCE_INFO, UPGRADES } from './data.js';
import { Sound } from './audio.js';
import { T, L } from './i18n.js';

const UNIT_ICONS = {
  laborer: '⛏', spearman: '🛡', archer: '🏹', chariot: '🐎', temple_guard: '⚔', prophet: '🔥',
  servitor: '⛏', starmetal: '⚔', adept: '✦', skyfire: '☄', hybrid: '👹',
  thrall: '⛏', raider: '🪓', champion: '🦴', warbeast: '🐺', giant: '🗿', shaman: '💀',
  devourer: '🐲',
  hero_nimrod: '👑', hero_fallen: '🌌', hero_og: '⚡',
};
const BLD_ICONS = {
  city_center: '🏛', granary: '🌾', barracks: '⚔', foundry: '⚒', temple: '🔥', watchtower: '🗼',
  fallen_spire: '🌠', star_forge: '☄', obsidian_gate: '🌀', archive: '📜', hybrid_pit: '🕳', watcher_tower: '👁',
  clan_hearth: '🔥', bone_pit: '🦴', war_lodge: '🪓', beast_den: '🐺', totem: '💀', giant_cairn: '🗿',
};

function costStr(cost) {
  return Object.entries(cost || {}).map(([k, v]) => `${RESOURCE_INFO[k].icon}${v}`).join(' ');
}

export class UI {
  constructor(game, onRestart) {
    this.game = game;
    this.onRestart = onRestart;
    this.controls = null; // set by main after construction
    this.buildMenuOpen = false;
    this.refreshT = 0;
    this.pings = [];

    this.elRes = document.getElementById('resources');
    this.elPanel = document.getElementById('panel');
    this.elInfo = document.getElementById('selinfo');
    this.elCmds = document.getElementById('commands');
    this.elToasts = document.getElementById('toasts');
    this.elClock = document.getElementById('clock');
    this.minimap = document.getElementById('minimap');
    this.mmCtx = this.minimap.getContext('2d');
    this.overlay = document.getElementById('overlay');
    this.ovCtx = this.overlay.getContext('2d');

    this.bakeMinimapTerrain();
    this.bindMinimap();

    game.on('selection', () => this.refreshPanel());
    game.on('toast', (msg) => this.toast(msg));
    game.on('ping', (x, z) => this.pings.push({ x, z, t: 6 }));
    game.on('gameover', (winner) => this.showGameOver(winner));
    game.on('ground-click', (x, z, kind) => this.groundMarker(x, z, kind));
    game.on('dialogue', (portrait, name, line) => this.showDialogue(portrait, name, line));
    const dlg = document.getElementById('dialogue');
    if (dlg) dlg.onclick = () => this.hideDialogue();

    const idleBtn = document.getElementById('btn-idle');
    if (idleBtn) idleBtn.onclick = () => this.selectIdleWorker();
    document.getElementById('btn-menu').onclick = () => onRestart();
    const bp = document.getElementById('btn-pause');
    if (bp) bp.onclick = () => this.onPause?.();
    // pause-menu buttons
    const pm = document.getElementById('pausemenu');
    if (pm) {
      pm.querySelector('#pm-resume').onclick = () => this.onResume?.();
      pm.querySelector('#pm-save').onclick = () => this.onSave?.();
      pm.querySelector('#pm-load').onclick = () => this.onLoad?.();
      pm.querySelector('#pm-quit').onclick = () => onRestart();
    }
    this.refreshPanel();
  }

  setPaused(on, saveExists) {
    const pm = document.getElementById('pausemenu');
    if (pm) {
      pm.style.display = on ? 'flex' : 'none';
      const load = pm.querySelector('#pm-load');
      if (load) load.style.display = saveExists ? 'inline-block' : 'none';
    }
    const bp = document.getElementById('btn-pause');
    if (bp) bp.textContent = on ? T('Resume') : T('Pause');
  }

  // ---------- minimap ----------
  bakeMinimapTerrain() {
    const c = document.createElement('canvas');
    c.width = GRID; c.height = GRID;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(GRID, GRID);
    const map = this.game.map;
    for (let i = 0; i < GRID * GRID; i++) {
      const h = map.height[i];
      let r = 46, g = 46, b = 54;
      if (h > 3.2) { r = 24; g = 24; b = 30; }
      else { const t = h / 3.2; r = 40 + t * 26; g = 38 + t * 24; b = 44 + t * 18; }
      img.data[i * 4] = r; img.data[i * 4 + 1] = g; img.data[i * 4 + 2] = b; img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    this.mmTerrain = c;
  }

  bindMinimap() {
    const mm = this.minimap;
    const toWorld = (e) => {
      const r = mm.getBoundingClientRect();
      return {
        x: (e.clientX - r.left) / r.width * WORLD,
        z: (e.clientY - r.top) / r.height * WORLD,
      };
    };
    // Pointer events so fingers get the same treatment as the mouse: tap/press jumps
    // the camera, dragging scrubs it (the old mouse-only listeners left touch with a
    // single synthesized jump and no drag). Right-click keeps the move-order.
    let panning = false;
    mm.style.touchAction = 'none';
    mm.addEventListener('contextmenu', e => e.preventDefault());
    mm.addEventListener('pointerdown', e => {
      const w = toWorld(e);
      if (e.button === 2) {
        const sel = this.game.selection.filter(s => s.isUnit && s.owner === this.game.localPlayer);
        if (sel.length) { this.game.cmd('formation', { sel, x: w.x, z: w.z, am: false, q: e.shiftKey }); Sound.command(); }
        return;
      }
      panning = true;
      try { mm.setPointerCapture(e.pointerId); } catch {}
      this.controls.moveCameraTo(w.x, w.z);
      e.preventDefault();
    });
    mm.addEventListener('pointermove', e => {
      if (!panning) return;
      const w = toWorld(e);
      this.controls.moveCameraTo(w.x, w.z);
    });
    const stop = () => { panning = false; };
    mm.addEventListener('pointerup', stop);
    mm.addEventListener('pointercancel', stop);
  }

  drawMinimap() {
    const ctx = this.mmCtx, S = this.minimap.width;
    const k = S / WORLD;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.mmTerrain, 0, 0, S, S);
    // fog multiply
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(this.game.map.fogCanvas, 0, 0, S, S);
    ctx.globalCompositeOperation = 'source-over';
    // resources
    for (const n of this.game.resources) {
      if (this.game.map.fogStateAt(n.pos.x, n.pos.z) === 0) continue;
      ctx.fillStyle = RESOURCE_INFO[n.type].color;
      ctx.fillRect(n.pos.x * k - 1, n.pos.z * k - 1, 2.5, 2.5);
    }
    // entities
    for (const b of this.game.buildings) {
      if (b.owner !== this.game.localPlayer && !(b.discovered && this.game.map.fogStateAt(b.pos.x, b.pos.z) >= 1)) continue;
      ctx.fillStyle = b.owner === this.game.localPlayer ? this.game.me.faction.colorCss : b.owner === this.game.NEUTRAL ? '#c9bd92' : this.game.seatCss(b.owner);
      const s = b.size * TILE * k;
      ctx.fillRect(b.pos.x * k - s / 2, b.pos.z * k - s / 2, s, s);
    }
    for (const u of this.game.units) {
      if (u.owner !== this.game.localPlayer && this.game.map.fogStateAt(u.pos.x, u.pos.z) !== 2) continue;
      ctx.fillStyle = u.owner === this.game.localPlayer ? '#9be86e' : u.owner === this.game.NEUTRAL ? '#c9bd92' : this.game.seatCss(u.owner);
      ctx.fillRect(u.pos.x * k - 1, u.pos.z * k - 1, 2, 2);
    }
    // pings
    for (const p of this.pings) {
      p.t -= 0.25;
      ctx.strokeStyle = `rgba(255,60,40,${Math.max(0, p.t / 6)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x * k, p.z * k, 4 + (6 - p.t) * 2 % 8, 0, Math.PI * 2);
      ctx.stroke();
    }
    this.pings = this.pings.filter(p => p.t > 0);
    // camera box
    const f = this.controls.focus, yaw = this.controls.yaw;
    ctx.save();
    ctx.translate(f.x * k, f.z * k);
    ctx.rotate(-yaw);
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 1;
    const vw = this.controls.dist * 0.9 * k, vh = this.controls.dist * 0.6 * k;
    ctx.strokeRect(-vw / 2, -vh / 2, vw, vh);
    ctx.restore();
  }

  // ---------- ground click marker ----------
  groundMarker(x, z, kind) {
    const color = kind === 'attack' ? 0xff4433 : kind === 'queue' ? 0x66ccff : 0x66ff88;
    const mesh = new THREE.Mesh(
      new THREE.RingGeometry(0.3, 0.55, 16),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, this.game.map.heightAt(x, z) + 0.1, z);
    this.game.scene.add(mesh);
    this.game.effects.push({ mesh, life: 0.5, max: 0.5, type: 'ring' });
  }

  // ---------- top bar ----------
  drawResources() {
    const p = this.game.me;
    const r = p.resources;
    let html = '';
    for (const k of ['grain', 'timber', 'bronze', 'favor', 'knowledge']) {
      html += `<span class="res" title="${RESOURCE_INFO[k].name}"><b style="color:${RESOURCE_INFO[k].color}">${RESOURCE_INFO[k].icon}</b> ${Math.floor(r[k] || 0)}</span>`;
    }
    html += `<span class="res" title="${T('Population')}"><b style="color:#9ad">⌂</b> ${p.supplyUsed}/${p.supplyCap}</span>`;
    this.elRes.innerHTML = html;
    const t = Math.floor(this.game.time);
    this.elClock.textContent = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
    // idle-worker badge — a classic RTS quality-of-life cue
    const idle = this.idleWorkers();
    const btn = document.getElementById('btn-idle');
    if (btn) {
      btn.style.display = idle.length ? 'inline-block' : 'none';
      const c = document.getElementById('idle-count');
      if (c) c.textContent = idle.length;
    }
  }

  idleWorkers() {
    return this.game.units.filter(u => u.owner === this.game.localPlayer && !u.dead && u.def.worker && u.state === 'idle');
  }
  // select the next idle worker and snap the camera to it (button + '.' hotkey)
  selectIdleWorker() {
    const idle = this.idleWorkers();
    if (!idle.length) return;
    this._idleI = ((this._idleI ?? -1) + 1) % idle.length;
    const w = idle[this._idleI] || idle[0];
    this.game.selection = [w];
    this.game.emit('selection');
    this.controls?.moveCameraTo?.(w.pos.x, w.pos.z);
    Sound.select();
  }

  // ---------- selection / command panel ----------
  refreshPanel() {
    const sel = this.game.selection;
    const cmds = [];
    let info = '';
    if (!sel.length) {
      info = `<div class="sel-name">${this.game.me.faction.name}</div><div class="sel-desc">${T('Select units with left-click / drag. Right-click to command.')}</div>`;
      this.buildMenuOpen = false;
    } else if (sel.length === 1) {
      const e = sel[0];
      const hp = `${Math.ceil(e.hp)}/${e.maxHp}`;
      const heroRank = e.hero ? ` <span class="hero-rank">★ Lv ${e.level}</span>` : '';
      info = `<div class="sel-name">${e.def.name || e.def.name}${heroRank}</div>`;
      if (e.isResource) {
        info += `<div class="sel-hp">${L(`${Math.floor(e.amount)} remaining`, `${Math.floor(e.amount)} 남음`)}</div>`;
      } else {
        info += `<div class="sel-hp">HP ${hp}</div>`;
        if (e.hero && e.level < 5) {
          const need = [0, 12, 30, 56, 92][e.level];
          info += `<div class="sel-hp" style="color:#c9a86a">${L(`XP ${e.xp}/${need} to Lv ${e.level + 1}`, `XP ${e.xp}/${need} · 레벨 ${e.level + 1}까지`)}</div>`;
        }
      }
      info += `<div class="sel-desc">${e.def.desc || ''}</div>`;
      if (e.isBuilding && !e.complete) info += `<div class="sel-hp">${L(`Construction ${Math.floor(e.progress * 100)}%`, `건설 중 ${Math.floor(e.progress * 100)}%`)}</div>`;
      if (e.isBuilding && e.trainQueue.length) {
        const j = e.trainQueue[0];
        const nm = j.upgrade ? UPGRADES[j.key].name : this.game.players[e.owner].faction.units[j.key].name;
        info += `<div class="queue">▶ ${nm} <progress value="${j.t}" max="${j.total}"></progress> ${L(`(+${e.trainQueue.length - 1} queued)`, `(+${e.trainQueue.length - 1} 대기)`)}</div>`;
      }
    } else {
      const counts = {};
      for (const e of sel) counts[e.def.name] = (counts[e.def.name] || 0) + 1;
      info = `<div class="sel-name">${L(`${sel.length} selected`, `${sel.length}개 선택`)}</div><div class="sel-desc">` +
        Object.entries(counts).map(([n, c]) => `${c}× ${n}`).join(', ') + '</div>';
    }
    this.elInfo.innerHTML = info;

    // commands
    const own = sel.filter(s => s.owner === this.game.localPlayer);
    const units = own.filter(s => s.isUnit);
    const workers = units.filter(u => u.def.worker);
    const building = own.length === 1 && own[0].isBuilding ? own[0] : null;
    const faction = this.game.me.faction;

    if (units.length) {
      cmds.push({ icon: '⚔', label: T('Attack-Move (F)'), cls: 'cmd-act' + (this.controls?.attackMoveArm ? ' cmd-on' : ''),
        tip: T('Attack-move — advance and engage everything hostile on the way. Tap/click the destination next.'),
        fn: () => { this.controls.attackMoveArm = true; this.controls.patrolArm = false; this.toast(T('⚔ Now tap where to attack-move')); this.refreshPanel(); } });
      cmds.push({ icon: '♺', label: T('Patrol (R)'), cls: 'cmd-act' + (this.controls?.patrolArm ? ' cmd-on' : ''),
        tip: T('Patrol — walk between here and the destination, engaging what appears. Tap/click the far point next.'),
        fn: () => { this.controls.patrolArm = true; this.controls.attackMoveArm = false; this.toast(T('♺ Now tap the far patrol point')); this.refreshPanel(); } });
      cmds.push({ icon: '✋', label: T('Stop (X)'), cls: 'cmd-act', fn: () => this.game.cmd('stop', { sel: units }) });
      // combat stance — shared value highlighted when the whole selection agrees
      const fighters = units.filter(u => u.def.attack && !u.def.worker);
      if (fighters.length) {
        const allSame = (s) => fighters.every(u => u.stance === s);
        const STANCES = [['aggressive', '⚔', 'Aggressive'], ['defensive', '🛡', 'Defensive'], ['hold', '⚓', 'Hold (Y)']];
        for (const [s, icon, label] of STANCES) {
          cmds.push({
            icon, label: T(label), cls: 'cmd-act' + (allSame(s) ? ' cmd-on' : ''),
            tip: `${T(label)}${L(' stance — ', ' 태세 - ')}${T(s === 'aggressive' ? 'hunt freely within sight'
              : s === 'defensive' ? 'engage nearby but return to position' : 'stand ground; strike only what comes in range')}`,
            fn: () => { this.game.cmd('stance', { sel: fighters, s }); Sound.click(); this.refreshPanel(); },
          });
        }
      }
    }
    // ability button — shown when exactly one own non-worker unit with an ability is selected
    if (units.length === 1 && !units[0].def.worker && units[0].def.ability) {
      const u = units[0];
      const ab = u.def.ability;
      const ready = u.abilityCd <= 0;
      cmds.push({
        icon: ab.icon, label: `${ab.name} (Q)`,
        sub: ready ? T('— Ready —') : `${u.abilityCd.toFixed(1)} s`,
        cls: 'cmd-act cmd-ability' + (ready ? ' cmd-ability-ready' : ''),
        tip: ab.desc,
        fn: () => { this.game.cmd('ability', { u }); Sound.click(); this.refreshPanel(); },
      });
    }
    if (workers.length && !this.buildMenuOpen) {
      cmds.push({ icon: '🏗', label: T('Build… (B)'), cls: 'cmd-act', fn: () => { this.buildMenuOpen = true; this.refreshPanel(); } });
    }
    if (workers.length && this.buildMenuOpen) {
      for (const [key, def] of Object.entries(faction.buildings)) {
        if (def.main) continue;
        const avail = this.game.buildingAvailable(0, key);
        const afford = this.game.canAfford(0, def.cost);
        cmds.push({
          icon: BLD_ICONS[key] || '🏛', label: `${def.name}`, sub: costStr(def.cost),
          disabled: !avail || !afford,
          tip: `${def.name} — ${costStr(def.cost)}${def.requires ? L(` (requires ${faction.buildings[def.requires].name})`, ` (필요: ${faction.buildings[def.requires].name})`) : ''}\n${def.desc}`,
          fn: () => { this.controls.startPlacement(key); },
        });
      }
      cmds.push({ icon: '↩', label: T('Back (Esc)'), cls: 'cmd-act', fn: () => { this.buildMenuOpen = false; this.refreshPanel(); } });
    }
    if (building && building.def.main && building.complete) {
      const p = this.game.me;
      const ready = p.empowerCd <= 0;
      cmds.push({
        icon: '⛟', label: T('Marshal Stores (G)'),
        sub: ready ? T('— Ready —') : `${Math.ceil(p.empowerCd)} s`,
        cls: 'cmd-act cmd-ability' + (ready ? ' cmd-ability-ready' : ''),
        tip: T('Marshal the Stores — instant burst of grain & favor and a 10 s surge of gather speed. On a cooldown; keep it up between fights for a macro edge.'),
        fn: () => { if (this.game.cmd('empower', { o: this.game.localPlayer })) Sound.click(); else Sound.error(); this.refreshPanel(); },
      });
    }
    if (building && building.complete) {
      for (const key of building.def.trains) {
        const def = faction.units[key];
        const avail = this.game.unitAvailable(0, key);
        cmds.push({
          icon: UNIT_ICONS[key] || '⚔', label: def.name, sub: costStr(def.cost),
          disabled: !avail,
          tip: `${def.name} — ${costStr(def.cost)} ⌂${def.supply}${def.requires ? L(` (requires ${faction.buildings[def.requires].name})`, ` (필요: ${faction.buildings[def.requires].name})`) : ''}\n${def.desc}`,
          fn: () => { if (!this.game.cmd('train', { b: building, key })) Sound.error(); else Sound.click(); this.refreshPanel(); },
        });
      }
      for (const upKey of building.def.upgrades || []) {
        const up = UPGRADES[upKey];
        if (this.game.me.upgrades.has(upKey)) continue;
        // a tier-2 upgrade stays hidden until its tier-1 prerequisite is researched
        if (up.requires && !this.game.me.upgrades.has(up.requires)) continue;
        cmds.push({
          icon: '⬆', label: up.name, sub: costStr(up.cost),
          tip: `${up.name} — ${costStr(up.cost)}\n${up.desc}`,
          fn: () => { if (!this.game.cmd('upgrade', { b: building, key: upKey })) Sound.error(); else Sound.click(); this.refreshPanel(); },
        });
      }
    }

    this.elCmds.innerHTML = '';
    for (const c of cmds) {
      const btn = document.createElement('button');
      btn.className = 'cmd' + (c.cls ? ' ' + c.cls : '') + (c.disabled ? ' disabled' : '');
      btn.title = c.tip || c.label;
      btn.innerHTML = `<span class="cmd-icon">${c.icon}</span><span class="cmd-label">${c.label}</span>` +
        (c.sub ? `<span class="cmd-sub">${c.sub}</span>` : '');
      // hold-to-preview: touch has no hover, so a ~half-second press surfaces the
      // tooltip (costs, requirements, what an ability does) as a toast instead of
      // firing the command. Works on disabled buttons too (.disabled is a class).
      let holdT = null, held = false;
      btn.addEventListener('pointerdown', () => {
        held = false;
        if (c.tip) holdT = setTimeout(() => { held = true; this.toast('ℹ ' + c.tip.split('\n')[0]); }, 450);
      });
      const clearHold = () => { clearTimeout(holdT); holdT = null; };
      btn.addEventListener('pointerup', clearHold);
      btn.addEventListener('pointerleave', clearHold);
      btn.addEventListener('pointercancel', clearHold);
      btn.onclick = () => { if (held) { held = false; return; } if (!c.disabled) c.fn(); };
      this.elCmds.appendChild(btn);
    }
    this.refreshGroupBar();
  }

  // ---------- control-group bar (touch-first: chips for Army + groups 1-4) ----------
  // Chips build once and read this.controls only inside their handlers (set before any
  // tap), so the bar can be built before controls is wired.
  refreshGroupBar() {
    const bar = document.getElementById('groupbar');
    if (!bar) return;
    if (!bar._built) {
      bar._built = true;
      const mk = (label, tap, hold, title) => {
        const b = document.createElement('button');
        b.className = 'gchip'; b.textContent = label; b.title = title;
        let t = null, fired = false;
        b.addEventListener('pointerdown', () => {
          fired = false;
          if (hold) t = setTimeout(() => { fired = true; hold(b); }, 450);
        });
        const clr = () => { clearTimeout(t); t = null; };
        b.addEventListener('pointerup', clr);
        b.addEventListener('pointerleave', clr);
        b.addEventListener('pointercancel', clr);
        b.onclick = () => { if (fired) { fired = false; return; } tap(b); };
        bar.appendChild(b);
        return b;
      };
      mk(T('⚔ Army'), () => {
        const n = this.controls.selectArmy();
        if (n) { this.controls.snapToSelection(); Sound.click(); } else this.toast(T('No warriors in the field yet.'));
      }, null, T('Select every warrior you command'));
      for (const k of ['1', '2', '3', '4']) {
        mk(k, (b) => {
          if (this.controls.groupSize(k)) { this.controls.recallGroup(k); this.controls.snapToSelection(); }
          else this.toast(L(`Hold ${k} to bind the current selection to it.`, `${k}를 길게 눌러 현재 선택을 이 부대에 지정하세요.`));
        }, (b) => {
          const n = this.controls.assignGroup(k);
          this.toast(n ? L(`⚑ Group ${k} bound — ${n} under its banner.`, `⚑ 부대 ${k} 지정 - ${n}개 유닛이 그 깃발 아래 섭니다.`) : T('Select units first, then hold to bind.'));
          this.refreshGroupBar();
        }, L(`Tap: select group ${k} · Hold: bind selection`, `탭: 부대 ${k} 선택 · 길게: 현재 선택 지정`));
      }
    }
    // live counts on the chips
    if (!this.controls) return;
    const chips = bar.querySelectorAll('.gchip');
    chips.forEach((b, i) => {
      if (i === 0) return;
      const n = this.controls.groupSize(String(i));
      b.textContent = n ? `${i}·${n}` : String(i);
      b.classList.toggle('gchip-set', n > 0);
    });
  }

  // ---------- health bars ----------
  drawHealthBars() {
    const ctx = this.ovCtx;
    const r = this.overlay;
    if (r.width !== window.innerWidth) { r.width = window.innerWidth; r.height = window.innerHeight; }
    ctx.clearRect(0, 0, r.width, r.height);
    const cam = this.game.camera;
    const v = new THREE.Vector3();
    const draw = (e, yOff) => {
      if (!e.mesh.visible) return;
      const selected = this.game.selection.includes(e);
      const hurt = e.hp < e.maxHp;
      const constructing = e.isBuilding && !e.complete;
      if (!selected && !hurt && !constructing) return;
      v.set(e.pos.x, this.game.map.heightAt(e.pos.x, e.pos.z) + yOff, e.pos.z);
      v.project(cam);
      if (v.z > 1) return;
      const sx = (v.x + 1) / 2 * r.width, sy = (-v.y + 1) / 2 * r.height;
      const w = e.isBuilding ? 46 : 26, h = 4;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(sx - w / 2 - 1, sy - 1, w + 2, h + 2);
      const frac = Math.max(0, e.hp / e.maxHp);
      ctx.fillStyle = e.owner === this.game.localPlayer ? (frac > 0.5 ? '#7ee06a' : frac > 0.25 ? '#e0c14a' : '#e05540')
        : e.owner === this.game.NEUTRAL ? '#c9bd92' : this.game.seatCss(e.owner);
      ctx.fillRect(sx - w / 2, sy, w * frac, h);
      if (constructing) {
        ctx.fillStyle = 'rgba(120,180,255,0.9)';
        ctx.fillRect(sx - w / 2, sy + h + 1, w * Math.min(1, e.progress), 2);
      }
    };
    for (const u of this.game.units) draw(u, 2.2);
    for (const b of this.game.buildings) draw(b, b.size * 1.6 + 2);
  }

  // ---------- first-contact dialogue (queued so several play in sequence) ----------
  showDialogue(portrait, name, line) {
    (this._dlgQueue ||= []).push({ portrait, name, line });
    if (!this._dlgActive) this._nextDialogue();
  }
  _nextDialogue() {
    const dlg = document.getElementById('dialogue');
    const d = (this._dlgQueue || []).shift();
    if (!dlg || !d) { this._dlgActive = false; dlg?.classList.remove('show'); return; }
    this._dlgActive = true;
    document.getElementById('dlg-portrait').src = d.portrait;
    document.getElementById('dlg-name').textContent = T(d.name);
    document.getElementById('dlg-line').textContent = T(d.line);
    dlg.classList.add('show');
    Sound.alert();
    clearTimeout(this._dlgT);
    this._dlgT = setTimeout(() => this._nextDialogue(), 8000);
  }
  hideDialogue() {
    clearTimeout(this._dlgT);
    if (this._dlgQueue && this._dlgQueue.length) return this._nextDialogue();
    this._dlgActive = false;
    document.getElementById('dialogue')?.classList.remove('show');
  }

  // ---------- toasts / game over ----------
  toast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = T(msg);
    // battle alerts are tappable: touch has no Space key, so the toast itself jumps
    // the camera to the trouble
    if (/[⚠☠🌊]/.test(msg)) {
      el.classList.add('toast-alert');
      el.onclick = () => { if (this.controls?.jumpToAlert()) Sound.click(); };
    }
    this.elToasts.appendChild(el);
    setTimeout(() => el.classList.add('fade'), 2600);
    setTimeout(() => el.remove(), 3300);
  }

  showGameOver(winner) {
    this.hideIntroCard();
    // let the end-game camera breathe before the verdict screen lands
    setTimeout(() => {
      const div = document.getElementById('gameover');
      div.style.display = 'flex';
      const g = this.game, survival = g.mode === 'survival', campaign = g.mode === 'campaign';
      div.querySelector('h1').textContent = campaign ? (winner === 0 ? T('MISSION WON') : T('MISSION LOST'))
        : survival ? T('THE DELUGE') : winner === 0 ? T('VICTORY') : T('DEFEAT');
      div.querySelector('h1').style.color = campaign ? (winner === 0 ? '#cbb8e6' : '#e05540')
        : survival ? '#5aa0ff' : winner === 0 ? '#ffd56e' : '#e05540';
      div.querySelector('p').textContent = campaign
        ? (winner === 0 ? L(`Act ${this.campaign?.mission.act} complete — ${this.campaign?.mission.name}.`, `제${this.campaign?.mission.act}막 완료 - ${this.campaign?.mission.name}.`) : L(`${this.campaign?.mission.name} — the Fields are not yet yours. Try again.`, `${this.campaign?.mission.name} - 들녘은 아직 당신의 것이 아닙니다. 다시 시도하세요.`))
        : survival
        ? L(`The waters closed over your hall at wave ${g.wave}.${g.isDaily ? ' The Daily Trial is written.' : ' Stand longer next time.'}`, `웨이브 ${g.wave}에서 물이 전당을 덮었습니다.${g.isDaily ? ' 오늘의 시련이 기록되었습니다.' : ' 다음에는 더 오래 버텨보세요.'}`)
        : winner === 0
          ? L(`The enemy's seat of power lies in ruin. The age endures — for now.${g.isDaily ? ' The Daily Trial is won.' : ''}`, `적의 권력의 자리가 폐허가 되었습니다. 시대는 계속됩니다 - 지금은.${g.isDaily ? ' 오늘의 시련을 달성했습니다.' : ''}`)
          : T('Your hall has fallen. The waters will remember your name.');
      // post-match chronicle
      const s = g.stats, t = Math.floor(g.time);
      const dur = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
      let chron = div.querySelector('.go-stats');
      if (!chron) { chron = document.createElement('div'); chron.className = 'go-stats'; div.querySelector('p').after(chron); }
      chron.innerHTML =
        (survival ? `<span>🌊 ${L('waves', '웨이브')} <b>${g.wave}</b></span>` : '') +
        `<span>⏱ <b>${dur}</b></span><span>⚔ ${L('slain', '처치')} <b>${s.killed}</b></span>` +
        `<span>☩ ${L('razed', '파괴')} <b>${s.razed}</b></span><span>🕯 ${L('lost', '손실')} <b>${s.lost}</b></span>` +
        `<span>⛏ ${L('raised', '훈련')} <b>${s.trained}</b></span>`;
      document.getElementById('btn-restart').onclick = () => this.onRestart();
      // campaign: a Next Mission (on a win) or Retry (on a loss) button
      const nextBtn = document.getElementById('btn-campaign-next');
      if (nextBtn) {
        if (campaign) {
          nextBtn.style.display = 'inline-block';
          if (winner === 0) {
            nextBtn.textContent = this.campaign?.hasNext ? T('Next Mission ▸') : T('The Chronicle Complete ✦');
            nextBtn.onclick = () => this.onCampaignNext?.();
          } else {
            nextBtn.textContent = T('↻ Retry Mission');
            nextBtn.onclick = () => this.onCampaignRetry?.();
          }
        } else nextBtn.style.display = 'none';
      }
      // offer the deterministic replay of the match just played
      const dl = document.getElementById('btn-dlreplay');
      if (dl) {
        const has = !!this.game.rec;
        dl.style.display = has ? 'inline-block' : 'none';
        if (has) dl.onclick = () => this.onDownloadReplay?.();
      }
      // Daily Trial: a compact, spoiler-free result to share (copy / share sheet)
      const sh = document.getElementById('btn-share');
      if (sh) {
        if (g.isDaily) {
          sh.style.display = 'inline-block';
          sh.textContent = T('☀ Share Result');
          sh.onclick = () => this.shareDailyResult(winner, sh);
        } else sh.style.display = 'none';
      }
    }, 2200);
  }

  // A compact, shareable summary of a finished Daily Trial — same shape for everyone
  // who played that day's fixed challenge, so results are directly comparable. No seed
  // or map spoilers; just the outcome and the chronicle. Pure function of the game state.
  dailyShareText(winner) {
    const g = this.game, survival = g.mode === 'survival', s = g.stats;
    const t = Math.floor(g.time), dur = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
    const outcome = survival
      ? L(`🌊 Held to wave ${g.wave} · ⏱ ${dur}`, `🌊 웨이브 ${g.wave}까지 생존 · ⏱ ${dur}`)
      : (winner === 0 ? L(`🏆 Victory · ⏱ ${dur}`, `🏆 승리 · ⏱ ${dur}`) : L(`💀 Fell · ⏱ ${dur}`, `💀 패배 · ⏱ ${dur}`));
    const faction = g.me?.faction?.name || '';
    return [
      L(`Shadow of the Watchers ☀ Daily ${g.isDaily}`, `Shadow of the Watchers ☀ 오늘의 시련 ${g.isDaily}`),
      `${faction} · ${T(survival ? 'The Deluge' : 'Conquest')} · ${T('Hard')}`,
      outcome,
      `⚔ ${s.killed}  ☩ ${s.razed}  🕯 ${s.lost}  ⛏ ${s.trained}`,
    ].join('\n');
  }

  // Copy the share text (and offer the OS share sheet where available). Falls back to a
  // legacy execCommand copy if the async clipboard API is blocked.
  async shareDailyResult(winner, btn) {
    const text = this.dailyShareText(winner);
    let ok = false;
    try {
      if (navigator.share) { await navigator.share({ text }); ok = true; }
      else if (navigator.clipboard) { await navigator.clipboard.writeText(text); ok = true; }
    } catch { ok = false; }
    if (!ok) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        ok = document.execCommand('copy'); document.body.removeChild(ta);
      } catch { ok = false; }
    }
    if (btn) { btn.textContent = ok ? T('✓ Copied!') : T('⚠ Copy failed'); setTimeout(() => { btn.textContent = T('☀ Share Result'); }, 2200); }
    if (ok) this.toast('☀ Daily result copied — share your fate.');
    return text;
  }

  // opening faction card over the flyover
  showIntroCard(faction) {
    const taglines = {
      covenant: 'Bronze and grain and the favor of heaven hold the walls of the faithful.',
      watchers: 'They taught us the names of the stars, and the price was our souls.',
      nephilim: 'The giants do not build walls. They break them.',
    };
    const el = document.getElementById('introcard');
    document.getElementById('ic-name').textContent = faction.name;
    document.getElementById('ic-name').style.color = faction.colorCss;
    document.getElementById('ic-sub').textContent = T(taglines[faction.key] || faction.desc);
    el.style.display = 'flex';
    requestAnimationFrame(() => el.classList.add('show'));
  }
  hideIntroCard() {
    const el = document.getElementById('introcard');
    if (!el || el.style.display === 'none') return;
    el.classList.remove('show');
    setTimeout(() => { el.style.display = 'none'; }, 1100);
  }

  // 언어 전환 시 즉시 HUD를 다시 그린다.
  onLangChanged() { this.refreshPanel(); this.drawResources(); }

  // ---------- per-frame ----------
  update(dt) {
    this.refreshT -= dt;
    if (this.refreshT <= 0) {
      this.refreshT = 0.25;
      this.drawResources();
      this.drawMinimap();
      this.refreshGroupBar();
      // campaign objective banner tracks the mission's live objective text
      const objP = document.getElementById('objective-panel');
      if (objP) {
        if (this.game.mode === 'campaign' && !this.game.over && this.game.objective) {
          objP.style.display = 'block';
          document.getElementById('objective-text').textContent = T(this.game.objective);
        } else objP.style.display = 'none';
      }
      // live-refresh queue/progress text when a building is selected,
      // and cooldown countdown when a unit with an ability is selected
      const s = this.game.selection;
      if (s.length === 1 && (s[0].isBuilding || (s[0].isUnit && s[0].def.ability))) this.refreshPanel();
    }
    // health-bar overlay is the heaviest per-frame 2D work; cap it to ~33 Hz so it
    // costs the same on a 60/120/144 Hz display (it tracks slow-moving units fine).
    this.hbT = (this.hbT || 0) - dt;
    if (this.hbT <= 0) { this.hbT = 1 / 33; this.drawHealthBars(); }
  }
}
