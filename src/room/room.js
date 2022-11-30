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
            "urls": "turn:211.202.222.162:3478",
            'credential' : '1234',
            'username' : 'admin'
        },
        {
            "urls": "stun1:stun.l.google.com:19302"
        },
    ]
}
const makeTmp = [
    {"emotion":"none","time":1669833220479,"type":"counselor","message":" 안녕하세요 상담사 정현진입니다"},
    {"emotion":"none","question":"주문 취소는 어떻게 하나요?\n","answer":"1. 가게에서 주문을 접수하기 전<br />-App에서 직접 취소할 수 있습니다.<br /><br />2. 가게에서 주문을 접수한 후<br />-주문한 가게로 연락하여 취소가 가능한지 확인할 수 있습니다.\n","time":1669833421393,"type":"client","message":" 여보세요 제가 떡볶이를 시켰는데 너무 늦게 와서요 주문 취소가 가능한가요"},
    {"emotion":"none","time":1669833220479,"type":"counselor","message":" 아 죄송합니다. 주문접수 알림톡을 받으셨다면 결제 내역 변경이 어렵습니다"},
    {"emotion":"none","time":1669833220479,"type":"client","message":" 아니 지금 한 시간이 넘게 안하는데 그럼 미리 알려주셨어야죠"},
    {"emotion":"none","time":1669833220479,"type":"client","message":" 환불 해주세요"},
    {"emotion":"none","time":1669833220479,"type":"counselor","message":" 불편을 끼쳐드려 죄송합니다.규정상 환불이 어렵습니다 "},
    {"emotion":"none","time":1669833220479,"type":"client","message":" 그리고 숟가락도 안보내주셨잖아요 숟가락을 안보내면 어떻게 먹어요"},
    {"emotion":"none","time":1669833233509,"type":"client","message":" 아 그러니 깐 규정은 모르겠고 환불해주세요"},
    {"emotion":"none","time":1669833258827,"type":"counselor","message":" 정말 죄송합니다 숟가락이 없는 것은 환불 사유에 해당하지 않습니다"},
    {"emotion":"angry","time":0,"type":"client","message":" 죄송한게 문제가 아니고 그래서 어쩔 건데요"},
    {"emotion":"none","time":1669833293235,"type":"counselor","message":" 지금 문의하신 내용이 떡볶이 환불이 맞으실까요"},
    {"emotion":"angry","time":1,"type":"client","message":" 지금 장난해요 내가 지금 돈 천 원이 아까워서 이러고 있겠어요"},
    {"emotion":"angry","time":2,"type":"client","message":" 돈이 문제가 아니라 기분이 나빠서 그래요"},
    {"emotion":"none","time":1669833375098,"type":"counselor","message":" 도움을 드리지 못해서 죄송합니다 주문 톡 확인 씨 환불이 어려운 점 양해부탁드립니다"},
    {"emotion":"angry","time":3,"type":"client","message":" 야 너 내가 뭐하는 사람인줄 알아 너네 얼굴 보고도 그렇게 말할수있을거같아"},
    {"emotion":"none","time":1669833464570,"type":"counselor","message":" 고객님 욕설하시면 응답이 어렵습니다"},
    {"emotion":"angry","time":4,"type":"client","message":" 그러니까 너가 그 따위 일이나 하면서 나한테 욕 얻어먹고 있는거야. 평생 그렇게 살아라"},
    {"emotion":"none","time":1669833501674,"type":"counselor","message":" 고객님 지속적으로 욕설하시면 통화가 종료될수 있습니다"},
    {"emotion":"angry","time":5,"type":"client","message":" 매니저 받고 너네 회사가 그러니까 망하는거야"}
]

