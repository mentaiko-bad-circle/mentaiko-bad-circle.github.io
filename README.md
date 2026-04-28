# 🏸 めんたいこ — バドミントンサークル サイト

京都・滋賀で活動するバドミントンサークル「めんたいこ」の公式サイトです。

**サイト URL:** https://mentaiko-bad-circle.netlify.app

---

## ファイル構成

```
├── index.html        # メインページ
├── data/schedule.js  # 開催日程（ここを編集する）
├── css/style.css     # デザイン
├── js/main.js        # 動作
├── deploy.sh         # デプロイスクリプト（ターミナル用）
└── deploy.bat        # デプロイスクリプト（ダブルクリック用）
```

---

## 日程を更新する

`data/schedule.js` を開いて、日程を追加・編集します。

```js
const SCHEDULE = [
  { date: "2026-06-07", time: "14:00〜16:00", area: "京都", venue: "中京地域体育館" },
  { date: "2026-06-14", time: "13:00〜15:00", area: "滋賀", venue: "におの浜スポーツふれあいセンター" },
];
```

- `date` : `"YYYY-MM-DD"` の形式
- `area` : `"京都"` または `"滋賀"`
- 過去の日付は参加フォームから自動で非表示になります

---

## サイトに反映する

編集後、以下のいずれかでデプロイ（GitHubにpush → Netlifyが自動反映）。

### ターミナルから
```bash
bash deploy.sh
# メッセージを付ける場合
bash deploy.sh "5月の日程を追加"
```

### ダブルクリックで実行
`deploy.bat` をダブルクリック → メッセージを入力（省略可）→ Enter

### VS Code から
`Ctrl+Shift+P` → `Tasks: Run Task` → `Deploy`

---

## スマホから編集する

1. [GitHubリポジトリ](https://github.com/mentaiko-bad-circle/mentaiko-bad-circle.github.io) をブラウザで開く
2. `data/schedule.js` をタップ → 鉛筆アイコンで編集
3. 「Commit changes」でコミット → 1〜2分でサイトに自動反映
