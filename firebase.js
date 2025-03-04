const admin = require('firebase-admin');

const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<your-database-name>.firebaseio.com'
});

const db = admin.firestore();

async function saveScore(playerId, score) {
  const playerRef = db.collection('players').doc(playerId);
  await playerRef.set({ score });
}

async function getScores() {
  const scoresRef = db.collection('players');
  const snapshot = await scoresRef.get();
  const scores = {};
  snapshot.forEach(doc => {
    scores[doc.id] = doc.data().score;
  });
  return scores;
}

module.exports = { saveScore, getScores };