import React from 'react';
import { useState, createContext, useEffect } from 'react';
import { Global } from '../helpers/Global';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState({});
  const [counters, setCounters] = useState({});
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    authUser(); 
  }, []);

  const authUser = async () => {
    //Sacar datos del usuario identificado del localstogare
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    //Comprobar si trngo el token y el user
    if (!token || !user) {
      setLoading(false)
      return false;
    }

    //Transformar los datos a un objeto  javascript
    const userObj = JSON.parse(user);
    const userId = userObj.id;

    //Peticion ajax al backend que compruebe el token y
    //Que me devuelva todos los datos del usuario
    const request = await fetch(Global.url + "user/profile/" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const data = await request.json();
    
    
    //Peticion para los contadores
    const requestCounter = await fetch(Global.url + "user/counters/" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const dataCounter = await requestCounter.json();

    //setear el estado de auth
    setAuth(data.user);
    setCounters(dataCounter);
    setLoading(false);

  }

  return (<AuthContext.Provider
    value={{
      auth,
      setAuth,
      counters,
      loading,
      setCounters

    }}
  >
    {children}
  </AuthContext.Provider>
  )
}




