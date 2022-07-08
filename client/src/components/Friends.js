import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { BsFillTrashFill, BsFillChatTextFill, BsPlusCircle } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import useInput from "../hooks/useInput";
import AddFriend from "./AddFriend";
import { getFriends, removeFriend } from "../store/friends";
import SendMessage from "./SendMessage";

const Friends = ({ show, setShow }) => {
  const dispatch = useDispatch()
  const friends = useSelector(state => state.friends)
  const darkMode = useSelector(state => state.darkMode)
  const searchFriend = useInput()
  const [filteredFriends, setFilteredFriends] = useState([])
  const showedFriends = (searchFriend.value.length>=3) ? filteredFriends : friends
  const [addFriend,setAddFriend] = useState(false)
  const [sendMessage,setSendMessage] = useState({})
  
  const handleDeleteFriend = (id) => {
    dispatch(removeFriend(id))
    .then(() => dispatch(getFriends()))
  }

  // buscar amigos
  useEffect(() => {
    if(searchFriend.value.length >= 3) {
      const newFriendList = []
      const fullnames = friends.map(friend => {
        return {
          _id: friend._id,
          fullname: `${friend.name} ${friend.surname}`,
          name: friend.name,
          surname: friend.surname,
          email: friend.email
        }
      })
      fullnames.forEach(friend => 
        friend.fullname.toLowerCase().includes(searchFriend.value.toLowerCase())
        ? newFriendList.push(friend) 
        : null
      )
      setFilteredFriends(newFriendList)
    }
  },[searchFriend.value])

  if(addFriend) return <AddFriend show={show} setShow={setShow} setAddFriend={setAddFriend} friends={friends} />
  if(sendMessage.email) return <SendMessage show={show} setShow={setShow} setSendMessage={setSendMessage} mailTo={sendMessage} />

  return (
    <>
      <Modal show={show} onHide={()=>setShow(false)} centered>
        <Modal.Header className={darkMode? "dark-mode": "light"}>
          <Modal.Title style={{fontFamily:"heeboregular"}}>Amigos</Modal.Title>
          <button className="main-button" onClick={()=>{setAddFriend(true)}}><BsPlusCircle size={24}/>  Agregar </button>
        </Modal.Header>
        <Modal.Body className={darkMode? "dark-mode": "light"}>
          <form onSubmit={(e) => e.preventDefault()}>
            <input 
              className={darkMode?"dark-mode-input":"main-input"}
              type="text" 
              {...searchFriend} 
              placeholder="Buscar amigo" 
            />
          </form>
          
          <Table className={darkMode? "dark-mode": "light"} style={{fontFamily:"heeboregular",fontWeigth:700}} responsive size="sm">
          {friends[0] ? <>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {showedFriends.map((friend, i) => (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td>{`${friend.name} ${friend.surname}`}</td>
                  <td><BsFillChatTextFill 
                    style={{cursor:"pointer"}} 
                    size={20} 
                    onClick={()=>setSendMessage({fullname: `${friend.name} ${friend.surname}`, email: friend.email})}
                  /></td>
                  <td><BsFillTrashFill 
                    style={{cursor:"pointer"}} 
                    size={20} 
                    onClick={()=>handleDeleteFriend(friend._id)}
                  /></td>
                </tr>
              ))}
            </tbody> 
            </> : <tbody>No encontramos amigos. Agregalos y empieza a charlar!</tbody>}
          </Table>
        </Modal.Body>
        <Modal.Footer className={darkMode? "dark-mode": "light"}>
          <button className={darkMode?"dark-mode-black-button":"main-button-black"} onClick={()=>setShow(false)}>
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Friends;
