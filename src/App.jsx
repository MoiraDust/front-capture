import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Button, Input, Form, FormGroup, Label, FormText } from "reactstrap";
import moment from "moment";

import Capture from "./Capture.jsx";

export default class App extends Component {
  state = {
    isDemo: false,
    userInfo: {
      user_info: "",
    },
  };

  checkConn = () => {
    axios
      .get("http://localhost:8080/api/face/getTest")
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  forDemo = () => {
    this.setState({ isDemo: true });
  };

  handleUpload = () => {
    if (this.state.img === "") {
      window.alert("please choose a picture and click the confirm first");
    }
    console.log("Upload", this.state);
    (async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/face/postFace",
          {
            img: this.state.img,
          }
        );
        if (res.status === 200) {
          console.log(res.data);
          /* window.location.reload();
          if (res.data === "success") {
          } else {
            window.alert("unknown error");
          } */
          if (res.data == "error") {
            window.alert("no permission");
          }
          const userInfo = res.data.user_list[0];
          this.setState({ userInfo: userInfo });
        }
      } catch (err) {
        console.log(err);
      }
    })();
  };

  changeImg = () => {
    var reader = new FileReader();
    var AllowImgFileSize = 2100000; //上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过2M上传失败
    //拿到上传的图片
    var file = document.getElementById("img").files[0];
    var files = file.name.split(".");
    var name = files[files.length - 1];
    var type = ["png", "jpg", "jpeg"];
    //判断图片格式
    if (type.indexOf(name) === -1) {
      window.alert(`Please do not upload .${name} picture`);
      return;
    }
    var imgUrlBase64;
    if (file) {
      //将文件以Data URL形式读入页面
      imgUrlBase64 = reader.readAsDataURL(file);
      reader.onload = function (e) {
        if (AllowImgFileSize !== 0 && AllowImgFileSize < reader.result.length) {
          window.alert("The pic should less than 2MB!");
          return;
        } else {
          const input = document.getElementById("value");
          input.value = reader.result;
        }
      };
    }
  };

  handlesubmit = () => {
    /* const input = document.getElementById("img");
    input.click(); */
    const input = document.getElementById("value");
    this.setState({ img: input.value });
  };

  checkAtt = () => {
    const userName = this.state.userInfo.user_info;
    const courseName = this.state.userInfo.group_id;
    const userId = this.state.userInfo.user_id;
    console.log(userName, courseName, userId);
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    /* const time = Date.parse(new Date()); */
    axios
      .post("http://localhost:8080/ai/api/postAttendance", {
        //api写完
        userName: userName,
        courseName: courseName,
        userId: userId,
        time:time
      })
      .then(function (response) {
        console.log("Attdance check page");
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <Capture />
        <button onClick={this.checkAtt}>CHECK ATTDENCE</button>
        <div style={{ float: "right" }}>
          For Backend Demo:
          <Input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            multiple
            id="img"
            onChange={this.changeImg}
          />
          <Input type="textarea" id="value" onChange={this.saveImgInfo}></Input>
          <Button onClick={this.handlesubmit}>Confirm</Button>
          <Button color="secondary" onClick={this.handleUpload}>
            Submit
          </Button>
        </div>
        <div>
          welcome
          {console.log("state", this.state)}
          {this.state.userInfo.user_info}
        </div>
      </div>
    );
  }
}