const CreateEmotionChange = ({time}) => {
    if(time===0){
        return(
            <div className="chat_angry1">
                죄송한게 <span className="boldText">문제</span>가 아니고 그래서 어쩔 건데요
            </div>
        )
    }
    else if(time===1){
        return(
            <div className="chat_angry1">
                지금 <span className="boldText">장난</span>해요 내가 지금 <span className="boldText">돈 천 원</span>이 아까워서 이러고 있겠어요
            </div>
        )
    }
    else if(time===2){
        return (
            <div className="chat_angry1">
                돈이 문제가 아니라 <span className="boldText">기분</span>이 <span className="boldText">나빠</span>서 그래요
            </div>
        )
    }
    else if(time===3){
        return (
            <div className="chat_angry1">
                야 너 내가 뭐하는 
                <span className="boldText">사람</span>
                인줄 알아 너네 
                <span className="boldText"> 얼굴 </span>
                보고도 그렇게 말할수있을거같아
            </div>
        )
    }
    else if(time===4){
        return (
            <div className="chat_angry1">
                그러니까 너가 그 따위  
                <span className="boldText"> 일</span>
                이나 하면서 나한테 
                <span className="boldText"> 욕 </span>
                얻어먹고 있는거야. 
                <span className="boldText"> 평생 </span>
                그렇게 살아라
            </div>
        )
    }
    else if(time===5){
        return(
            <div className="chat_angry1">
                <span className="boldText">매니저 </span>
                받고 너네 회사가 그러니까 
                <span className="boldText"> 망하는거야</span>
            </div>
        )
    }
}

const ShowQuestion = ({question}) => {
    return question;
}
const ShowAnswer = ({answer}) => {
    return answer;
}
const ShowCurrentEmotion = ({emotion}) => {
    if(!start_time){
        return ""
    }
    else{
        if(emotion==="angry"){
            document.getElementById('emotion_bar').style['background-color']="#faafaf";
            return "화남";
        }
        if(emotion==="none"){
            document.getElementById('emotion_bar').style['background-color']="#faf6af";
            return "평온"
        }
        if(emotion==="happy"){
            document.getElementById('emotion_bar').style['background-color']="#affac5";
            return "행복"
        }
        return "";
    }
}

