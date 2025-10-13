import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Provider } from 'react-redux'
import Body from "./components/Body"
import Login from "./components/Login"

import './index.css';

import appStore from "./utils/appstore"
import Feed from "./components/Feed"
import Profile from "./components/Profile"
import Connections from "./components/Connections";



function App() {


  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>

              <Route path="/" element={<Feed/>}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/connections" element={<Connections />}></Route>
              <Route path="/requests" element={<Profile />}></Route>


            </Route>

          </Routes>

        </BrowserRouter>
      </Provider>



    </>
  )
}

export default App
