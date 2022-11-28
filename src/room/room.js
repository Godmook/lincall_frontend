import React, {useEffect, useState, Component, useRef} from "react";
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
import { faMeh,faAngry, faSmile } from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { watchStreamAudioLevel } from 'stream-audio-level';

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
    const [facetype,setFaceType] = useState(faMeh);
    const [chatcolor,setChatColor] = useState("chat_normal");
    useEffect(()=> {
        if(emotion==="angry"){
            setChatColor("chat_angry")
            setFaceType(faAngry);
        }
        else if(emotion==="happy"){
            setChatColor("chat_happy");
            setFaceType(faSmile);
        }
    },[])
    if(type=="client"){
        return(
            <div className="chat_left_container">
                <FontAwesomeIcon icon={facetype} size="3x"/>
                <div className={chatcolor}>{message}</div>
            </div>
        )
    }
    else if(type=="counselor"){
        return(
            <div className="chat_right_container">
                <div className={chatcolor}>{message}</div>
                <FontAwesomeIcon icon={facetype} size="3x"/>
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

const ShowQuestion = ({question}) => {
    return question;
}
const ShowAnswer = ({answer}) => {
    return answer;
}
const ShowVoiceSpeed = ({message}) => {
    total_time+=(end_time-start_time);
    let result = message.toString().replace(/ /g, '');
    total_word+=result.length;
    return parseInt(total_word/total_time).toString() + "음절/s";
}
var total_word=0;
var total_time=0;
var start_time=0;
var end_time=0;
function ShowVoiceLevel ({level}){
    if(level<10)return "낮음";
    else if(level<40) return "적정"
    else return "높음"
}
const Room = () => {
    const [voiceLevel, setVoiceLevel] = useState(0); 
    const isMikeOpen = useRef(false);
    const [current_message,setCurrentMessage]= useState(0);
    const location = useLocation();
    const roomID = location.state.Room;
    const senderID= location.state.Id;
    const [enters, setEnters]=useState([]);
    const [enters2, setEnters2]=useState([]);
    const [question,setQuestion] = useState(0);
    const scrollRef = useRef();

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
        start_time=Math.floor(new Date().getTime() / 1000);
    }
    const TestTurnOFfMedia = () => {
        mediaRecorder.stop();
        end_time=Math.floor(new Date().getTime() / 1000);
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
                time: Math.floor(new Date().getTime()),
                encodeStr : base64data
            };
            axios.post(URLsetting.LOCAL_API_URL+"main/addText", {
                roomId: roomID,
                from: "counselor",
                time: Math.floor(new Date().getTime()),
                encodeStr : base64data
            }, {
                headers: {
                    "Content-Type": 'application/json'
                }
            })
        }
        })
       //setTimeout(function(){console.log(blob)},3);
    
    }
    var flag=0;
    const [mediaRecorder,setMediaRecorder] = useState();
    let remoteVideo = new MediaStream();
    useEffect(()=>{
        remoteVideo = document.getElementById('userAudio');
        const pc = new RTCPeerConnection({configuration: URLsetting.MEDIACONSTRAINTS,stun_config});
        (async () => {
            await navigator
                .mediaDevices
                .getUserMedia({audio: true, video: false})
                .then(stream => {
                    setMediaRecorder(new WavRecorder(stream));
                    setTimeout(
                        watchStreamAudioLevel(stream, (v)=> {
                            setVoiceLevel(parseInt(v));
                        })
                    ,100)
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
        pc.addEventListener("connectionstatechange",(event)=>{
            if(pc.iceConnectionState=="connected"){
                console.log(pc.iceConnectionState);
                stomp.send("/pub/success");
            }
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
                            }
                        }
                    }
                    else if(tmp.type == "counselor" || tmp.type == "client" ||
                    tmp.type == "notice"){

                        axios.get(URLsetting.LOCAL_API_URL+"main/angerPoint",{
                            params: {
                                roomId:roomID
                            }
                        })
                        .then((response)=>{
                            console.log(response.data);
                            setEnters2(response.data);
                        })
                        if(tmp.question !==''){
                            //질문 및 답변 처리
                            setQuestion(tmp.question);
                        }
                        setCurrentMessage(tmp.message);
                        const p = new Promise((resolve,reject) => {
                            resolve(setEnters(enters => [...enters, tmp]));
                        })
                        p.then(()=>{
                            setTimeout(()=>{
                                var objDiv = document.getElementById("ggggg");
                                objDiv.scrollTop = objDiv.scrollHeight;
                            },1);
                        })
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
        <div className="calling_page">
            <div className="calling_center">
                <audio id="userAudio" autoPlay="autoPlay" playsInline="playsInline"></audio>
                <div className="calling_center_top">
                    <div className="calling_center_top_left">
                        <div className="left1"><p className="left1_text">고객 감정</p><p className="emotion">화남</p></div>
                        <div className="left2"><p className="left2_text" onClick={TurnONMedia}>목소리 크기</p><p className="volume"><ShowVoiceLevel level={voiceLevel}/></p></div>
                        <div className="left3"><p className="left3_text" onClick={TestTurnOFfMedia}>말 빠르기</p> <p className="speed"><ShowVoiceSpeed message = {current_message}/></p></div>
                    </div>
                    <div className="calling_center_top_right">
                        <div className="calling_center_top_right_question">
                            <p className="right1">Q. {question}</p>
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
                        <div className="chatting_grid" id="ggggg">
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
                            <p className="buttonName">고객 음성 차단</p>
                            <span className="toggle-switch" onClick={toggleClass}>
                                <span className="toggle-knob"></span>
                            </span>
                        </div>
                        <div className="changeEmotion">
                            <div className="emotion_change_grid">
                            {
                                enters2.map((tmp) => (
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
            <div className="right_bar_counselor_mainpage_calling_box">
                <div className="right_bar_counselor_mainpage_calling">
                <p className="bigText" id="memo">
                        MEMO
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Room