import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md"
import Container from "react-bootstrap/Container"
import { AiOutlineUser } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userLogout } from '../store/user';
import { useNavigate } from 'react-router'
import { getOffices } from "../store/offices";

import Friends from './Friends'
import Favorites from './Favorites';

const NavigationBar = () => {

  const [checked, setChecked] = useState(false);
  const [toggle, setToggle] = useState(1)

  const [showFriends, setShowFriends] = useState(false);
  const [showFavs, setShowFavs] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const user = JSON.parse(localStorage.getItem('user'))
  let offices = useSelector((state) => state.offices)

  useEffect(()=>{
    dispatch(getOffices())
    .then((res) => offices = res)
  },[])

  const handleLogout = () => {
    dispatch(userLogout())
      .then(() => {
        localStorage.removeItem('user')
        return navigate("/")
      })
  }

  return (
    <>
    {
    (!user) ? "" :
    <Navbar bg={toggle === 1 ? "light" : "dark"} expand="md">
      <Container>
        <Link to={checked ? "/" : "/profile"}>
          <ToggleButton
            id="toggle-check"
            type="checkbox"
            variant="outline-secondary"
            checked={checked}
            onClick={() => setChecked(!checked)}> <AiOutlineUser /> </ToggleButton>
        </Link>

        <NavDropdown align="center" title="Oficinas" id="basic-nav-dropdown">
          <NavDropdown.Item onClick={() => setShowFavs(true)} >Oficinas Favoritas</NavDropdown.Item>
          <NavDropdown.Divider />
          {Object.values(offices).map((e, i) => (
          <NavDropdown.Item key={i} >{e.name}</NavDropdown.Item>
          )
          )}
        </NavDropdown>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" >
          <Nav className="me-auto">
            <Nav.Link href="#link">
              <ToggleButtonGroup type="checkbox" value={toggle}>
                <ToggleButton
                  id="tbg-btn-1"
                  variant={toggle === 1 ? "secondary" : "light "}
                  value={1}
                  onClick={() => setToggle(1)} >
                  <MdOutlineLightMode />
                </ToggleButton>
                <ToggleButton
                  id="tbg-btn-3"
                  variant={toggle === 1 ? "secondary" : "light "}
                  value={2}
                  onClick={() => setToggle(2)}>
                  <MdOutlineDarkMode />
                </ToggleButton>
              </ToggleButtonGroup>
            </Nav.Link>
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link onClick={() => setShowFriends(true)}>Amigos</Nav.Link>
            <Nav.Link onClick={handleLogout} href="/" >Log Out</Nav.Link>
            <Nav.Link href="#link">Reportar un problema</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Friends show={showFriends} setShow={setShowFriends} />
      <Favorites show={showFavs} setShow={setShowFavs} />
    </Navbar>}
    </>
  )
}

export default NavigationBar