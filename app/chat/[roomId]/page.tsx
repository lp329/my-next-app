'use client'; // ★この行がファイルの先頭の1行目にあることを確認してください

import { useEffect, useState, useRef } from 'react'; 
import { io, Socket } from 'socket.io-client';     
import { useParams } from 'next/navigation';       

interface Message {
  user: string;      
  text: string;      
  timestamp: string; 
  imageUrl?: string; // 画像URLのプロパティ
}

// ★重要: WebSocketサーバーの場所を指定します (あなたのPCのIPアドレスに修正済みのはずです)
const WEBSOCKET_SERVER_URL = 'http://192.168.40.183:3001'; // ★ここを現在のIPアドレスに修正

export default function ChatPage() {
  const { roomId } = useParams(); 

  const [socket, setSocket] = useState<Socket | null>(null); 
  const [messages, setMessages] = useState<Message[]>([]);   
  const [inputMessage, setInputMessage] = useState('');     
  const [username, setUsername] = useState(''); 
  const [usernameSet, setUsernameSet] = useState(false); 

  const messagesEndRef = useRef<HTMLDivElement>(null); 
  const fileInputRef = useRef<HTMLInputElement>(null); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); 

  // --- WebSocket接続とイベント（メッセージの送受信など）の設定 ---
  useEffect(() => {
    if (!roomId) return; 

    const newSocket = io(WEBSOCKET_SERVER_URL);
    setSocket(newSocket); 

    newSocket.on('connect', () => {
      console.log('WebSocketサーバーに接続しました');
      if (usernameSet && username.trim() && roomId) {
        newSocket.emit('joinRoom', { roomId, username: username.trim() });
      }
    });

    newSocket.on('message', (msg: Message) => {
      console.log("メッセージを受信しました:", msg); 
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    newSocket.on('historicalMessages', (msgs: Message[]) => {
      console.log(`過去のメッセージを${msgs.length}件受信しました。`);
      setMessages((prevMessages) => [...msgs, ...prevMessages]); 
    });


    newSocket.on('disconnect', () => {
      console.log('WebSocketサーバーから切断されました');
      setUsernameSet(false); 
    });

    newSocket.on('connect_error', (err) => {
      console.error('接続エラー:', err.message);
      setUsernameSet(false); 
      alert('WebSocketサーバーへの接続に失敗しました。サーバーが起動しているか、URLが正しいか確認してください。');
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [roomId]); 

  const handleSetUsername = () => {
    if (username.trim()) {
      setUsernameSet(true); 
      if (socket) {
        socket.emit('joinRoom', { roomId, username: username.trim() });
      } else {
        alert('サーバーに接続中です。しばらくお待ちください。');
      }
    } else {
      alert('ユーザー名を入力してください。');
    }
  };

  const sendMessage = () => {
    if (socket && inputMessage.trim() && username.trim()) {
      socket.emit('sendMessage', { roomId, user: username, text: inputMessage });
      setInputMessage(''); 
    } else if (!inputMessage.trim()) {
      alert('メッセージを入力してください。');
    }
  };

  const sendImage = (file: File) => {
    if (!socket || !usernameSet || !username.trim() || !roomId) {
      alert('チャットに参加してから画像を送信してください。');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('画像ファイルのみを送信できます。');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target?.result as string; 

      socket.emit('sendImage', { roomId, user: username, imageData: base64Image, fileName: file.name });
      console.log('画像を送信しました:', file.name);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file); 
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      sendImage(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => { 
    if (e.key === 'Enter') {
      if (!usernameSet) { 
        e.preventDefault(); 
        handleSetUsername(); 
      } else {
        if (e.shiftKey) { 
          // Shift + Enter で改行 
        } else { 
          e.preventDefault(); 
          sendMessage();    
        }
      }
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',         
      maxWidth: '600px',       
      margin: '0 auto',        
      border: '1px solid #ccc',
      borderRadius: '8px', 
      overflow: 'hidden', 
      backgroundColor: '#f0f2f5' 
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        padding: '15px', 
        background: '#4CAF50', 
        color: 'white', 
        margin: 0, 
        fontSize: '1.5em', 
        borderBottom: '1px solid #388E3C' 
      }}>
        プログラミング授業チャット: {roomId} 
      </h1>

      {!usernameSet ? (
        <div style={{ padding: '20px', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ marginBottom: '20px', fontSize: '1.1em' }}>チャットに参加するために、ユーザー名を入力してください。</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="あなたのユーザー名"
            style={{ width: '80%', maxWidth: '300px', padding: '10px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1em' }}
            onKeyDown={handleKeyDown} 
          />
          <button
            onClick={handleSetUsername}
            style={{ padding: '10px 20px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em' }}
          >
            チャットに参加する
          </button>
        </div>
      ) : (
        <>
          <div style={{ 
            flexGrow: 1,      
            overflowY: 'auto', 
            padding: '15px', 
            background: '#e0e0e0', 
            display: 'flex', 
            flexDirection: 'column' 
          }}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                style={{ 
                  marginBottom: '10px', 
                  padding: '8px 12px', 
                  background: msg.user === username ? '#DCF8C6' : '#FFFFFF', 
                  borderRadius: '7px', 
                  maxWidth: '80%', 
                  alignSelf: msg.user === username ? 'flex-end' : 'flex-start', 
                  boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
                  wordBreak: 'break-word', 
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '0.9em', color: '#333', marginBottom: '2px' }}>
                  {msg.user} <span style={{ fontWeight: 'normal', fontSize: '0.8em', color: '#777' }}>({msg.timestamp})</span>
                </div>
                {msg.imageUrl ? ( 
                  <img src={msg.imageUrl} alt="チャット画像" style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px', marginTop: '5px' }} />
                ) : (
                  <div style={{ fontSize: '1em' }}>{msg.text}</div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} /> 
          </div>

          <div style={{ 
            padding: '15px', 
            background: '#eee', 
            borderTop: '1px solid #ccc', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px' 
          }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="あなたのユーザー名" 
              readOnly 
              style={{ width: 'calc(100% - 20px)', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1em', backgroundColor: '#e0e0e0' }}
            />
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}> 
              <textarea 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown} 
                placeholder="メッセージを入力..."
                rows={3} 
                style={{ 
                  flexGrow: 1, 
                  padding: '10px', 
                  border: '1px solid #ccc', 
                  borderRadius: '5px', 
                  fontSize: '1em',
                  resize: 'vertical' 
                }}
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*" 
                onChange={handleFileChange}
                style={{ display: 'none' }} 
              />
              <button
                onClick={() => fileInputRef.current?.click()} 
                style={{ padding: '10px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em', whiteSpace: 'nowrap' }}
              >
                画像
              </button>
              <button
                onClick={sendMessage} 
                style={{ padding: '10px 20px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em', whiteSpace: 'nowrap' }}
              >
                送信
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
