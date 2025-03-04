require("dotenv").config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const admin = require('firebase-admin');

const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<your-database-name>.firebaseio.com'
});

const db = admin.firestore();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

let players = {}; // Хранилище очков игроков

wss.on("connection", (ws) => {
    console.log("Игрок подключился!");

    // Отправляем новому игроку текущие очки
    ws.send(JSON.stringify({ type: "update", players }));

    ws.on("message", async (message) => {
        console.log("Получено сообщение:", message);
        try {
            const data = JSON.parse(message);

            if (data.type === "click") {
                const player = data.playerId;
                players[player] = (players[player] || 0) + 1;

                // Сохраняем очки в базе данных
                await saveScore(player, players[player]);

                // Рассылаем обновленный счет всем игрокам
                broadcast({ type: "update", players });
            }
        } catch (error) {
            console.error("Ошибка обработки сообщения:", error);
        }
    });

    ws.on("close", () => {
        console.log("Игрок отключился");
    });
});

// Функция отправки данных всем клиентам
function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Функция сохранения очков игрока в базе данных
async function saveScore(playerId, score) {
    const playerRef = db.collection('players').doc(playerId);
    await playerRef.set({ score });
}

// Запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));