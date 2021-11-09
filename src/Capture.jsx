import React, { Component } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

export default class Capture extends Component {
  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    this.state = {
      video: null,
    };
    this.detect = this.detect.bind(this);
  }

  componentDidMount() {
    // getting access to webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(
        (stream) => (this.videoTag.current.srcObject = stream),
        this.detect()
      )
      .catch(console.log);
  }

  detect = async () => {
    const videoTag = document.getElementById("videoTag");
    console.log("geeting");
    const canvas = document.getElementById("myCanvas");
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models");
    await faceapi.loadFaceLandmarkModel("/models"); 
    
    const options = new faceapi.SsdMobilenetv1Options({
      minConfidence: 0.5, // 0.1 ~ 0.9
    });

    setInterval(async () => {
      const detections = await faceapi
        .detectSingleFace(videoTag,options)
        .withFaceLandmarks();
      if (detections) {
        console.log("detection",detections);
        const displaySize = { width: videoTag.width, height: videoTag.height };
        faceapi.matchDimensions(canvas, displaySize);
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        var imgBase64 = canvas.toDataURL("image/jpeg",1);
        axios.post("http://localhost:8080/api/face/postFace", {
            imagebase64: imgBase64,
          })
          /* .then(function (response) {
            let username = response.data.data.username
             if (response.data.data.username != null) {
              console.log("人脸识别成功");
              document.getElementById("showusername").innerHTML = "你好"+username+"同学"
            }
          })
          .catch(function (error) {
            console.log(error);
          }) */;
      }
    }, 200);
  };

  render() {
    return (
      <div className="see">
        <video
          id="videoTag"
          ref={this.videoTag}
          width={500}
          height={500}
          autoPlay
        ></video>
        <canvas id="myCanvas"></canvas>
      </div>
    );
  }
}
