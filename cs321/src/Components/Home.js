import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import {useState} from 'react';
import Admin from './Admin.js'
function Home(props) {
    const [role, setRole] = useState("");
    const [menu, setMenu] = useState(true);
    const [error, setError] = useState(false)
    const [name, setName] = useState("")
        
        if (menu) {
        return(
        <div>
        <h2>Welcome to the horse DB application<br/>please choose your role:</h2>
        <Button>login as guest</Button>
        <span></span>
        <div>
        <Form onSubmit={e => loginAsAdmin(e)}>
            <br/>
        <h6>an admin? enter your credentials</h6>
        <Form.Group className="mb-3" controlId="adminUsername">
               <Form.Label>username</Form.Label>
               <Form.Control type="text" placeholder="SpongeBob SquarePants" value={name} onChange={(e)=>setName(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="adminPass">
               <Form.Label>password</Form.Label>
               <Form.Control type="text" placeholder="****" />
        </Form.Group> 
        {error && <Alert variant="danger">wrong username or password credentials</Alert>}
        <Button type="submit">login as admin</Button>      
        </Form>
        </div>
        </div>)
        }

        else if (role === "Admin") {
            return <Admin name={name}/>
        }

        function loginAsAdmin(e) {
            e.preventDefault();
            const username = e.target.adminUsername.value
            const password = e.target.adminPass.value
            if (password === "cs321") {
                setMenu(false)
                setRole(() => "Admin")
            }
            else {
                setError(true)
            }
        }

        
    
}

export default Home;