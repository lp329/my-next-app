// my-next-app/app/layout.tsx

import './globals.css'; // グローバルCSSのインポート

// アプリのメタデータ（ブラウザのタブタイトルや説明など）を設定します
export const metadata = {
  title: 'QRチャットアプリ', // ★ブラウザのタブに表示されるタイトル
  description: 'QRコードで一時的なチャットルームを作成するアプリ', // ページの簡単な説明
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ★ここが重要: <html>タグと<body>タグの間、
    // およびその前後に余分な空白（改行、スペース）が入らないように注意してください。
    // 最も確実なのは、開始タグの直後に子要素を置くこと、または同じ行に書くことです。
    <html lang="ja"><body>{children}</body></html>
  );
}