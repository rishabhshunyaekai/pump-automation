import React, { useState, useEffect } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
 //import { AES, enc } from "crypto-js";
 import CryptoJS from 'crypto-js';
// import crypto from 'crypto';
 //import AesCrypto from 'react-native-aes-crypto';

const firebaseConfig = {
    apiKey: "AIzaSyCcnlAx9XxydyXSp2Jp9EvPEW0TrIzfchc",
    authDomain: "bdiskoveredapp-6eb80.firebaseapp.com",
    databaseURL: "https://bdiskoveredapp-6eb80-default-rtdb.firebaseio.com",
    projectId: "bdiskoveredapp-6eb80",
    storageBucket: "bdiskoveredapp-6eb80.appspot.com",
    messagingSenderId: "1078590892507",
    appId: "1:1078590892507:ios:5843e858c1bc6e9c9fdffe"
  };
  

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const KEY_SIZE = 128;
const SEED_VALUE = 'MySecretSeedValue'; // replace with your own seed value
//const algorithm = 'aes-256-cbc';
const KEY = '5d707ecb8d900c19352e1e607a9cc5a5';
const iv = '0123456789ABCDEF';


function FirebaseData() {
  const [data, setData] = useState([]);

//   const generateKey = () => {
//     const key = CryptoJS.PBKDF2(SEED_VALUE, CryptoJS.lib.WordArray.random(16), {
//       keySize: KEY_SIZE / 32,
//       iterations: 1000,
//     });
//     console.log(key)
//     return key;
//   };
//   generateKey()
// //  const key = CryptoJS.lib.WordArray.random(16);
//   //console.log(generateKey())
//   return;

function encrypt(data) {
  const key = CryptoJS.enc.Hex.parse(KEY);
  const message = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(message, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
}

function decrypt(encryptedData) {
  const key = CryptoJS.enc.Hex.parse(KEY);
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

  useEffect(async() => {
    const ref = db.ref('one_to_one');
    const plaintext = "Hello, Rohit!";
    //const key = 'bdiskovered@_2023_secretkeysecre';
    const ciphertext = encrypt(plaintext);
    //console.log("Encrypted text:", ciphertext);
    const childRef = db.ref('one_to_one').child('63c69a78b89273efdf60ec55+63e0f3621995e7978d54e73b');

    childRef.push({
        "chat_time":"04:26 pm",
        "chat_sender_img":"",
        "chatSenderId":"@63c69a78b89273efdf60ec55",
        "chat_receiver_img":"",
        "chat_receiver":"Chintan 00",
        "chat_sender":"Sachin 00",
        "attachment_path":"",
        "type":"text",
        "chat_message":plaintext
    });
    
    childRef.on('value', snapshot => {
        setData([])
        snapshot.forEach(childSnapshot => {

              console.log(childSnapshot.val().chat_message)
             //let bytes=decrypt(childSnapshot.val().chat_message);
            // const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            // console.log("Decrypted text rr:", bytes);
           
           setData(oldArray => [...oldArray, {decrypted:childSnapshot.val().chat_message}]);

          });
    });

    return () => {
      ref.off();
    };
  }, []);

  return (
    <div>
      {data ?
       data.map(item=>{
       return( <p>{
        item.decrypted
        }
        </p>)
      }) 
      : <p>Loading...</p>}
    </div>
  );
}

export default FirebaseData;