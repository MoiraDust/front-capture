import React, { Component } from "react";
import "./App.css";
import axios from "axios";

import Capture from "./Capture.jsx"

export default class App extends Component {
  checkConn=()=>{
    axios.get("http://localhost:8080/api/face/getTest")
          .then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
  }
  render() {
    return (
      <div>
       <Capture />
       <button onClick={this.checkConn}>CHECK CONNECT</button>
      </div>
    );
  }
}
