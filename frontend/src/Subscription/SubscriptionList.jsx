import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import {Pagination} from 'antd'
const ListSubscription = () => {
  const [subScription,setSubScription] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pagelimit, setPageLimit] = useState(5);
  const [totalNumber,setToalNumber] = useState(0);

  const getAllSubscription = async () => {
    const response = await axios.get(`http://localhost:8001/api/get-subscription?pageNo=${pageNo}&limit=${pagelimit}`);
    setToalNumber(response.data.data.totalCount)
    setSubScription(response.data.data.list)
  }
console.log("totalCount..",typeof totalCount);

  useEffect(() => {
    getAllSubscription()
  },[pageNo,pagelimit]);

  const deleteItem = async (id) => {
      const response = await axios.delete(`http://localhost:8001/api/delete-subscription/${id}`);
      getAllSubscription()
  }
  const onShowSizeChange = (current, pageSize) => {
    setPageLimit(pageSize);
  };
  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <div>
          <h2>Subscription Dashboard</h2>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            paddingBottom: "15px",
          }}
        >
          <Link to={"/create-subscription"} >
            Purchase Subscription
          </Link>
        </div>
        <table border={1}>
          <thead>
            <tr>
              <th>UserName</th>
              <th>Date</th>
              <th>Subscription Name</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              subScription && subScription.length > 0 ? 
                subScription.map((data,i) => {
                  return (
                    <tr key={i}>
                      <td>{data.userName}</td>
                      <td>{data.purchaseDate}</td>
                      <td>{data.subscriptionName}</td>
                      <td>{data.startTime}</td>
                      <td>{data.endTime}</td>
                      <td><Link to={`/edit/${data._id}`}>Edit</Link></td>
                      <td><Link to={"/"} onClick={() => deleteItem(data._id)}>Delete</Link></td>
                    </tr>
                  )})
               : 
              <tr><td colSpan={5}>No Found Data</td></tr>
            }
          </tbody>
        </table>
        <br />
        <Pagination 
          pageSize={pagelimit}
          total={totalNumber}
          current={pageNo}
          onChange={(value) => setPageNo(value)}
          showSizeChanger
          showQuickJumper
          onShowSizeChange={onShowSizeChange}
        />
      </div>
    </>
  )
}

export default ListSubscription