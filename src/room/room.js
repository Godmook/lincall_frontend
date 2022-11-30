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
const CreateEmotionChange = ({time,text,keyword}) => {
    const obj=JSON.parse(keyword);
    console.log(obj);
    let str=""+text;
    obj.forEach((element) => {
        str=str.replace(element,"<span className="+'"boldText">'+element+"</span>");
    })
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML=str;
    console.log(tempDiv);
    return (
        tempDiv
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
const ManualPage = ({tt}) => {
    if(!tt){
        return (
            <>
            <span className="big_title_text">1. 응대 시작</span><br></br>
            <span className="color_green">✔ 첫인사</span><br/>
            - 인사말, 성명 모두 정확한 발음으로 명확하고 친절하게 첫인사 전달<br/>
            - 부득이 전화 수신이 늦어질 경우 양해 안내<br/>
            <br></br>

            <span className="big_title_text">2. 문의 탐색</span><br></br>
            <span className="color_green">✔ 신속한 문의 파악</span><br/>
            •시민의 문의 사항을 집중하여 끝까지 듣고, 재 진술을 통한 정확한 니즈 파악 → 상담사 신뢰성 확보 <br/>
            •말 겹침 시 정확한 문의 탐색을 위해 우선 듣기로 신속한 문의 파악 <br/>
            •시민의 문의 사항을 속단하고 예측하여 문의 파악이 잘못 되지 않도록 주의 <br/>
            •문의 내용을 파악하였다고 하여도 의도적으로 중간 개입하거나, 말 겹침이 일어나지 않도록 주의<br/>
            <br></br>
            </>
        )
    }
    else{
        return (
            <>
                                <span className="big_title_text">3. 상담 진행</span><br></br>
                    <span className="color_green">✔ 정확하고 이해하기 쉬운 설명</span><br/>
                    •정확하지 않은 추측성 정보를 안내하거나, 모호한 표현을 사용하지 않고 자료로 확인된 정확한 정보를 기반으로 안내 <br/>
                    •어려울 수 있는 행정 정보에 대해 시민의 눈높이에 맞춘 자세한 설명 진행 → 시민의 이해 여부 확인 후 시민이 이해하지 못할 경우 다른 방식으로 설명 <br/>
                    •부서 전화번호, 이메일 등 메모가 필요한 사항을 안내할 때에는 분명한 발음으로 응대 <br/>
                    •담당 부서 연결이 필요할 때에는 사유 선 안내 후 연결 진행 <br/>
                    •즉시 처리ㆍ안내가 어려운 사항에 대해서는 관련 유관기관 및 문의처 추가 안내<br/>

                    <span className="color_green">✔  정중한 태도</span><br/>
                    •정중한 억양 및 어투를 사용하며, 시민의 상황에 맞는 억양과 어투 사용 <br/>
                    •시민의 과도한 요구에도 개인의 감정 표현 자제 <br/>
                    •지시형/명령형 어투를 사용하기보다, 권유형/청유형 어투를 사용하여 정중한 태도 유지 <br/>
                    •대상을 특정하지 않는 습관성 반말투 사용 주의<br/>

                    <span className="color_green">✔ 경청 및 공감 </span> <br/>
                    •시민이 제기하는 문제에 대해 함께 문제로 인식하는 태도 유지 <br/>
                    •시민의 문의 사항에 대해 적절한 호응어 사용<br/>
                    <br></br>

                    <span className="big_title_text">4. 종결</span><br></br>
                    <span className="color_green">✔문제 해결 확인 및 끝인사 </span>  <br/>
                    •시민의 문의 사항을 즉각적으로 해결치 못하는 경우 유감의 표현 사용 <br/>
                    •시민의 상황에 맞는 공감의 인사말 사용 후 종결 <br/>
            </>
        )
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
    const toggleClass = () => {
        var toggler = document.querySelector('.toggle-switch');
        toggler.classList.toggle('active');
        console.log(document.getElementById('userAudio').volume);
        if(isMikeOpen.current){
        document.getElementById('userAudio').volume=0;
        isMikeOpen.current=false;
        }
        else{
            document.getElementById('userAudio').volume=1;
            isMikeOpen.current=true;
        }
    }
    const navigate=useNavigate();
    const [voiceLevel, setVoiceLevel] = useState(0); 
    const isMikeOpen = useRef(true);
    const [current_message,setCurrentMessage]= useState(0);
    const [current_emotion,setCurrentEmotion] = useState("평온");
    const location = useLocation();
    roomID = location.state.Room;
    const senderID= location.state.Id;
    const senderName=location.state.Name;
    const senderEmail=location.state.senderEmail
    const [enters, setEnters]=useState([]);
    const [enters2, setEnters2]=useState([]);
    const [question,setQuestion] = useState(0);
    const [answer,setAnswer] = useState("");
    const scrollRef = useRef();
    const isKeyDown = useRef(false);
    const [isFirstPage,setFirstPage] = useState(0);
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
                    stomp.disconnect();
                    document.getElementById('bbbaaa').style.display="flex";
                    let tmp={
                        type:"notice",
                        message:"고객님이 상담을 종료하였습니다.",
                        time:new Date().getTime(),
                        emotion: "none",
                        question: "",
                        answer: ""
                    }
                    setEnters(enters => [...enters, tmp])
                }
                else if((msg.body).includes('activate')){
                    document.getElementById('userAudio').autoPlay="false";
                    toggleClass();
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
                        document.getElementById('ggggg').innerHTML='';
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
                            <div className="left2"><p className="left2_text">목소리 크기</p><p className="volume"><ShowVoiceLevel level={current_message}/></p></div>
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
                                                time={tmp.time}
                                                text={tmp.text}
                                                keyword={tmp.keyword}/>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right_bar_counselor_mainpage_calling_box">
                    <button className="exit_button" id="bbbaaa" onClick={()=> navigate('/counselormain',{
            state:{
                Name:senderName,
                Id:senderID,
                Email:senderEmail
            }
        })}>상담 종료</button>
                    <div className="right_bar_counselor_mainpage_calling">
                    <p className="bigText" id="memo">
                            기본 응대 매뉴얼
                    </p>
                    <p className="manual_text">
                    <ManualPage tt={isFirstPage}/>
                    </p>
                    </div>
                </div>
                <MakeAnswer answer={answer}/>
            </div>
        </div>
    )
}

export default Room