'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
// Linkコンポーネントは現在このファイルで直接は使用していませんが、
// 将来的に他のページへのナビゲーションを追加する際などに役立つため、
// コメントアウトまたは削除しても、残しておいても構いません。
// import Link from 'next/link';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [appBaseUrl, setAppBaseUrl] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ window.location.origin を取得
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      setAppBaseUrl(currentOrigin);

      // localhost でアクセスしている場合に注意メッセージを表示する
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setShowInstructions(true);
      } else {
        setShowInstructions(false);
      }
    }
  }, []);

  const handleGenerate = () => {
    if (message.trim() && appBaseUrl) {
      const url = `${appBaseUrl}/reveal?message=${encodeURIComponent(message)}`;
      // ★デバッグ用: 生成されるURLをコンソールに出力
      console.log("生成されたQRコードのURL:", url);
      setQrUrl(url);
    } else {
      setQrUrl('');
      if (!message.trim()) {
        alert('メッセージを入力してください。');
      }
      if (!appBaseUrl) {
        // このアラートは通常発生しないはずですが、念のため
        alert('ベースURLが取得できませんでした。ページを再読み込みしてみてください。');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>秘密のメッセージをQRに！</h1>
      </header>

      {showInstructions && (
        <div style={{ backgroundColor: '#fffbe6', border: '1px solid #ffe58f', padding: '10px 15px', marginBottom: '20px', borderRadius: '4px', fontSize: '0.9em' }}>
          <p><strong>注意:</strong> 現在 `localhost` でアクセスしています。</p>
          <p>
            このままQRコードを生成すると、他のデバイスからはアクセスできません。
            他のデバイスでQRコードをスキャンしてテストするには、まずお使いのPCのローカルネットワークIPアドレス（例: `http://192.168.X.X:3000` など、`next dev` 起動時にターミナルに表示される「Network」のアドレス）でこのページを開き直してから、QRコードを生成してください。
          </p>
        </div>
      )}

      <main>
        <section style={{ marginBottom: '20px' }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="ここに秘密のメッセージを入力..."
            rows={5}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1em' }}
          />
        </section>

        <section style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            onClick={handleGenerate}
            style={{ padding: '12px 25px', fontSize: '1.1em', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            QRコードを生成
          </button>
        </section>

        {qrUrl && (
          <section style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
            <h2>スキャンしてください:</h2>
            <div style={{ margin: '20px 0' }}>
              <QRCodeSVG value={qrUrl} size={200} level="H" /> {/* level="H" で誤り訂正能力を最大に */}
            </div>
            <p style={{ fontSize: '0.9em', wordBreak: 'break-all', color: '#555' }}>
              または、このリンクを共有: <br />
              <a href={qrUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>
                {qrUrl}
              </a>
            </p>
          </section>
        )}
      </main>

      <footer style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.9em', color: '#777' }}>
        <p>Next.jsで15分チャレンジアプリ</p>
      </footer>
    </div>
  );
}