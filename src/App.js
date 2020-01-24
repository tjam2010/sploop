import React, { useState, useEffect } from 'react';
import './App.css';
import './db'
import NamePicker from './namePicker'
import { db, useDB } from './db';
import {BrowserRouter,Route} from 'react-router-dom'

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

  return <main>
    <header>
      <div className="title">
        <img className="logo" alt="s" src="https://image.freepik.com/free-vector/swan-with-water-splash-logo-design_100735-14.jpg" />
        <div>ploop</div>
      </div>
      <NamePicker onSave={setName}/>
    </header>
    <body>
      <div className="messages">
        {messages.map((m,i)=>{
          return <div key={i} className="message-wrap"
            from={m.name===name?'me':'you'}>
            <div className="message">
              <div className="msg-text">{m.text}</div>
              <div className="msg-name" from={m.name===name?'me':'you'}>{m.name === "" ? "anon" : m.name}</div>
            </div>
          </div>
        })}
      </div>
    </body>
    <footer>
    <TextInput onSend={(text) => {
        db.send({
          text:text, name:name, ts:new Date(), room
        })
      }} />
    </footer>
  </main>
}

function TextInput(props) {
  const [text, setText] = useState('')

  return <div>
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

export default App;
