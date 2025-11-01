# some stuff about this project (note this folder looks more readable in code format)
## it uses express@5
## you need to have mysql installed
I installed mysql 9.5 from   <a href="https://dev.mysql.com/downloads/mysql/?platform&os=3">here</a>
## U NEED TO ALTER THE SCHEMA
-- 1) Drop the existing FK
ALTER TABLE owns
  DROP FOREIGN KEY owns_ibfk_1;

-- 2) Recreate it with CASCADE (use a new name to be clear)
ALTER TABLE owns
  ADD CONSTRAINT fk_owns_owner_cascade
    FOREIGN KEY (ownerId) REFERENCES owner(ownerId)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
### Why did I do this?
because one of the tasks required deleting and owner and all their own instances. How do you this?
after installing mysql 9.5 u can say mysql -u root -p
make sure to keep the password "cs321" to keep everything consistent because in the datbase.js, I connect to mysql using these properties
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'cs321',
    database: 'racing'
}).promise()

anyway, after doing this, you will need to 1:
create the racing database by copying and pasting the schema from the project pdf. While doing this, one problem I faced was that some race inserts were more than one line long so copying and pasting it in the terminal directly can cause issues.
I fixed this by just giving it to chatgbt and telling it to format it into one line strings
2: alter the constraints as I mentioned by running this:
-- 1) Drop the existing FK
ALTER TABLE owns
  DROP FOREIGN KEY owns_ibfk_1;

-- 2) Recreate it with CASCADE (use a new name to be clear)
ALTER TABLE owns
  ADD CONSTRAINT fk_owns_owner_cascade
    FOREIGN KEY (ownerId) REFERENCES owner(ownerId)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

# how to run
- make sure the express, mysql12, and react libraries are installed
- make sure that the server (api.js) is listening for requests by running "node api.js" in the terminal
- then cd to "cs321" this is the react app folder, run it by typing in the terminal "npm start"
  
