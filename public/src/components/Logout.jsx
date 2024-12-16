import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
import "./logout.css"
import LogoutIcon from '@mui/icons-material/ExitToAppTwoTone';
export default function Logout() {
  const navigate = useNavigate();
  const handleClick =  () => {
    async function fetch(){

    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }}
    fetch();


  };
  return (
      <button className="glow-on-hover" type="button" onClick={handleClick}>
      <LogoutIcon sx={{ fontSize: 40}} />
      </button>
    
  );
}

// const button = styled.button`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 0.5rem;
//   border-radius: 2rem;
//   background-color: #9a86f3;
//   border: none;
//   cursor: pointer;
//   svg {
//     font-size: 1.3rem;
//     color: #ebe7ff;
//   }
  
// `;
