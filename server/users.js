const users = [];
const rooms = [];

const addUser = ({id, name, room}) => {
  // Check if name and room are defined and are strings
  

      //Srijana Shetty = srijanashetty
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

   //  if(!rooms.includes(room)){
   //    return{error: 'room does not exist'}
   //  }

    const existingUser = users.find((user)=> user.room === room && user.name === name)

     if(existingUser){
        return{error: 'Username is taken'};
     }

     const user = {id, name, room}

     users.push(user);   //pushing user to new array
        return{user}

    }

const removeUser = (id) => {
 const index = users.findIndex((user) => user.id ===id )
  
 if(index !== -1){
    return users.splice(index, 1)[0];
 }
}

const getUser = (id) => users.find((user) => user.id === id)

const getUsersInRoom = (room) => users.filter((user) => user.room === room)

module.exports= {addUser, removeUser, getUser, getUsersInRoom}