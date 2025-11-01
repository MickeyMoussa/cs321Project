import express from 'express'
import {getRaces, getRace, addRace, getHorses, getOwners, getTrainers, deleteOwner, moveHorseStable, approveTrainerToStable} from './database.js';
import cors from 'cors';


const app = express()
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.get("/races", async (req, res) => {
    const races = await getRaces();
    res.send(races)
})

app.get("/race/:id", async (req, res) => {
    const id = req.params.id
    const race = await getRace(id)
    res.send(race)
})


app.post("/race", async (req, res) => {
    const {raceId, raceName, trackName, raceDate, raceTime} = req.body
    const newRace = await addRace(raceId, raceName, trackName, raceDate, raceTime)
    res.status(201).send("race added successfully")
})


app.get("/horses", async (req, res) => {
    const horses = await getHorses();
    res.send(horses)
})

app.get("/owners", async (req, res) => {
    const owners = await getOwners();
    res.send(owners)
})

app.get("/trainers", async (req, res) => {
    const trainers = await getTrainers();
    res.send(trainers)
})

app.put('/horses/:horseId/stable', async (req, res) => {
  const { horseId } = req.params;
  const { stableId } = req.body;
  if (!stableId) return res.status(400).json({ error: 'stableId is required' });

  try {
    const { affected } = await moveHorseStable(horseId, stableId);
    if (affected === 0) {
     
      return res.status(404).json({ error: 'Horse not found' });
    }
    return res.status(200).json({ message: 'Horse moved' });
  } catch (err) {
 
    if (err.errno === 1452 || err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid stableId (no such stable)' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Failed to move horse' });
  }
});

app.delete('/owners/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { affected } = await deleteOwner(ownerId);
    if (affected === 0) return res.status(404).json({ error: 'Owner not found' });
    return res.status(204).send();
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
      return res.status(409).json({ error: 'Owner still referenced in Owns' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete owner' });
  }
});

app.put('/trainers/:trainerId/stable', async (req, res) => {
  const { trainerId } = req.params;
  const { stableId } = req.body;
  if (!stableId) return res.status(400).json({ error: 'stableId is required' });

  try {
    const { affected } = await approveTrainerToStable(trainerId, stableId);
    if (affected === 0) return res.status(404).json({ error: 'Trainer not found' });
    return res.status(200).json({ message: 'Trainer approved for stable' });
  } catch (err) {

    if (err.errno === 1452 || err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid stableId (no such Stable)' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Failed to approve trainer' });
  }
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('something broke')
})

app.listen(8080, () => {
    console.log('server is running on port 8080')
})

