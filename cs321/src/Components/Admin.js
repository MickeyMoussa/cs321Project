import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Dropdown from "react-bootstrap/Dropdown";
import {useState, useEffect, useRef} from 'react';



function Admin(props) {
    function resetApp() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload(); 
}

const [approveTrainerId, setApproveTrainerId] = useState("");
const [approveStableId, setApproveStableId] = useState("");
const [trainerMsg, setTrainerMsg] = useState(null);
const [trainerBusy, setTrainerBusy] = useState(false);

async function handleApproveTrainer(e) {
  e.preventDefault();
  if (!approveTrainerId || !approveStableId) return;

  setTrainerBusy(true);
  setTrainerMsg(null);

  try {
    const res = await fetch(
      `http://localhost:8080/trainers/${encodeURIComponent(approveTrainerId)}/stable`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stableId: approveStableId }),
      }
    );

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
     
      setResults(prev =>
        prev.map(t => t.trainerId === approveTrainerId ? { ...t, stableId: approveStableId } : t)
      );
      setTrainerMsg({ type: 'success', text: `Trainer "${approveTrainerId}" approved for stable "${approveStableId}".` });
      setApproveStableId("");
    } else {
      setTrainerMsg({ type: 'danger', text: data.error || `Failed (status ${res.status}).` });
    }
  } catch (err) {
    console.error(err);
    setTrainerMsg({ type: 'danger', text: 'Server error while approving trainer.' });
  } finally {
    setTrainerBusy(false);
  }
}
//trainer

//djddoiuhjsdiusduosiiousd
const [delOwnerId, setDelOwnerId] = useState("");
const [ownerMsg, setOwnerMsg] = useState(null);

async function handleDeleteOwner(e) {
  e.preventDefault();
  const id = delOwnerId || e.currentTarget.ownerId?.value;
  if (!id) return;

  if (!window.confirm(`Delete owner "${id}"? This will also remove their Owns rows.`)) return;

  try {
    const res = await fetch(`http://localhost:8080/owners/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (res.status === 204 || res.status === 200) {
   
      setResults(prev => prev.filter(o => o.ownerId !== id));
      setDelOwnerId("");
      setOwnerMsg({ type: "success", text: `Owner "${id}" deleted.` });
    } else {
      const data = await res.json().catch(() => ({}));
      setOwnerMsg({ type: "danger", text: data.error || `Failed to delete (status ${res.status}).` });
    }
  } catch (err) {
    console.error(err);
    setOwnerMsg({ type: "danger", text: "Server error while deleting owner." });
  }
}

//sdujsdhksjhsdujk


//moving horses
const [moveHorseId, setMoveHorseId] = useState("");
const [newStableId, setNewStableId] = useState("");
const [horseMsg, setHorseMsg] = useState(null);
const [horseBusy, setHorseBusy] = useState(false);

async function handleMoveHorse(e) {
  e.preventDefault();
  if (!moveHorseId || !newStableId) return;
  setHorseBusy(true);
  setHorseMsg(null);

  try {
    const res = await fetch(`http://localhost:8080/horses/${encodeURIComponent(moveHorseId)}/stable`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stableId: newStableId }),
    });

    if (res.ok) {

      setResults(prev => prev.map(h => h.horseId === moveHorseId ? { ...h, stableId: newStableId } : h));
      setHorseMsg({ type: 'success', text: `Horse "${moveHorseId}" moved to "${newStableId}".` });
      setNewStableId("");
    } else {
      const data = await res.json().catch(() => ({}));
      setHorseMsg({ type: 'danger', text: data.error || `Failed (status ${res.status}).` });
    }
  } catch (err) {
    console.error(err);
    setHorseMsg({ type: 'danger', text: 'Server error while moving horse.' });
  } finally {
    setHorseBusy(false);
  }
}

