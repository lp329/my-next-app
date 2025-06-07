// app/layout.tsx
import './globals.css'; // グローバルCSSのインポート

// --- ここを編集または追加 ---
export const metadata = {
  title: 'QRチャットアプリ', // ブラウザのタブに表示されるタイトル
  description: 'QRコードで一時的なチャットルームを作成するアプリ', // ページの簡単な説明
};
// --- ここまで ---

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja"> {/* 言語設定を日本語に */}
      <body>{children}</body>
    </html>
  );
}
