import React, { createContext, useState } from 'react';
import user2Data from "../json/user2.json"
import * as firebase from 'firebase'; 

/**
 * This provider is created
 * to access user in whole app
 */

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user2, setUser2] = useState(user2Data);
  const [islogin,setisLogin] = useState(false);
  const [err,setErr] = useState("") ;
  return (
    <AuthContext.Provider
      value={{
        err,
        setErr,
        user2,
        setUser2,
        islogin,
        setisLogin,
        login: async (email, password) => {
          try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            setUser2({...user2,name:firebase.auth().currentUser.displayName});
            setUser2({...user2,email});
            setUser2({...user2,password});
            console.log(`authstore name=${firebase.auth().currentUser.displayName}`);
            setisLogin(true);
            
          } catch (e) {
            console.log(e);
            setErr(e);
          }
        },
        register: async (name,email, password) => {
          try {
            await firebase.auth().createUserWithEmailAndPassword(email, password);
            await firebase.auth().signInWithEmailAndPassword(email, password);
            await firebase.auth().currentUser.updateProfile({
                displayName:name
            })
            setUser2({...user2,name:firebase.auth().currentUser.displayName});
            setUser2({...user2,email});
            setUser2({...user2,password});
            setisLogin(true);
          } catch (e) {
            console.log(e);
            setErr(e);
          }
          
        },
        logout: async () => {
          try {
            await firebase.auth().signOut();
            setUser2({...user2,name:""});
            setUser2({...user2,email:""});
            setUser2({...user2,password:""});
            setisLogin(false);
          } catch (e) {
            console.error(e);
            setErr(e);
          }
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};