const[results, setResults] = useState([])
const[table, setTable] = useState("horses")
const reqSeq = useRef(0);
useEffect(() => {
  const seq = ++reqSeq.current;         
  setResults([]); 
  
  
  

  (async () => {
    try {
      const res = await fetch(`http://localhost:8080/${table}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (seq === reqSeq.current) {       
        setResults(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      if (seq === reqSeq.current) setResults([]);
      console.error(e);
    }
  })();
}, [table]);

//race
const [raceMsg, setRaceMsg] = useState(null); 
async function submitRace(e) {
  e.preventDefault();
  const form = e.currentTarget;

  const body = {
    raceId: form.raceId.value,
    raceName: form.raceName.value,
    trackName: form.trackName.value,
    raceDate: form.raceDate.value,
    raceTime: form.raceTime.value.length === 5
      ? form.raceTime.value + ":00"
      : form.raceTime.value,
  };

  try {
    const res = await fetch("http://localhost:8080/race", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());

    if (table === "races") setResults(prev => [body, ...prev]); 
    form.reset();

    setRaceMsg({ type: "success", text: "Race added successfully!" });
    clearTimeout(submitRace._t);
    submitRace._t = setTimeout(() => setRaceMsg(null), 3000);
  } catch (err) {
    console.error("Create failed:", err);
    setRaceMsg({ type: "error", text: "Failed to add race: " + err.message });
    clearTimeout(submitRace._t);
    submitRace._t = setTimeout(() => setRaceMsg(null), 5000);
  }
}

//race
    
    return (
        <>
        <Button onClick = {resetApp} variant="danger">X</Button>
  
    <h2>welcome back {props.name}</h2>
    <h5>results length is {results.length}</h5>
    <Dropdown>
    <Dropdown.Toggle variant="success">Action</Dropdown.Toggle>
    <Dropdown.Menu>
    <Dropdown.Item onClick={() => setTable(() => "races")}>Add</Dropdown.Item>
    <Dropdown.Item onClick={() => setTable(() => "owners")}>Delete</Dropdown.Item>
    <Dropdown.Item onClick={() => setTable(() => "horses")}>Stable Change</Dropdown.Item>
    <Dropdown.Item onClick={() => setTable(() => "trainers")}>New Trainer</Dropdown.Item>
    </Dropdown.Menu>
    </Dropdown>

    {table === "races" && (
        <Container>
  <h2>Add Race</h2>
  {raceMsg && (
  <Alert
    variant={raceMsg.type === "success" ? "success" : "danger"}
    onClose={() => setRaceMsg(null)}
    dismissible
    style={{ maxWidth: 520 }}
  >
    {raceMsg.text}
  </Alert>
)}
  <Form onSubmit={submitRace}>
    <Form.Group className="mb-3" controlId="raceId">
      <Form.Label>Race ID</Form.Label>
      <Form.Control name="raceId" type="text" placeholder="race37" required />
      <Form.Text className="text-muted">
        please don't add a used number 1-36
      </Form.Text>
    </Form.Group>

    <Form.Group className="mb-3" controlId="raceName">
      <Form.Label>Race Name</Form.Label>
      <Form.Control name="raceName" type="text" placeholder="Sebaq al-Ula" required />
    </Form.Group>

    <Form.Group className="mb-3" controlId="trackName">
      <Form.Label>Track Name</Form.Label>
      <Form.Control name="trackName" type="text" placeholder="Dahaya Najd" required />
    </Form.Group>

    <Form.Group className="mb-3" controlId="raceDate">
      <Form.Label>Race Date</Form.Label>
      <Form.Control name="raceDate" type="date" required />
    </Form.Group>

    <Form.Group className="mb-3" controlId="raceTime">
      <Form.Label>Race Time</Form.Label>
      <Form.Control name="raceTime" type="time" step="1" placeholder="12:30:00" required />
    </Form.Group>

    <Button type="submit">Submit</Button>
  </Form>
</Container>
    )}

    {table === "owners" && (
  <Container>
    <h2>Delete Owner</h2>
    {ownerMsg && (
      <Alert
        variant={ownerMsg.type === "success" ? "success" : "danger"}
        onClose={() => setOwnerMsg(null)}
        dismissible
        style={{ maxWidth: 520 }}
      >
        {ownerMsg.text}
      </Alert>
    )}

    <Form onSubmit={handleDeleteOwner} style={{ maxWidth: 520 }}>
      <Form.Group className="mb-3" controlId="ownerId">
        <Form.Label>Owner ID</Form.Label>
     
        <Form.Select
          className="mb-2"
          value={delOwnerId}
          onChange={e => setDelOwnerId(e.target.value)}
        >
          <option value="">— Select an existing owner —</option>
          {results.map(o => (
            <option key={o.ownerId} value={o.ownerId}>
              {o.ownerId}{(o.fname || o.lname) ? ` — ${[o.fname, o.lname].filter(Boolean).join(" ")}` : ""}
            </option>
          ))}
        </Form.Select>

      
        <Form.Control
          type="text"
          placeholder="Or type an Owner ID (e.g., own12)"
          name="ownerId"
          onChange={e => setDelOwnerId(e.target.value)}
          value={delOwnerId}
        />
        
      </Form.Group>

      <Button type="submit" variant="danger" disabled={!delOwnerId}>
        Delete Owner
      </Button>
    </Form>
  </Container>
)}

{table === "horses" && (
  <Container>
    <h2>Stable Change</h2>
    {horseMsg && (
      <Alert
        variant={horseMsg.type === "success" ? "success" : "danger"}
        onClose={() => setHorseMsg(null)}
        dismissible
        style={{ maxWidth: 520 }}
      >
        {horseMsg.text}
      </Alert>
    )}

    <Form onSubmit={handleMoveHorse} style={{ maxWidth: 520 }}>
      <Form.Group className="mb-3" controlId="horseId">
        <Form.Label>Horse</Form.Label>
        <Form.Select
          value={moveHorseId}
          onChange={(e) => setMoveHorseId(e.target.value)}
          required
        >
          <option value="">— Select horse —</option>
          {results.map(h => (
            <option key={h.horseId} value={h.horseId}>
              {h.horseId}{h.horseName ? ` — ${h.horseName}` : ''} (stable: {h.stableId})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="newStableId">
        <Form.Label>New Stable ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="stable7"
          value={newStableId}
          onChange={(e) => setNewStableId(e.target.value)}
          required
        />
        <Form.Text className="text-muted">
          Must match an existing <code>Stable.stableId</code>.
        </Form.Text>
      </Form.Group>

      <Button type="submit" disabled={horseBusy || !moveHorseId || !newStableId}>
        {horseBusy ? 'Moving…' : 'Move Horse'}
      </Button>
    </Form>
  </Container>
)}

{table === "trainers" && (
  <Container>
    <h2>Approve Trainer to Stable</h2>

    {trainerMsg && (
      <Alert
        variant={trainerMsg.type === "success" ? "success" : "danger"}
        onClose={() => setTrainerMsg(null)}
        dismissible
        style={{ maxWidth: 520 }}
      >
        {trainerMsg.text}
      </Alert>
    )}

    <Form onSubmit={handleApproveTrainer} style={{ maxWidth: 520 }}>
      <Form.Group className="mb-3" controlId="trainerId">
        <Form.Label>Trainer</Form.Label>
        <Form.Select
          value={approveTrainerId}
          onChange={e => setApproveTrainerId(e.target.value)}
          required
        >
          <option value="">— Select trainer —</option>
          {/* If you only want “new/unassigned” trainers, filter: results.filter(t => !t.stableId) */}
          {results.map(t => (
            <option key={t.trainerId} value={t.trainerId}>
              {t.trainerId}{(t.fname || t.lname) ? ` — ${[t.fname, t.lname].filter(Boolean).join(' ')}` : ''} {t.stableId ? `(current: ${t.stableId})` : '(unassigned)'}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="stableId">
        <Form.Label>Stable ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="stable3"
          value={approveStableId}
          onChange={e => setApproveStableId(e.target.value)}
          required
        />
        <Form.Text className="text-muted">
          Must match an existing <code>Stable.stableId</code>.
        </Form.Text>
      </Form.Group>

      <Button type="submit" disabled={trainerBusy || !approveTrainerId || !approveStableId}>
        {trainerBusy ? 'Approving…' : 'Approve Trainer'}
      </Button>
    </Form>
  </Container>
)}



    <div style={{ backgroundColor: 'lightblue', margin: 10, padding: 10, borderRadius: '12px' }}>
    <h2 style={{ textTransform: "capitalize" }}>{table}</h2>
    <ul>
    {results.map((row, i) => (
        <li>
        {Object.entries(row).map(([k, v]) => (
            <span style={{ marginRight: 12 }}>
            <strong>{k}:</strong> {String(v)}
            </span>
        ))}
        </li>
    ))}
    </ul>
    </div>


</>
    )
}

export default Admin;
