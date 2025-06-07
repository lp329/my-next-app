import type { Metadata } from "next";
// もし `app` フォルダに `globals.css` ファイル（共通スタイルシート）があれば、ここで読み込みます。
// なければ、この行を削除するか、空の `app/globals.css` ファイルを作成してください。
import "./globals.css";

// サイトのメタ情報（タイトルや説明文など）を定義します。
// ここは日本語で自由に設定してください。
export const metadata: Metadata = {
  title: "QR秘密メッセージアプリ", // 例: ウェブサイトのタイトル
  description: "Next.jsで作った簡単なQRメッセージアプリです。", // 例: ウェブサイトの説明
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // lang="ja" で、このページの主要言語が日本語であることを示します。
    <html lang="ja">
      <body>
        {/* 他のページコンポーネントがこの {children} の部分に表示されます */}
        {children}
      </body>
    </html>
  );
}