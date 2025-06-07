'use client'; // ★この行がファイルの先頭の1行目にあることを確認してください

import { useState, useEffect } from 'react'; 
import { QRCodeSVG } from 'qrcode.react';     

const CLASS_CHAT_ROOM_ID = 'programming-class-room'; 

export default function HomePage() {
  const [chatRoomId, setChatRoomId] = useState(''); 
  const [qrUrl, setQrUrl] = useState('');           
  const [appBaseUrl, setAppBaseUrl] = useState(''); 
  const [showInstructions, setShowInstructions] = useState(false); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      setAppBaseUrl(currentOrigin);

      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setShowInstructions(true);
      } else {
        setShowInstructions(false);
      }
    }
  }, []); 

  const handleGenerate = () => {
    setChatRoomId(CLASS_CHAT_ROOM_ID); 

    if (appBaseUrl) {
      const url = `${appBaseUrl}/chat/${CLASS_CHAT_ROOM_ID}`;
      
      console.log("生成されたQRコードのURL:", url); 
      setQrUrl(url); 
    } else {
      alert('アプリの基本URLが取得できませんでした。ページを再読み込みしてみてください。');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <h1 style={{ color: '#333', fontSize: '1.8em' }}>プログラミング授業用チャットルームQRコード</h1>
        <p style={{ color: '#666', fontSize: '0.9em' }}>このQRコードをスキャンしてチャットに参加してください。</p>
      </header>

      {showInstructions && (
        <div style={{ backgroundColor: '#fffbe6', border: '1px solid #ffe58f', padding: '10px 15px', marginBottom: '20px', borderRadius: '4px', fontSize: '0.9em', color: '#856404' }}>
          <p><strong>注意:</strong> 現在 `localhost` でアクセスしています。</p>
          <p>
            他のデバイスでQRコードをスキャンしてテストするには、まずお使いのPCの**ローカルネットワークIPアドレス**（例: `http://192.168.X.X:3000` など、`next dev` 起動時にターミナルに表示される「Network」のアドレス）でこのページを開き直してから、QRコードを生成してください。
          </p>
        </div>
      )}

      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4em', marginBottom: '15px', textAlign: 'center', color: '#333' }}>QRコードを生成</h2>
      </section>

      <section style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          onClick={handleGenerate}
          style={{ padding: '12px 25px', fontSize: '1.1em', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005bb5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0070f3'}
        >
          QRコードを生成
        </button>
      </section>

      {qrUrl && (
        <section style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#f9f9f9', marginTop: '20px' }}>
          <h2>このQRコードをスキャンしてください:</h2>
          <div style={{ margin: '20px 0' }}>
            <QRCodeSVG value={qrUrl} size={200} level="H" /> 
          </div>
          <p style={{ fontSize: '0.9em', wordBreak: 'break-all', color: '#555' }}>
            または、このリンクを共有: <br />
            <a href={qrUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>
              {qrUrl} 
            </a>
          </p>
          <p style={{ fontWeight: 'bold', color: '#4CAF50' }}>
            チャットルームID: <span style={{ color: '#FF5722' }}>{CLASS_CHAT_ROOM_ID}</span>
          </p>
        </section>
      )}
    </div>
  );
}
