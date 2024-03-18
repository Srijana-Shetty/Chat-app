import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import './Chat.css';
import TextContainer from '../TextContainer/TextContainer';
import Input from '../Input/Input';
import InfoBar from '../InfoBar/InfoBar';
import Messages from '../Messages/Messages';

let socket;

const Chat = () => {
    const location = useLocation();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'http://localhost:5000'; // Update with your server URL


    const fetchMessages = async () => {
        if (room) {
            try {
                const response = await fetch(`${ENDPOINT}/messages/${room}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }
    };
    
    // Modify the useEffect hook to call fetchMessages only when the room changes
    useEffect(() => {
        fetchMessages();
    });  // to update the message in database so no dependency array is used


    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);
        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => {});

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location]);


    useEffect(() => {
        socket.on('message', (message) => {
          // Only add the message to state if it belongs to the current room
          if(message){
            setMessages( [...messages, message]);
          }
        });
    }, [messages, room]);

    const sendMessage = (e) => {
        e.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    return (
        <div className='outerContainer'>
            <div className='container'>
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
         {/*   <TextContainer /> */}
        </div>
    );
}

export default Chat;
