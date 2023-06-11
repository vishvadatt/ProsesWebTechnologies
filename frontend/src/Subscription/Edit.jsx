import React, { useEffect, useState } from "react";
import './create.css';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


const Edit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const {id} = params;

  const [ createSubscription,setCreateSubscription] = useState({});
  const [errorMessage,setErrorMessage] = useState("");
  const [successMessage,setSuccessMessage] = useState("");

  const {userName,subscriptionName,purchaseDate,startTime,endTime} = createSubscription;

  useEffect(() => {
    const loadData = async () => {
        const response = await axios.get(`http://localhost:8001/api/fineone-subscription/${id}`);
        delete response.data.data._id
        setCreateSubscription(response.data.data)
    }
    loadData()
  },[id]);

  const onInputChange = (e) => {
    setCreateSubscription({...createSubscription,[e.target.name] : e.target.value});
  }

  const onSubmit = async (e) => {
    try {
        if(id){
            e.preventDefault()
            const result = await axios.put(`http://localhost:8001/api/update-subscription/${id}`,createSubscription);
            console.log("result...",result);
            if(result.data.code == 200){
                setErrorMessage("")
                setSuccessMessage("Update Successfully")
                setTimeout(() => {
                navigate('/')
                },1500)
            }
        }
      
    } catch (e) {
      setErrorMessage(e?.response?.data?.message);
    }
    
  }

  return (
    <>
      <div>
        <div>
          <h4>Purchase Subscription</h4>
        </div>
        <form onSubmit={(e) => onSubmit(e)}>
        {errorMessage ? <div style={{color : "red"}}>{errorMessage}</div> : <div style={{color : "green"}}>{successMessage}</div>}
          <label>UserName</label>
          <input type="text" placeholder="UserName" name="userName" value={userName} onChange={(e) => onInputChange(e)} />
          <label>Subscription Name</label>
          <input type="text" placeholder="subscription Name" disabled name="subscriptionName" value={subscriptionName} onChange={(e) => onInputChange(e)} />
          <label>Date</label>
          <input type="date" name="purchaseDate" value={purchaseDate} disabled onChange={(e) => onInputChange(e)} />
          <label>Start Time</label>
          <input type="time"  name="startTime" value={startTime} disabled onChange={(e) => onInputChange(e)} />
          <label>End Time</label>
          <input type="time"  name="endTime" value={endTime} disabled onChange={(e) => onInputChange(e)} />
          <button type="submit" style={{width : "100%"}}>Subscription</button>
        </form>
      </div>
    </>
  );
};

export default Edit;
