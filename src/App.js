import React, { useState, useEffect } from 'react';
import './App.css';
import './db'
import NamePicker from './namePicker'
import { db } from './db';

function App() {
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')

  useEffect(() =>{
    db.listen({
      receive: m=> {
        setMessages(current=>[m,...current])
    },
    })
  }, [])

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
          return <div key={i} className="message-wrap">
            <div className="message">{m.text}
              {m.name}
            </div>
          </div>
        })}
      </div>
    </body>
    <footer>
    <TextInput onSend={(text) => {
        db.send({
          text:text, name:name, ts: new Date()
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