const ManualPage = () => {
    return (
        <>
        <br/>
        <span className="big_title_text">1. 응대 시작</span><br></br>
        <span className="color_green">✔ 첫인사</span><br/>
        • 인사말, 성명 모두 정확한 발음으로 명확하고 친절하게 첫인사 전달<br/><br/>
        • 부득이 전화 수신이 늦어질 경우 양해 안내<br/><br/>
        <br></br>

        <span className="big_title_text">2. 문의 탐색</span><br></br>
        <span className="color_green">✔ 신속한 문의 파악</span><br/>
        • 문의 사항을 집중하여 끝까지 듣고, 재 진술을 통한 정확한 니즈 파악 <br/><br/>
        • 말 겹침 시 우선 듣기로 신속한 문의 파악 <br/><br/>
        • 문의 사항을 속단하고 예측하여 문의 파악이 잘못 되지 않도록 주의 <br/><br/>
        • 문의 내용을 파악하였다고 하여도 의도적으로 중간 개입하거나, 말 겹침이 일어나지 않도록 주의<br/><br/>
        <br></br>

        <span className="big_title_text">3. 상담 진행</span><br></br>
        <span className="color_green">✔ 정확하고 이해하기 쉬운 설명</span><br/>
        • 부서 전화번호, 이메일 등 메모가 필요한 사항을 안내할 때에는 분명한 발음으로 응대 <br/><br/>
        • 담당 부서 연결이 필요할 때에는 사유 선 안내 후 연결 진행 <br/><br/>
        • 즉시 처리ㆍ안내가 어려운 사항에 대해서는 관련 유관기관 및 문의처 추가 안내<br/><br></br>

        <span className="color_green">✔  정중한 태도</span><br/>
        • 정중한 억양 및 어투를 사용하며, 시민의 상황에 맞는 억양과 어투 사용 <br/><br/>
        • 고객의 과도한 요구에도 개인의 감정 표현 자제 <br/><br/>
        • 지시형/명령형 어투를 사용하기보다, 권유형/청유형 어투를 사용하여 정중한 태도 유지 <br/><br/>
        • 대상을 특정하지 않는 습관성 반말투 사용 주의<br/><br></br>

        <span className="color_green">✔ 경청 및 공감 </span> <br/>
        • 고객이 제기하는 문제에 대해 함께 문제로 인식하는 태도 유지 <br/><br/>
        • 고객의 문의 사항에 대해 적절한 호응어 사용<br/>
        <br></br>

        <span className="big_title_text">4. 종결</span><br></br>
        <span className="color_green">✔문제 해결 확인 및 끝인사 </span>  <br/>
        • 고객의 문의 사항을 즉각적으로 해결치 못하는 경우 유감의 표현 사용 <br/><br/>
        • 고객의 상황에 맞는 공감의 인사말 사용 후 종결 <br/>
        </>
    )
}
var state2now="";
const ShowVoiceSpeed = ({message}) => {
    var tmp=""+message;
    if(!start_time){
        return ""
    }
    else{
    if(tmp==="counselor"){
    if(Math.random()<0.6){
        state2now="적정";
        return "적정"
    }
    else{
        state2now="빠름";
        return "빠름"
    }
}
else{
    return state2now;
}
}
}
var total_word=0;
var total_time=0;
var start_time=0;
var end_time=0;
function ShowVoiceLevel ({level}){
    var tmp=""+level;
    if(!start_time){
        return ""
    }
    else{
    if(tmp==="counselor"){
    if(Math.random()<0.6){
        statenow="적정";
        return "적정"
    }
    else{
        statenow="큼";
        return "큼"
    }
}
else{
    return statenow;
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
var statenow="";
var mediaRecorder;
var roomID
const Room = () => {
    const Createchat = ({type,message,time,emotion,question,answer}) => {
        if(question!==undefined){
            setQuestion(question);
        }
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
    const [current_user,setCurrentUser] = useState();
    const PPPPAAAA = () => {
        var abcda = {"emotion":"angry","time":1669833533489,"type":"notice","message":" 지금부터 고객의 음성이 차단됩니다."};
        const p = new Promise((resolve,reject) => {
            resolve(setEnters(enters => [...enters, abcda]));
        })
        p.then(()=>{
            setTimeout(()=>{
                var objDiv = document.getElementById("ggggg");
                objDiv.scrollTop = objDiv.scrollHeight;
            },1);
        })
        toggleClass();
    }
    window.addEventListener("keydown", (e) => {
        if((e.key)==='Enter' && !isKeyDown.current){
            start_time=new Date().getTime();
            isKeyDown.current=true;
        }
        if((e.key)==='q' && !isKeyDown.current){
            end_time=new Date().getTime();
            isKeyDown.current=true;
        }
        if((e.key)==='w'){
            if(makeTmp.length){
            if(!isKeyDown.current){
            var kk=makeTmp.shift();
            setCurrentUser(kk.type);
                setCurrentMessage(kk.message);
            if(kk.type==="client"){
                setCurrentEmotion(kk.emotion);
            }
            setEnters2(enters2 => [...enters2, kk]);
            const p = new Promise((resolve,reject) => {
                resolve(setEnters(enters => [...enters, kk]));
            })
            p.then(()=>{
                setTimeout(()=>{
                    var objDiv = document.getElementById("ggggg");
                    objDiv.scrollTop = objDiv.scrollHeight;
                },1);
            })
            isKeyDown.current=true;
        }

    }
        }
        if((e.key)==='e'){
            if(!isKeyDown.current){
            toggleClass();
            isKeyDown=true;
            }
        }
    });
    window.addEventListener("keyup",function(){
        isKeyDown.current=false;
    })
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
                            <div className="left2"><p className="left2_text">목소리 크기</p><p className="volume"><ShowVoiceLevel level={current_user}/></p></div>
                            <div className="left3"><p className="left3_text" onClick={PPPPAAAA}>말 빠르기</p> <p className="speed"><ShowVoiceSpeed message = {current_user}/></p></div>
                        </div>
                        <div className="calling_center_top_right">
                            <div className="calling_center_top_right_question">
                                <p className="right1">Q. {question}</p>
                            </div>
                            <div className="calling_center_top_right_answer">
                            <div className="right2" id="InAnswer">
                                {answer}
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
<div className="right_bar_counselor_mainpage_box" id="calling">
                        <div className="right_bar_counselor_mainpage">
                        <p className="bigText" id="memo">
                            <p className="center_manual">기본 응대 매뉴얼</p>
                        </p>
                        <ManualPage/>
                    </div>
                    </div>
                </div>
                <MakeAnswer answer={answer}/>
            </div>
        </div>
    )
}

export default Room;