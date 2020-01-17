import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return <main>
    <header>
      <img className="logo" src="https://image.freepik.com/free-vector/swan-with-water-splash-logo-design_100735-14.jpg"/>
      <div className="title">
        ploop
      </div>
    </header>
    <body>
    
    </body>
    <footer>
      <TextInput onSend={t=>{
        var msg = document.createElement("div");   
        msg.className = "message"
        msg.innerHTML = t;         
        document.body.appendChild(msg);  }
      }/>
    </footer>
  </main>
}

function TextInput(props){
  const [text, setText] = useState('')

  return <div className="text-input">
    <input value={text}
      placeholder="Type here..."
      onChange={e=>setText(e.target.value)}
    />
    <button onClick={()=> {
      props.onSend(text)
      setText('')
    }}>
      &#x2B9D;
    </button>
  </div>
}

export default App;
