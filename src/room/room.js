import React, {useEffect, useState, Component, useRef, FontAwesomeIcon} from "react";
import {useNavigate} from "react-router-dom";
import "../counselor/counselor_mainpage.css";
import "../room/room.css";
import axios from "axios";
import {useLocation} from "react-router-dom";
import URLsetting from "../Setting/URLsetting";
import SockJS from "sockjs-client";
import Stomp, { client } from "webstomp-client";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { WavRecorder } from "webm-to-wav-converter";

var stun_config ={
    'iceServers': [
        {
            "urls": "stun:stun.l.google.com:19302"
        },
        {
            "urls": "turn:211.202.222.162:8080",
            'credential' : '1234',
            'username' : 'admin'
        },
        {
            "urls": "stun1:stun.l.google.com:19302"
        },
    ]
}
const toggleClass = () => {
    var toggler = document.querySelector('.toggle-switch');
    toggler.classList.toggle('active');
}

const Createchat = ({type,message,time,emotion,question,answer}) => {
    if(type=="client"){
        return(
            <div className="chat_container_left">
                <div className="chat_left">{message}</div>
            </div>
        )
    }
    else if(type=="counselor"){
        return(
            <div className="chat_container_right">
                <div className="chat_right">{message}</div>
            </div>
        )
    }
    else if(type=="notice"){
        return(
            <div className="chat_container_center">
                <div className="chat_center">{message}</div>
            </div>
        )
    }
}
const CreateEmotionChange = ({type,message,time,emotion,question,answer}) => {
    return(
        <div className="emotion_change_sentence">{message}</div>
    )
}
var ModelSample = [
    {
        "type": "client",
        "message": "test111test111test111test111test111test111test111",
        "time": 155555555,
        "emotion" : "angry",
        "question" : "dkdkdkdk",
        "answer" : "bbbbbbbb",
},
{
    "type": "counselor",
    "message": "counselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselor",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "client",
    "message": "test111",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "client",
    "message": "test111",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "client",
    "message": "test111",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "client",
    "message": "test111",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "notice",
    "message": "notice",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "client",
    "message": "test111",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "counselor",
    "message": "this_is_counselor",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "client",
    "message": "test111",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},

]

var ModelSample2 = [
{
    "type": "client",
    "message": "counselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselor",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "counselor",
    "message": "counselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselorcounselor",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "client",
    "message": "d이거 왜 안돼",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "client",
    "message": "test111",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "client",
    "message": "test111",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "client",
    "message": "test111",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "notice",
    "message": "notice",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "client",
    "message": "test111",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "counselor",
    "message": "this_is_counselor",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},
{
    "type": "client",
    "message": "test111",
    "time": 155555555,
    "emotion" : "angry",
    "question" : "dkdkdkdk",
    "answer" : "bbbbbbbb",
},

]

