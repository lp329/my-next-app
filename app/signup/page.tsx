'use client'; // ★この行がファイルの先頭の1行目にあることを確認してください

import { useState } from 'react'; 

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (username.trim() === '' || password.trim() === '') {
      alert('ユーザー名とパスワードを全て入力してください。');
      return;
    }

    console.log('--- ユーザー登録情報 ---');
    console.log('ユーザー名:', username);
    console.log('パスワード:', password); 
    console.log('--------------------');

    alert('登録情報をコンソールに出力しました！');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
        maxWidth: '400px', 
        width: '100%', 
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#333', marginBottom: '30px' }}>ユーザー登録</h1>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="username" style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: 'bold' }}>ユーザー名:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名を入力"
            style={{ 
              width: 'calc(100% - 22px)', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              fontSize: '1em' 
            }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label htmlFor="password" style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: 'bold' }}>パスワード:</label>
          <input
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力"
            style={{ 
              width: 'calc(100% - 22px)', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              fontSize: '1em' 
            }}
          />
        </div>

        <button
          onClick={handleSignUp}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#007BFF', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '1.1em', 
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007BFF'}
        >
          登録
        </button>
      </div>
    </div>
  );
}
