import React from 'react'

import './Message.css'

import ReactEmoji from 'react-emoji'

//const moment = require('moment');

const Message = ({ message: {user, text, showTime}, name}) => {
    let isSentByCurrentUser =false;

    const trimedName = name.trim().toLowerCase();

    if(user === trimedName) {
        isSentByCurrentUser = true;
    }


    // for Calculating time here
   /* const currentDate = moment().format('DD-MM-YYYY, HH:mm:ss'); */
    //const currentDate = moment().format('MMMM Do YYYY, h:mm:ss a'); */
   /* const currentTime = moment().subtract(1, 'day').fromNow(); */
   

    return (
        isSentByCurrentUser 
        ? (
               <div className='messageContainer justifyEnd'>
                <div className='messageBox backgroundBlue'>
                <p className=' sentText pr-10'>   
                    <span>
                {trimedName}
                </span>
                <span className='datetext'>
              { /* {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit' , second:'2-digit'})} */}
                
             {/* { new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })} */}
             {showTime}
                </span>
                </p>
                    <p className='messageText colorWhite'>{ReactEmoji.emojify(text)}</p>
                </div>
               </div>
        )
        : (
            <div className='messageContainer justifyStart'>
          
            <div className='messageBox backgroundLight'>
            <p className='sentText pr-10'>   
                    <span>
                {trimedName}
                </span>
                <span className='datetext'>
              { /* {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit' , second:'2-digit'})} */}
                
             {/* { new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })} */}
             {showTime}
                </span>
                </p>
                <p className='messageText colorDark'>{ReactEmoji.emojify(text)}</p>
            </div>
            <p className='sentText pl-10'>{user}</p>
            
           </div>
        )
    )
}

export default Message