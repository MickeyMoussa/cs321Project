import mysql from 'mysql2'
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'cs321',
    database: 'racing'
}).promise()



export async function getRaces() {
    const [result] = await pool.query(`SELECT * FROM Race;`)
    return result
}


export async function getHorses() {
    const [result] = await pool.query(`SELECT * FROM Horse;`)
    return result
}

export async function getOwners() {
    const [result] = await pool.query(`SELECT * FROM Owner;`)
    return result
}

export async function getTrainers() {
    const [result] = await pool.query(`SELECT * FROM Trainer;`)
    return result
}


export async function getRace(raceId) {
    const [result] = await pool.query(`SELECT *
        FROM Race
        WHERE raceId = ?;`, [raceId])
    return result[0]
}

export async function addRace(raceId, raceName, trackName, raceDate, raceTime) {
    const result = await pool.query(`INSERT INTO race (raceId, raceName, trackName, raceDate, raceTime)
        VALUES (?, ?, ?, ?, ?);`, [raceId, raceName, trackName, raceDate, raceTime])
}

export async function deleteOwner(ownerId) {
  const [result] = await pool.query(
    'DELETE FROM owner WHERE ownerId = ?',
    [ownerId]
  );
  return { affected: result.affectedRows }; 
}

export async function moveHorseStable(horseId, newStableId) {
  const [result] = await pool.query(
    'UPDATE horse SET stableId = ? WHERE horseId = ?',
    [newStableId, horseId]
  );
  return { affected: result.affectedRows };
}

export async function approveTrainerToStable(trainerId, stableId) {
  const [result] = await pool.query(
    'UPDATE trainer SET stableId = ? WHERE trainerId = ?',
    [stableId, trainerId]
  );
  return { affected: result.affectedRows };
}