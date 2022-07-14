import React, {useRef, useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {Avatar, ChatEngine } from 'react-chat-engine';
import {auth} from '../components/firebase';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// moreover we need to call caht engine api's to create users from the loged in users.


const Chats = () => {
    const history = useHistory(); // created a hook to use down below.
    const {user} = useAuth();
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        await auth.signOut();
        history.push('/');              //rediects to login form
    }

    const getFile = async(url) => {
        const response = await fetch(url);
        const data = await response.blob();  // .blob transfer a file in binary format

        return new File([data], "userphoto.jpg", {type: 'image/jpeg'})
    }
    useEffect(() => {                   //if there is no user redirect it login
        if(!user){
            history.push('/');
            return;
        }

        axios.get("https://api.chatengine.io/users/me/", { //axios is used to send async HTTP reqs
            headers:{
                "project-id": process.env.REACT_APP_CHAT_ENGINE_ID,
                "user-name": user.email,
                "user-secret":user.uid,
            }
        })
        .then(() => {
            setLoading(false);
        })
        .catch(() => {      // waht is thers no chat profile so to create one we have used this.
            let formdata = new FormData();
            formdata.append('email', user.email);
            formdata.append('username', user.email);
            formdata.append('secret', user.uid);

            getFile(user.photoURL)
                .then((avatar) => {
                    formdata.append('avatar', avatar, avatar.name)

                    axios.post("https://api.chatengine.io/users/",  //post method if the user doesnt exist.
                        formdata,
                        {headers: {'private-key': process.env.REACT_APP_CHAT_ENGINE_KEY}}
                    )
                    .then(() => setLoading(false))  // if user creation is successful then stop loading.
                    .catch((error) => console.log(error))  //else show and err
                })
        })

    },[user, history]);


    if (!user || loading) return 'Loading...';
    return (
        <div className='chats-page'>
            <div className='nav-bar'>
                <div className='logo-tab'>
                    Talk it out .. !
                </div>
                <div onClick={handleLogout} className='logout-tab'>
                    logout
                </div>
            </div>
            
            <ChatEngine                         //using chat engine from chatengine.io            
                height = 'calc(100vh-60px)'
                projectID={process.env.REACT_APP_CHAT_ENGINE_ID}  // this should be a shifted to env vars
                userName={user.email}
                userSecret={user.uid}
            />
        </div>
    );
}

export default Chats;