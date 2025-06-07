// server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose(); // SQLite3ライブラリを読み込む

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  },
  maxHttpBufferSize: 1e7 // ★追加: 10MBまでWebSocketのメッセージサイズを許可 (画像送信のため)
});

// データベースのセットアップ
const DB_PATH = './chat.db'; 
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('データベース接続エラー:', err.message);
  } else {
    console.log('データベースに接続しました:', DB_PATH);
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      message_text TEXT,          -- ★変更: メッセージテキストはNULL許容にする (画像メッセージの場合)
      image_url TEXT,             -- ★追加: 画像URL（Base64データをここに保存）
      timestamp TEXT NOT NULL
    )`);
    console.log('messagesテーブルが存在することを確認しました。');
  }
});

const chatRooms = {}; 

io.on('connection', (socket) => {
  console.log('新しいユーザーがサーバーに接続しました (Socket ID):', socket.id);

  // --- クライアントから「ルームに参加したい」というリクエストが来たとき ---
  socket.on('joinRoom', (data) => {
    const { roomId, username } = data; 
    
    if (!roomId || !username || username.trim() === '') {
        console.warn('参加リクエストのデータが不正です:', data);
        return; 
    }

    socket.join(roomId); 
    
    if (!chatRooms[roomId]) {
      chatRooms[roomId] = { users: [] }; 
    }

    if (!chatRooms[roomId].users.includes(socket.id)) {
      chatRooms[roomId].users.push(socket.id);
    }
    
    console.log(`ユーザー ${username} (${socket.id}) がルーム ${roomId} に参加しました`);
    
    // 過去のメッセージをデータベースから読み込み、参加したユーザーにだけ送信する
    // ★変更: image_urlも選択するように
    db.all(`SELECT user_name, message_text, image_url, timestamp FROM messages WHERE room_id = ? ORDER BY id DESC LIMIT 50`, [roomId], (err, rows) => {
      if (err) {
        console.error('過去メッセージの読み込みエラー:', err.message);
        return;
      }
      const historicalMessages = rows.reverse().map(row => ({
        user: row.user_name,
        text: row.message_text,
        imageUrl: row.image_url, // ★追加: image_urlもマップする
        timestamp: row.timestamp
      }));
      socket.emit('historicalMessages', historicalMessages);
      console.log(`ルーム ${roomId} の過去 ${historicalMessages.length} 件のメッセージを ${username} に送信しました。`);
    });

    io.to(roomId).emit('message', { 
      user: 'システム', 
      text: `${username}さんがチャットに参加しました！`, 
      timestamp: new Date().toLocaleTimeString() 
    });
  });

  // --- クライアントから「メッセージを送りたい」というリクエストが来たとき ---
  socket.on('sendMessage', (data) => {
    const { roomId, user, text } = data; 

    if (!roomId || !user || !text || text.trim() === '') {
        console.warn('送信メッセージのデータが不正です:', data);
        return;
    }

    console.log(`ルーム ${roomId} から ${user} のメッセージ: ${text}`);
    
    // メッセージをデータベースに保存する (image_urlはNULL)
    const timestamp = new Date().toLocaleTimeString();
    db.run(`INSERT INTO messages (room_id, user_name, message_text, image_url, timestamp) VALUES (?, ?, ?, ?, ?)`,
      [roomId, user, text, null, timestamp], // image_urlはnullとして保存
      function(err) {
        if (err) {
          console.error('メッセージの保存エラー:', err.message);
          return;
        }
        console.log(`テキストメッセージがデータベースに保存されました。ID: ${this.lastID}`);
      }
    );

    io.to(roomId).emit('message', { 
      user: user, 
      text: text, 
      timestamp: timestamp 
    });
  });

  // ★追加: クライアントから「画像を送信したい」というリクエストが来たとき ---
  socket.on('sendImage', (data) => {
    const { roomId, user, imageData, fileName } = data;

    if (!roomId || !user || !imageData) {
      console.warn('送信画像のデータが不正です:', data);
      return;
    }

    console.log(`ルーム ${roomId} から ${user} が画像を送信しました: ${fileName} (サイズ: ${imageData.length} bytes)`);

    // 画像データをデータベースに保存する (message_textはNULL)
    const timestamp = new Date().toLocaleTimeString();
    db.run(`INSERT INTO messages (room_id, user_name, message_text, image_url, timestamp) VALUES (?, ?, ?, ?, ?)`,
      [roomId, user, null, imageData, timestamp], // image_urlにBase64データを保存
      function(err) {
        if (err) {
          console.error('画像メッセージの保存エラー:', err.message);
          return;
        }
        console.log(`画像メッセージがデータベースに保存されました。ID: ${this.lastID}`);
      }
    );

    // そのルームにいる全員に、画像メッセージをブロードキャスト
    io.to(roomId).emit('message', { 
      user: user, 
      text: `[画像: ${fileName}]`, // テキストメッセージとしてはファイル名を表示
      imageUrl: imageData,        // 画像データ自体をimageUrlとして送る
      timestamp: timestamp 
    });
  });

  // --- ユーザーがチャットサーバーから切断されたとき ---
  socket.on('disconnect', () => {
    console.log('ユーザーがサーバーから切断しました (Socket ID):', socket.id);
  });
});

const PORT = process.env.PORT || 3001; 
server.listen(PORT, () => {
  console.log(`WebSocketサーバーがポート ${PORT} で起動しました`);
});
