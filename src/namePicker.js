import React, {useState, useRef, useEffect} from 'react'
import { FiEdit3, FiSave } from "react-icons/fi";

function NamePicker(props) {
    const [name, setName] = useState('')
    const [showName, setShowName] = useState(false)
    const inputEl = useRef(null)

    function save(){
        setTimeout(()=>{
        inputEl.current.focus()
        },0)
        if(name && !showName){
            props.onSave(name)
            localStorage.setItem('name', name)
        }
        setShowName(!showName)
    }

    useEffect(()=>{
        const n = localStorage.getItem('name')
        if(n) {
          setName(n)
          setTimeout(()=>{
            save()
          },0)
        }
      }, [])

    return <div className="edit-username">
        <input value={name} ref={inputEl}
            className="name-input"
            style={{display: showName ? 'none' : 'flex'}}
            onChange={e=> setName(e.target.value)}
                onKeyPress={e=> {
                    if(e.key==='Enter') save()
                }}
                placeholder="Enter name..."
        />
        
        {showName && <div className="name-wrap">Hello,&nbsp;<div className="name">{name}</div>!</div>}

        <button className="name-button" onClick={save}>
            {showName ? <FiEdit3 /> : <FiSave />}
        </button>
    </div>
}

export default NamePicker