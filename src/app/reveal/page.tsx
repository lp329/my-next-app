'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function MessageContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  // ★デバッグ用: RevealページでURLから取得したメッセージをコンソールに出力
  console.log("Revealページで受け取ったmessage:", message);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center', maxWidth: '600px', margin: 'auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1>受信した秘密のメッセージ</h1>
      </header>

      <main>
        {message ? ( // message が null や空文字列でない場合に表示
          <div style={{ fontSize: '1.5em', margin: '20px auto', padding: '30px', border: '2px dashed #0070f3', borderRadius: '8px', display: 'inline-block', backgroundColor: '#e6f7ff', wordBreak: 'break-word' }}>
            <p>{message}</p>
          </div>
        ) : (
          <p style={{ color: 'red', fontSize: '1.2em' }}>
            メッセージが表示できませんでした。<br />
            (URLにメッセージが含まれていないか、空の可能性があります)
          </p>
        )}
      </main>

      <footer style={{ marginTop: '40px' }}>
        <Link href="/" style={{ padding: '10px 20px', fontSize: '1em', backgroundColor: '#555', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          新しいメッセージを作成する
        </Link>
      </footer>
    </div>
  );
}

export default function RevealPage() {
  // Suspense は useSearchParams を Client Component で使用する際に推奨されます
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>メッセージを読み込み中...</div>}>
      <MessageContent />
    </Suspense>
  );
}