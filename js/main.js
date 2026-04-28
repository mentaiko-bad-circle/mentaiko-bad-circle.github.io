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
    const areaClass = s.area === '京都' ? 'kyoto' : 'shiga';
    return `
      <div class="schedule-item${isPast ? ' past' : ''}">
        <div class="schedule-left">
          <span class="area-badge ${areaClass}">${s.area}</span>
          <span class="schedule-day">${label}</span>
        </div>
        <div class="schedule-right">
          <span class="schedule-time">${s.time}</span>
          <span class="schedule-venue">${s.venue}</span>
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

  if (future.length === 0) {
    container.style.display = 'none';
    noMsg.style.display = 'block';
    return;
  }

  noMsg.style.display = 'none';
  container.innerHTML = future.map(s => {
    const label = formatJapaneseDate(s.date, s.holiday);
    const value = `${label} ${s.time}（${s.area}エリア・${s.venue}）`;
    return `
      <label class="date-checkbox-item">
        <input type="checkbox" name="date-select" value="${value}" />
        <div class="checkbox-content">
          <span class="checkbox-label">${label}&nbsp; ${s.time}</span>
          <span class="checkbox-sub">${s.area}エリア &middot; ${s.venue}</span>
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

// ── フォーム送信（mailto）────────────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();

  const name    = document.getElementById('name').value;
  const level   = document.getElementById('level').value;
  const msg     = document.getElementById('message').value;
  const checked = [...document.querySelectorAll('input[name="date-select"]:checked')]
    .map(c => '  ・' + c.value);

  const dateLines = checked.length > 0 ? checked.join('\n') : '  （未選択）';

  const body = [
    'お名前: ' + name,
    '経験: '  + level,
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

// ── 初期化 ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderSchedule('all');
  renderContactDates();
  initTabs();
  initFadeIn();
  document.getElementById('contact-form').addEventListener('submit', handleSubmit);
});
