# my new gear...

my new gear... は、ミュージシャンが愛用する機材を共有するための Firebase 連携型 SNS です。React・TypeScript・Redux Toolkit・Tailwind CSS・Material-UI を用いて構築され、写真付き投稿やコメント、いいねをリアルタイムに扱えます。

## 主な機能
- Firebase Authentication によるメール / Google / Twitter 認証。
- Tailwind CSS と Material-UI を組み合わせたレスポンシブ UI。
- 画像をクライアント側で圧縮し、Firebase Storage にアップロードして投稿を作成。
- 全投稿、カテゴリ別 (#mynewgear / #guitar / #bass)、ユーザー単位のページを Firestore のリアルタイム購読で表示。
- 投稿ごとのコメント・いいね、ユーザーごとのいいね履歴を Firestore に保存。
- Twitter 共有やスクロール位置リセット、モーダルベースの操作性。

## 技術スタック
- React 17 + TypeScript
- Redux Toolkit (状態管理)
- React Router v6
- Tailwind CSS JIT + SCSS モジュール
- Material-UI v4 コンポーネント
- Firebase（Authentication / Firestore / Storage / Hosting）

## 前提条件
- Node.js 14 または 16（React Scripts 4 の推奨互換バージョン）
- Authentication・Firestore・Storage を有効化した Firebase プロジェクト
- デプロイ用に Firebase CLI (`npm install -g firebase-tools`)

## セットアップ
1. 依存関係をインストールします。
   ```bash
   npm install
   ```
2. プロジェクト直下に `.env.local` を作成し、Firebase 設定を記入します。
   ```
   REACT_APP_FIREBASE_APIKEY=...
   REACT_APP_FIREBASE_DOMAIN=...
   REACT_APP_FIREBASE_DATABASE=...
   REACT_APP_FIREBASE_PROJECT_ID=...
   REACT_APP_FIREBASE_STORAGE_BUCKET=...
   REACT_APP_FIREBASE_SENDER_ID=...
   REACT_APP_FIREBASE_APP_ID=...
   ```
3. 開発サーバーを起動します。
   ```bash
   npm start
   ```

`http://localhost:3000` でアプリが起動します。

## Firebase 設定のポイント
- Authentication でメール / Google / Twitter 認証を有効化します。
- Cloud Firestore に以下のコレクションを作成します。
  - `posts`: 投稿を保存（`avatar`, `image`, `category`, `text`, `brandName`, `gearName`, `timestamp`, `username`, `userID`, `likeCount`, `likedUser`）。
  - `posts/{postId}/comments`: 各投稿のコメントを保存。
  - `users/{uid}/likePosts`: ユーザーがいいねした投稿 ID を保存。
- Firebase Hosting の公開先を `build` に設定します（`firebase.json` 参照）。

## 利用可能なスクリプト
- `npm start` - CRACO + Tailwind JIT で開発サーバーを起動。
- `npm run build` - 本番向けに最適化されたバンドルを生成。
- `npm test` - CRA 標準のテストランナーを実行。
- `npm run eject` - 設定をプロジェクトに展開（不可逆）。

## ディレクトリ構成
```
mynewgear/
|-- public/          # CRA の公開アセット（index.html, アイコン, OGP など）
|-- src/
|   |-- app/         # Redux ストアとカスタムフック
|   |-- components/  # 再利用コンポーネント（Auth, Post, PostInput など）
|   |-- features/    # Redux スライス
|   |-- pages/       # ルート単位のページ（MainPage, MyPage, Terms, Privacy）
|   |-- scss/        # SCSS モジュール
|   |-- firebase.ts  # Firebase 初期化処理
|   `-- brandName.json  # ブランド名リスト
`-- craco.config.js  # CRACO + Tailwind 設定
```

## デプロイ手順
1. ビルドを作成：`npm run build`
2. Firebase Hosting にデプロイ：`firebase deploy --only hosting`

デプロイ前に Firebase CLI でログインしておいてください (`firebase login`)。

## テスト
CRA テンプレートのテスト環境が含まれています。`src/` 配下にテストを追加し、`npm test` で実行できます。

## 今後の改善アイデア
- Firestore / Storage のセキュリティルール強化。
- フィードへのページネーションや無限スクロール導入。
- README の多言語対応や UI テキストのローカライズ対応。
