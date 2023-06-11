import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Create from './Subscription/CreateSubscription';
import {BrowserRouter as Router,Route, Routes  } from "react-router-dom";
import ListSubscription from './Subscription/SubscriptionList';
import Edit from './Subscription/Edit';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<ListSubscription />}/>
          <Route path='/create-subscription' element={<Create />}/>
          <Route path='/edit/:id' element={<Edit />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
