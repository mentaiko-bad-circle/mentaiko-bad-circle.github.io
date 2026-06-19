// ── 日付ユーティリティ ────────────────────────────────────────────────────
const DAYS_JA = ['日', '月', '火', '水', '木', '金', '土'];

function parseDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatJapaneseDate(dateStr, holiday) {
  const d = parseDate(dateStr);
  const month = d.getMonth() + 1;
  const day   = d.getDate();
  const dow   = DAYS_JA[d.getDay()];
  const inner = holiday ? `${dow}・祝` : dow;
  return `${month}月${day}日（${inner}）`;
}

function isFutureOrToday(dateStr) {
  const d     = parseDate(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

// ── スケジュール表示 ──────────────────────────────────────────────────────
function renderSchedule(filterArea) {
  const list  = document.getElementById('schedule-list');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sorted = [...SCHEDULE].sort((a, b) => a.date.localeCompare(b.date));
  const items  = filterArea === 'all'
    ? sorted
    : sorted.filter(s => s.area === filterArea);

  if (items.length === 0) {
    list.innerHTML = '<p style="color:var(--sub);font-size:0.9rem;padding:16px 0;">日程はまだありません。</p>';
    return;
  }

  list.innerHTML = items.map(s => {
    const label  = formatJapaneseDate(s.date, s.holiday);
    const isPast = parseDate(s.date) < today;
    const isFull = s.full === true;
    const areaClass = s.area === '京都' ? 'kyoto' : 'shiga';
    return `
      <div class="schedule-item${isPast ? ' past' : ''} area-${areaClass}">
        <div class="schedule-left">
          <span class="area-badge ${areaClass}">${s.area}</span>
          ${isFull ? '<span class="full-badge">満員</span>' : ''}
          <span class="schedule-day">${label}</span>
        </div>
        <div class="schedule-right">
          <span class="schedule-time">${s.time}</span>
          ${(typeof VENUE_MAPS !== 'undefined' && VENUE_MAPS[s.venue])
              ? `<a class="schedule-venue venue-link" href="${VENUE_MAPS[s.venue]}" target="_blank" rel="noopener">${s.venue} 📍</a>`
              : `<span class="schedule-venue">${s.venue}</span>`}
        </div>
      </div>`;
  }).join('');
}

// ── フォーム用チェックボックス（過去日は除外）─────────────────────────────
function renderContactDates() {
  const container = document.getElementById('date-checkboxes');
  const noMsg     = document.getElementById('no-dates-msg');

  const future = [...SCHEDULE]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter(s => isFutureOrToday(s.date));

  if (future.length === 0 || !RECRUITMENT_OPEN) {
    container.style.display = 'none';
    noMsg.style.display = 'block';
    return;
  }

  noMsg.style.display = 'none';
  container.innerHTML = future.map(s => {
    const label  = formatJapaneseDate(s.date, s.holiday);
    const isFull = s.full === true;
    const value  = isFull
      ? `${label} ${s.time}（${s.area}エリア・${s.venue}）※キャンセル待ち`
      : `${label} ${s.time}（${s.area}エリア・${s.venue}）`;
    return `
      <label class="date-checkbox-item${isFull ? ' is-waitlist' : ''}">
        <input type="checkbox" name="date-select" value="${value}" />
        <div class="checkbox-content">
          <span class="checkbox-label">${label}&nbsp; ${s.time}</span>
          <span class="checkbox-sub">${s.area}エリア &middot; ${s.venue}${isFull ? ' <span class="waitlist-badge">満員：キャンセル待ち可</span>' : ''}</span>
        </div>
      </label>`;
  }).join('');
}

// ── タブ切替 ──────────────────────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('#schedule-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#schedule-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSchedule(btn.dataset.area);
    });
  });
}

