//auth context is used to see the data which is coming back from google and fb

import React, { useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {auth} from '../components/firebase';

const AuthContext = React.createContext();  //create context

export const useAuth = () => useContext(AuthContext);  //to expoet/return it completely - in usecontext react hook

export const AuthProvider = ({children}) => { //react children is simply goin to render all jsx into authprovider  --> to manage users data.
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const history = useHistory();  //to renavigate somewher

    useEffect(() => { //grabing user from firebase auth and setting it to state.
        auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
            if (user) history.push('/chats'); // only if have the user then push to chats.
        })
    }, [user,history]);//dependency array - when things inside these arrays changes the abc callback fnc recalls

    const value = {user}; //whenever working wioth auth context we need to have one value obj.

    return(
        <AuthContext.Provider value={value}>  
            {!loading && children}  
        </AuthContext.Provider> //fnc that accepts value - if not loading - then show children.
    );
}