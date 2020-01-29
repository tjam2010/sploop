import React, { useState, useEffect } from 'react';
import './App.css';
import './media.css'
import './db'
import NamePicker from './namePicker'
import { db, useDB } from './db';
import {BrowserRouter,Route} from 'react-router-dom'
import { FiCamera } from 'react-icons/fi'
import Camera from 'react-snap-pic'
import * as firebase from "firebase/app"
import "firebase/storage"
import Div100vh from 'react-div-100vh'

function App(){
  useEffect(()=>{
    const {pathname} = window.location
    if(pathname.length<2) window.location.pathname='home'
  }, [])
  return <BrowserRouter>
    <Route path="/:room" component={Room}/>
  </BrowserRouter>
}

function Room(props) {
  const {room} = props.match.params
  const [name, setName] = useState('')
  const messages = useDB(room)
  const [showCamera, setShowCamera] = useState(false)
  
  async function takePicture(img) {
    setShowCamera(false)
    const imgID = Math.random().toString(36).substring(7)
    var storageRef = firebase.storage().ref()
    var ref = storageRef.child(imgID + '.jpg')
    await ref.putString(img, 'data_url')
    db.send({ img: imgID, name, ts: new Date(), room })
  }

  return <Div100vh>
    
  {showCamera && <Camera takePicture={takePicture}/>}

    <header>
      <div className="title">
        <img className="logo" alt="s" src="https://image.freepik.com/free-vector/swan-with-water-splash-logo-design_100735-14.jpg" />
        <div>ploop</div>
      </div>
      <NamePicker onSave={setName}/>
    </header>
    <body>
      <div className="messages">
        {messages.map((m,i)=><Message key={i} m={m} name={name}/>)}
      </div>
    </body>
    <footer>
    <TextInput onSend={(text) => {
        db.send({
          text, name, ts: new Date(), room
        })
      }}
      showCamera={()=>setShowCamera(true)}
      />
    </footer>
  </Div100vh>
}

const bucket = 'https://firebasestorage.googleapis.com/v0/b/sploop-chat.appspot.com/o/'
const suffix = '.jpg?alt=media'

function TextInput(props) {
  const [text, setText] = useState('')

  return <div>
    <button className="camera-button" onClick={props.showCamera}>
        <FiCamera className="fi-camera"/>
    </button>
    <input className="text-input" value={text}
      placeholder="Type here..."
      onChange={e => setText(e.target.value)}
      onKeyPress={e => {
        if(e.key === "Enter"){
            if(text){
              props.onSend(text)
              setText('')
            }
        }
      }}
    />
    <button className="send-button" onClick={() => {
      if(text){
        props.onSend(text)
        setText('')
      }
    }} disabled={!text}>
      &#x2B9D;
    </button>
  </div>
}

function Message({m, name}){
  return <div className="message-wrap"
            from={m.name===name?'me':'you'}>
            <div className="message">
              {m.text && <div className="msg-text">{m.text}</div>}
              {m.img && <img  className="msg-img" src={bucket + m.img + suffix} alt="pic" />}
              <div className="msg-name" from={m.name===name?'me':'you'}>{m.name === "" ? "anon" : m.name}</div>
            </div>
          </div>
}

export default App;