// ── 同行者フィールド動的生成 ──────────────────────────────────────────────
function initCompanions() {
  document.getElementById('companions').addEventListener('change', function () {
    const count     = parseInt(this.value);
    const container = document.getElementById('companion-names');
    container.innerHTML = '';
    for (let i = 1; i <= count; i++) {
      const card = document.createElement('div');
      card.className = 'companion-card';
      card.innerHTML = `
        <div class="companion-card-header">同行者 ${i}</div>
        <div class="form-group">
          <label for="companion-name-${i}">お名前</label>
          <input type="text" id="companion-name-${i}" placeholder="山田 花子" required />
        </div>
        <div class="companion-row">
          <div class="form-group">
            <label for="companion-gender-${i}">性別</label>
            <select id="companion-gender-${i}">
              <option value="男性">男性</option>
              <option value="女性">女性</option>
              <option value="その他・回答しない">その他・回答しない</option>
            </select>
          </div>
          <div class="form-group">
            <label for="companion-level-${i}">経験</label>
            <select id="companion-level-${i}">
              <option>初心者（ほぼ未経験）</option>
              <option>ブランクあり</option>
              <option>経験者</option>
            </select>
          </div>
        </div>`;
      container.appendChild(card);
    }
  });
}

// ── フォーム送信（mailto）────────────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();

  const name    = document.getElementById('name').value;
  const gender  = document.getElementById('gender').value;
  const level   = document.getElementById('level').value;
  const msg     = document.getElementById('message').value;
  const checked = [...document.querySelectorAll('input[name="date-select"]:checked')]
    .map(c => '  ・' + c.value);

  const dateLines = checked.length > 0 ? checked.join('\n') : '  （未選択）';

  const companionCount = parseInt(document.getElementById('companions').value);
  let companionLines = '同行者: ';
  if (companionCount === 0) {
    companionLines += 'なし';
  } else {
    companionLines += companionCount + '名';
    for (let i = 1; i <= companionCount; i++) {
      const cName   = document.getElementById('companion-name-' + i).value.trim();
      const cGender = document.getElementById('companion-gender-' + i).value;
      const cLevel  = document.getElementById('companion-level-' + i).value;
      companionLines += '\n  ・同行者' + i + ': ' + cName + '（' + cGender + '・' + cLevel + '）';
    }
  }

  const body = [
    'お名前: ' + name,
    '性別: '   + gender,
    '経験: '   + level,
    companionLines,
    '',
    '希望日程:',
    dateLines,
    '',
    'メッセージ:',
    msg,
  ].join('\n');

  window.location.href =
    'mailto:mentaiko.circle@gmail.com'
    + '?subject=' + encodeURIComponent('【めんたいこ】参加希望：' + name)
    + '&body='    + encodeURIComponent(body);

  document.getElementById('form-sent').style.display = 'block';
}

// ── フェードイン（IntersectionObserver）──────────────────────────────────
function initFadeIn() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade').forEach((el, i) => {
    el.style.transitionDelay = (i % 5) * 70 + 'ms';
    observer.observe(el);
  });

  document.querySelectorAll('#hero .fade').forEach(el => el.classList.add('visible'));
}

// ── 構造化データ(JSON-LD) ──────────────────────────────────────────────────
function injectEventJsonLd() {
  const future = [...SCHEDULE]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter(s => isFutureOrToday(s.date))
    .slice(0, 10);

  if (future.length === 0) return;

  const events = future.map(s => {
    const startTime = s.time.split('〜')[0];
    return {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      "name": `めんたいこ バドミントン練習会（${s.area}）`,
      "startDate": `${s.date}T${startTime}:00+09:00`,
      "location": {
        "@type": "Place",
        "name": s.venue,
        "address": s.area === '京都' ? '京都府' : '滋賀県'
      },
      "organizer": {
        "@type": "SportsOrganization",
        "name": "めんたいこ",
        "url": "https://mentaiko-bad-circle.netlify.app/"
      },
      "eventStatus": s.full ? "https://schema.org/EventScheduled" : "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
    };
  });

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(events.length === 1 ? events[0] : events);
  document.head.appendChild(script);
}

// ── 初期化 ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderSchedule('all');
  renderContactDates();
  initTabs();
  initFadeIn();
  initCompanions();
  injectEventJsonLd();
  document.getElementById('contact-form').addEventListener('submit', handleSubmit);
});
