import React, { useState } from "react";
import './create.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Create = () => {
  const navigate = useNavigate();
  const [ createSubscription,setCreateSubscription] = useState({
    userName : "",
    subscriptionName : "",
    purchaseDate : "",
    startTime : "",
    endTime : ""
  });
  const [errorMessage,setErrorMessage] = useState("");
  const [successMessage,setSuccessMessage] = useState("");

  const {userName,subscriptionName,purchaseDate,startTime,endTime} = createSubscription;

  const onInputChange = (e) => {
    setCreateSubscription({...createSubscription,[e.target.name] : e.target.value});
  }

  const onSubmit = async (e) => {
    console.log("call this");
    try {
      e.preventDefault()
      const result = await axios.post('http://localhost:8001/api/create-subscription',createSubscription);
      console.log("result...",result);
      if(result.data.code == 200){
        setErrorMessage("")
        setSuccessMessage("you purchase Subscription Successfully")
        setTimeout(() => {
          navigate('/')
        },1500)
      }
      
    } catch (e) {
      setErrorMessage(e?.response?.data?.message);
    }
    
  }
console.log("errorMessage..",errorMessage);
  return (
    <>
      <div>
        <div>
          <h4>Purchase Subscription</h4>
        </div>
        <form onSubmit={(e) => onSubmit(e)}>
        {errorMessage ? <div style={{color : "red"}}>{errorMessage}</div> : <div style={{color : "green"}}>{successMessage}</div>}
         
          <input type="text" required placeholder="UserName" name="userName" value={userName} onChange={(e) => onInputChange(e)} />
          <label>Subscription Name</label>
          <input type="text" required placeholder="subscription Name"  name="subscriptionName" value={subscriptionName} onChange={(e) => onInputChange(e)} />
          <label>Date</label>
          <input type="date" required name="purchaseDate" value={purchaseDate} onChange={(e) => onInputChange(e)} />
          <label>Start Time</label>
          <input type="time" required  name="startTime" value={startTime} onChange={(e) => onInputChange(e)} />
          <label>End Time</label>
          <input type="time" required  name="endTime" value={endTime} onChange={(e) => onInputChange(e)} />
          <button type="submit" style={{width : "100%",backgroundColor : "lightblue"}}>Subscription</button>
        </form>
      </div>
    </>
  );
};

export default Create;
