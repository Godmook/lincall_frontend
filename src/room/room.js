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
import $ from 'jquery';

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
const ShowCurrentEmotion = ({emotion}) => {
    if(!total_time){
        return ""
    }
    else{
        if(emotion==="화남"){
            document.getElementById('emotion_bar').style['background-color']="#faafaf";
        }
        if(emotion==="평온"){
            document.getElementById('emotion_bar').style['background-color']="#faf6af";
        }
        if(emotion==="행복"){
            document.getElementById('emotion_bar').style['background-color']="#affac5";
        }
        return emotion;
    }
}
const ShowVoiceSpeed = ({message}) => {
    let ttt= (end_time-start_time)/1000;
    total_time+=ttt;
    if(!total_time){
        return ""
    }
    else{
        console.log(end_time,start_time);
    let result = message.toString().replace(/ /g, '');
    total_word+=result.length;
    console.log("word",total_word);
    console.log("time",total_time);
    return (total_word/total_time*60).toString() + "음절/s";
    }
}
var total_word=0;
var total_time=0;
var start_time=0;
var end_time=0;
function ShowVoiceLevel ({level}){
    if(!total_time){
        return ""
    }
    else{
    if(Math.random()<0.6){
        return "적정"
    }
    else{
        return "높음"
    }
}
}
const TurnONMedia = () => {
    mediaRecorder.start();
    console.log("start!");
    start_time=new Date().getTime();
}
const TestTurnOFfMedia = () => {
    mediaRecorder.stop();
    end_time=new Date().getTime();
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
const MakeAnswer = ({answer}) =>{
    console.log(answer);
    let tmp=""+answer;
    if(tmp!==""&& tmp!=="undefined"){
    console.log("sujung before",tmp);
    tmp=tmp.replace(/\\n/g, '<br />');
    console.log("after",tmp);
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML=tmp;
    document.getElementById('InAnswer').innerHTML='';
    document.getElementById('InAnswer').appendChild(tempDiv);
    }
}
var mediaRecorder;
var roomID
const Room = () => {
    const [voiceLevel, setVoiceLevel] = useState(0); 
    const isMikeOpen = useRef(false);
    const [current_message,setCurrentMessage]= useState(0);
    const [current_emotion,setCurrentEmotion] = useState("평온");
    const location = useLocation();
    roomID = location.state.Room;
    const senderID= location.state.Id;
    const [enters, setEnters]=useState([]);
    const [enters2, setEnters2]=useState([]);
    const [question,setQuestion] = useState(0);
    const [answer,setAnswer] = useState("");
    const scrollRef = useRef();
    const isKeyDown = useRef(false);
    window.addEventListener("keydown", (e) => {
        if((e.key)==='Enter' && !isKeyDown.current){
            TurnONMedia();
            isKeyDown.current=true;
        }
        if((e.key)==='q' && isKeyDown.current){
            TestTurnOFfMedia();
            isKeyDown.current=false;
        }
    });
    var flag=0;
    let remoteVideo = new MediaStream();
    useEffect(()=>{
        remoteVideo = document.getElementById('userAudio');
        const pc = new RTCPeerConnection({configuration: URLsetting.MEDIACONSTRAINTS,stun_config});
        (async () => {
            await navigator
                .mediaDevices
                .getUserMedia({audio: true, video: false})
                .then(stream => {
                    mediaRecorder=new WavRecorder(stream);
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
                if ((msg.body).includes('join')) {} 
                else if((msg.body).includes('consulting')){
                    stomp.disconnect()
                }
                else if((msg.body).includes('activate')){
                    document.getElementById('userAudio').autoPlay="muted";
                    var toggler = document.querySelector('.toggle-switch');
                    toggler.classList.toggle('active');
                    let tmp={
                        type:"notice",
                        message:"지금부터 고객의 음성이 차단됩니다.",
                        time:new Date().getTime(),
                        emotion: "none",
                        question: "",
                        answer: ""
                    }
                    setEnters(enters => [...enters, tmp])
                }
                else if((msg.body).includes('reload anger')){
                    axios.get(URLsetting.LOCAL_API_URL+"main/angerPoint",{
                        params: {
                            roomId:roomID
                        }
                    })
                    .then((response)=>{
                        console.log(response.data);
                        setEnters2(response.data);
                    })
                }
                else {
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
                    else if(tmp.type=="counselor" || tmp.type == "client"){
                        console.log('a');
                        if(Object.keys(tmp).includes('question') && tmp.type==="client"){
                            //질문 및 답변 처리
                            setQuestion(tmp.question);
                            setAnswer(tmp.answer);

                        }
                        if(tmp.type==="client"){
                        if(tmp.emotion==="angry")
                            setCurrentEmotion("화남");
                        else if(tmp.emotion==="none"){
                            setCurrentEmotion("평온");
                        }
                        else if(tmp.emotion==="happy"){
                            setCurrentEmotion("행복");
                        }
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
        <div className="calling_page_box">
            <div className="lincall_box">
                <div className="lincall_calling">LINCALL</div>
                <div className="calling_text"> &nbsp; - 상담중</div>
            </div>
            <div className="calling_page">
                <div className="calling_center">
                    <audio id="userAudio" autoPlay="autoPlay" playsInline="playsInline"></audio>
                    <div className="calling_center_top">
                        <div className="calling_center_top_left">
                            <div className="left1" id="emotion_bar"><p className="left1_text">고객 감정</p><p className="emotion"><ShowCurrentEmotion emotion={current_emotion}/></p></div>
                            <div className="left2"><p className="left2_text" onClick={TurnONMedia}>목소리 크기</p><p className="volume"><ShowVoiceLevel level={current_message}/></p></div>
                            <div className="left3"><p className="left3_text" onClick={TestTurnOFfMedia}>말 빠르기</p> <p className="speed"><ShowVoiceSpeed message = {current_message}/></p></div>
                        </div>
                        <div className="calling_center_top_right">
                            <div className="calling_center_top_right_question">
                                <p className="right1">Q. {question}</p>
                            </div>
                            <div className="calling_center_top_right_answer">
                            <div className="right2" id="InAnswer">
                            </div>
                            </div>                    
                        </div>
                    </div>
                    <div className="calling_center_bottom">
                        <div className="calling_center_bottom_left">
                            <div className="chatting_grid" id="ggggg">
                            {
                                enters.map((tmp) => (
                                        < Createchat
                                            type={tmp.type}
                                            message={tmp.message}
                                            time={tmp.time}
                                            emotion={tmp.emotion}                                                question={tmp.question}
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
                            상황별 대처법
                    </p>
                    </div>
                </div>
                <MakeAnswer answer={answer}/>
            </div>
        </div>
    )
}

export default Room