const Room = () => {
    const location = useLocation();
    const roomID = location.state.Room;
    const senderID= location.state.Id;
    const [enters, setEnters]=useState([]);
    const [enters2, setEnters2]=useState([]);
    const addValue=()=>{
        var textValue={
            "type": "client",
            "message": "test111",
            "time": 155555555,
            "emotion" : "angry",
            "question" : "dkdkdkdk",
            "answer" : "bbbbbbbb",
        };
        setEnters(enters => [...enters, textValue]);
    }
    const TurnONMedia = () => {
        mediaRecorder.start();
        console.log("start!");
    }
    const Donwload = () => {
        setTimeout(function () {mediaRecorder.download()},1);
    }
    const TestTurnOFfMedia = () => {
        mediaRecorder.stop();
        const p = new Promise((resolve,reject) => {
            setTimeout(function(){resolve(mediaRecorder.getBlob())},1)
        })
        p.then(msg=>{
            let reader = new FileReader();
        let base64data;
        console.log(msg);
        reader.readAsDataURL(msg);
        reader.onloadend = () => {
            base64data = reader.result;
            
            let body = {
                roomId: roomID,
                from: "counselor",
                time: 1669302000,
                encodeStr : base64data
            };
            axios.post(URLsetting.LOCAL_API_URL+"main/addText", JSON.stringify(body), {
                headers: {
                    "Content-Type": 'application/json'
                }
            })
        }
        })
       //setTimeout(function(){console.log(blob)},3);
    
    }
console.log(ModelSample.length);
    var flag=0;
    const [mediaRecorder,setMediaRecorder] = useState();
    let remoteVideo = new MediaStream();
    useEffect(()=>{
        setEnters(ModelSample);
        setEnters2(ModelSample2);
        remoteVideo = document.getElementById('userAudio');
        const pc = new RTCPeerConnection({configuration: URLsetting.MEDIACONSTRAINTS,stun_config});
        (async () => {
            await navigator
                .mediaDevices
                .getUserMedia({audio: true, video: false})
                .then(stream => {
                    setMediaRecorder(new WavRecorder(stream));
                    stream
                        .getTracks()
                        .forEach(track => pc.addTrack(track, stream));
                })
        })().then(()=>{
            function handlerIceCandidate(e) {
                if (e.candidate) {
                    stomp.send(
                        "/pub/data",
                        JSON.stringify({type: 'ice', sender: senderID, channelId: roomID, data: e.candidate})
                    );
                    console.log("ICE State: " + pc.iceConnectionState);
                }
            }
        var socket = new SockJS("//211.202.222.162:8080/ws");
        var stomp = Stomp.over(socket);
        pc.onicecandidate = handlerIceCandidate;
        pc.addEventListener("icecandidate", handlerIceCandidate);
        pc.addEventListener('track', async (event) => {
            const [remoteStream] = event.streams;
            remoteVideo.srcObject = remoteStream;
        })
        stomp.connect({}, function (frame) {
            console.log("haha");
            stomp.subscribe("/sub/room/" + roomID, function (msg) {
                if ((msg.body).includes('join')) {} else {
                    var tmp = JSON.parse(msg.body);
                    console.log(tmp.type);
                    if (tmp.type == "offer") {
                        flag=1;
                        pc.setRemoteDescription(tmp.data)
                        pc
                            .createAnswer({mandatory: { OfferToReceiveAudio: true, OfferToReceiveVideo: false }})
                            .then((answer) => pc.setLocalDescription(answer))
                            .then(() => {
                                stomp.send(
                                    "/pub/data",
                                    JSON.stringify({type: 'answer', sender: senderID, channelId: roomID, data: pc.localDescription})
                                )
                            })
                    } else if (tmp.type == "ice") {
                        if (tmp.data) {
                            if(flag){
                                    pc.addIceCandidate(tmp.data);
                                console.log("ICE State: " + pc.iceConnectionState);
                            }
                        }
                    }
                    else if(tmp.type == "counselor" || tmp.type == "client" ||
                    tmp.type == "notice"){
                        setEnters(enters => [...enters, tmp]);
                    }
                    else if(tmp.message=="reload anger starting point"){
                        setEnters2(enters2 => [...enters2, tmp]);
                    }
                }
            })
            stomp.send(
                "/pub/join",
                JSON.stringify({type: 'counselor', sender: senderID, channelId: roomID, data: pc.localDescription})
            );
        })
    })
    },[])
    
    return(
        <div className="calling_center">
            <div className="calling_center_top">
                <div className="calling_center_top_left">
                    <div className="left1" onClick={Donwload}><p className="left1_text">고객 감정</p><p className="emotion"></p></div>
                    <div className="left2"><p className="left2_text" onClick={TurnONMedia}>목소리 크기<p className="volume"></p><p className="volume_db"></p></p></div>
                    <div className="left3"><p className="left3_text" onClick={TestTurnOFfMedia}>말 빠르기<p className="speed"></p><p className="speed_s_m"></p></p></div>
                </div>
                <div className="calling_center_top_right">
                    <div className="calling_center_top_right_question">
                        <p className="right1">Q. 주문 취소는 어떻게 해야 하나요?</p>
                    </div>
                    <div className="calling_center_top_right_answer">
                    <div className="right2">
                        1. 가게에서 주문을 접수하기 전<br/>
                        App 에서 직접 취소할 수 있습니다.<br/>
                        -경로 : 주문내역 &#8594; '취소할 주문' 클릭 &#8594; '주문 취소' 버튼 클릭<br/>
                    </div>
                    </div>                    
                </div>
            </div>
            <div className="calling_center_bottom">
                <div className="calling_center_bottom_left">
                    <div className="search_box">
                        <input type="text" className="search_txt" name=""placeholder="검색할 것을 입력하세요 !"></input>
                    </div>
                    <div className="chatting_grid">
                    {
                        enters.map((tmp) => (
                                < Createchat
                                    type={tmp.type}
                                    message={tmp.message}
                                    time={tmp.time}
                                    emotion={tmp.emotion}
                                    question={tmp.question}
                                    answer={tmp.answer}/>
                            ))
                        }
                    </div>
                </div>
                <div className="calling_center_bottom_right">
                    <div className="mute">
                        <p className="buttonMame">고객 음성 차단</p>
                        <span className="toggle-switch" onClick={toggleClass}>
                            <span className="toggle-knob"></span>
                        </span>
                    </div>
                    <div className="changeEmotion">
                        <div className="emotion_change_grid">
                        {
                            enters.map((tmp) => (
                                    < CreateEmotionChange
                                        type={tmp.type}
                                        message={tmp.message}
                                        time={tmp.time}
                                        emotion={tmp.emotion}
                                        question={tmp.question}
                                        answer={tmp.answer}/>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default Room