import {useState, useEffect} from 'react'
import * as firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"

let store
const coll = 'messages'

function useDB(room) {
    const [messages, setMessages] = useState([])
    function add(m) {
        setMessages(current => {
            const msgs = [m, ...current]
            msgs.sort((a,b)=> b.ts.seconds - a.ts.seconds)
            return msgs
        })
    }
    function remove(id) {
        setMessages(current=> current.filter(m=> m.id!==id))
    }
    useEffect(() => {
        store.collection(coll)
        .where('room','==',room)
        .onSnapshot(snap=> snap.docChanges().forEach(c=> {
            const {doc, type} = c
            if (type==='added') add({...doc.data(),id:doc.id})
            if (type==='removed') remove(doc.id)
        }))
    }, [])
    return messages
}

const db = {}
db.send = function(msg) {
    return store.collection(coll).add(msg)
}
db.delete = function(id) {
    return store.collection(coll).doc(id).delete()
}

export { db, useDB }

const firebaseConfig = {
    apiKey: "AIzaSyBH8VyRnhPmGuBsPQsTRYb6bkE9IOpxQFY",
    authDomain: "sploop-chat.firebaseapp.com",
    databaseURL: "https://sploop-chat.firebaseio.com",
    projectId: "sploop-chat",
    storageBucket: "sploop-chat.appspot.com",
    messagingSenderId: "737309689265",
    appId: "1:737309689265:web:da9e2e35ab0b17de2d6990",
    measurementId: "G-T7B79KY8X4"
  };

firebase.initializeApp(firebaseConfig)
store = firebase.firestore()