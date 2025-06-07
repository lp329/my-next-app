　// my-next-app/app/page.tsx

'use client'; // ★重要: このファイルがクライアントサイド（ブラウザ側）で動くことを示します

import { useState, useEffect } from 'react'; // Reactの基本的な機能を使います
import { QRCodeSVG } from 'qrcode.react';     // QRコードを生成するための道具
import { v4 as uuidv4 } from 'uuid';         // ユニークなIDを生成するための道具（UUID）

// --- メインのQRコード生成ページコンポーネント ---
export default function HomePage() {
  // --- 画面の状態を管理する変数たち ---
  const [chatRoomId, setChatRoomId] = useState(''); // 生成されたチャットルームのIDを保存
  const [qrUrl, setQrUrl] = useState('');           // 生成されたQRコードのURLを保存
  const [appBaseUrl, setAppBaseUrl] = useState(''); // このアプリの基本URL（例: http://localhost:3000）
  const [showInstructions, setShowInstructions] = useState(false); // localhostでアクセスしている場合の注意表示用
  const [initialUsername, setInitialUsername] = useState(''); // チャットルームに参加する初期ユーザー名

  // --- アプリの基本URL（appBaseUrl）を取得する処理 ---
  useEffect(() => {
    // ブラウザで実行されている場合にのみ、window.location.origin を取得します
    // （Next.jsはサーバー側でも動くため、windowオブジェクトがあるか確認が必要です）
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      setAppBaseUrl(currentOrigin);

      // もし 'localhost' でアクセスしている場合は、他のデバイスからのアクセスができないことを注意表示します
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setShowInstructions(true);
      } else {
        setShowInstructions(false);
      }
    }
  }, []); // []は、この処理を一度だけ（コンポーネントが最初に表示されたとき）実行するという意味です

  // --- QRコードを生成する関数 ---
  const handleGenerate = () => {
    const newRoomId = uuidv4(); // 新しいチャットルーム用のユニークなIDを生成します
    setChatRoomId(newRoomId); // 生成したIDを保存します

    // アプリの基本URLが取得できていれば
    if (appBaseUrl) {
      // チャットページへの完全なURLを生成します
      // /chat/ユニークなID の形式になります
      // optional: 初期ユーザー名をURLのクエリパラメータとして含めることもできます
      const url = `${appBaseUrl}/chat/${newRoomId}?username=${encodeURIComponent(initialUsername || 'Guest')}`;
      
      // ★デバッグ用: 生成されたURLをコンソールに表示します
      console.log("生成されたQRコードのURL:", url); 
      setQrUrl(url); // 生成したURLをQRコード表示用に保存します
    } else {
      alert('アプリの基本URLが取得できませんでした。ページを再読み込みしてみてください。');
    }
  };

  // --- 画面に表示される内容（JSX） ---
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      {/* --- ヘッダー部分 --- */}
      <header style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <h1 style={{ color: '#333', fontSize: '1.8em' }}>QRコードでチャットルーム生成！</h1>
        <p style={{ color: '#666', fontSize: '0.9em' }}>QRコードをスキャンすると、一時的なチャットルームに入れます</p>
      </header>

      {/* --- localhost アクセス時の注意表示 --- */}
      {showInstructions && (
        <div style={{ backgroundColor: '#fffbe6', border: '1px solid #ffe58f', padding: '10px 15px', marginBottom: '20px', borderRadius: '4px', fontSize: '0.9em', color: '#856404' }}>
          <p><strong>注意:</strong> 現在 `localhost` でアクセスしています。</p>
          <p>
            このままQRコードを生成すると、他のデバイスからはアクセスできません。<br />
            他のデバイスでQRコードをスキャンしてテストするには、まずお使いのPCの**ローカルネットワークIPアドレス**（例: `http://192.168.X.X:3000` など、`next dev` 起動時にターミナルに表示される「Network」のアドレス）でこのページを開き直してから、QRコードを生成してください。
          </p>
        </div>
      )}

      {/* --- メインコンテンツ部分 --- */}
      <main>
        {/* 初期ユーザー名入力欄 */}
        <section style={{ marginBottom: '20px' }}>
          <label htmlFor="username-input" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>あなたのユーザー名 (任意):</label>
          <input
            id="username-input"
            type="text"
            value={initialUsername}
            onChange={(e) => setInitialUsername(e.target.value)}
            placeholder="入力しない場合は「Guest」になります"
            style={{ width: 'calc(100% - 20px)', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1em' }}
          />
        </section>

        {/* QRコード生成ボタン */}
        <section style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            onClick={handleGenerate}
            style={{ padding: '12px 25px', fontSize: '1.1em', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005bb5'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0070f3'}
          >
            新しいチャットQRコードを生成
          </button>
        </section>

        {/* 生成されたQRコードの表示エリア */}
        {qrUrl && (
          <section style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#f9f9f9', marginTop: '20px' }}>
            <h2>スキャンしてください:</h2>
            <div style={{ margin: '20px 0' }}>
              {/* QRコード本体 */}
              <QRCodeSVG value={qrUrl} size={200} level="H" /> 
            </div>
            {/* 生成されたURLとルームIDの表示 */}
            <p style={{ fontSize: '0.9em', wordBreak: 'break-all', color: '#555' }}>
              または、このリンクを共有: <br />
              <a href={qrUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>
                {qrUrl}
              </a>
            </p>
            {chatRoomId && <p style={{ fontWeight: 'bold', color: '#4CAF50' }}>チャットルームID: {chatRoomId}</p>}
          </section>
        )}
      </main>

      {/* --- フッター部分 --- */}
      <footer style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.9em', color: '#777', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <p>Next.jsリアルタイムチャットアプリ</p>
      </footer>
    </div>
  );
}
