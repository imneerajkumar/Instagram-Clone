import React, { useState, useEffect } from "react";
import './App.css';
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import { db, auth } from "./firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input} from "@material-ui/core";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 300,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {   
        // User logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // User logged out
        setUser(null); 
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
      // everytime a new post is added.
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })                
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="app">
  
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage"
                src="data:image/png;base64,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"
                alt="Instagram"
              />
            </center>
            <Input 
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="Submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage"
                src="data:image/png;base64,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"
                alt="Instagram"
              />
            </center>
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn} type="submit">Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img 
          className="app__headerImage"
          src="data:image/png;base64,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"
          alt="Instagram"
        />
        {user ? (
          <div> 
            <a href="https://ig-reels-b94c5.web.app/"><Button>Reels</Button></a>
            <Button onClick={() => auth.signOut()}>Logout</Button>
          </div>
        ) : (
        <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
        
      )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} user={user} />
            ))
          }
        </div> 
      </div>
      
      {user?.displayName && (
        <ImageUpload username={user.displayName}/>
      )}
    </div>
  );
}

export default App;
