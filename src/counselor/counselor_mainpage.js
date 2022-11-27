import React, {useEffect, useState, Component, useRef} from "react";
import {useNavigate} from "react-router-dom";
import "./counselor_mainpage.css";
import axios from "axios";
import {useLocation} from "react-router-dom";
import URLsetting from "../Setting/URLsetting";
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
function Mode1GrayBox ({start,end,time,id,people}){
    return (
        <div className="mode1_grid_gray_box">
            {start}
            {people}
        </div>
    )
}
const Mode1 = () => {
    const [Mode1_data,setMode1Data]=useState([]);
    useEffect(()=> {
        axios
        .get(URLsetting.LOCAL_API_URL+"consulting/list", {
            params: {
                clientID: "cmoh4135"
            }
        })
        .then((response) => {
            setMode1Data(response.data);
        })
    },[])
    return (
        <> < div className = "center_top" > <div className="text_box">
            <p className="center_top_text" id="todayCallCount">오늘 상담 건수
                <span className="variable_bold" id="today_call_count"></span>
                건</p>
            <p className="center_top_text" id="todayCallTime">오늘 상담 시간
                <span className="variable_bold" id="today_call_time"></span>
            </p>
            <p className="center_top_text" id="todayCallTime">대기 고객
                <span className="variable_bold" id="waiting_customer_count"></span>
                명</p>
        </div>
    </div>
    <div className="line"></div>
    <div className="center_bottom">
        <div className="call_record_list_box">
            <p className="bigText">상담 내역</p>
            <div className="mode1_grid">
            {
                        Mode1_data.map((tmp) => (
                            <Mode1GrayBox
                                start={tmp.start}
                                end={tmp.end}
                                time={tmp.time}
                                id={tmp.id}
                                people={tmp.counselorName}/>
                        ))
                    }
            </div>
        </div>
        <div class='v-line'></div>
        <div className="todayKeyword">
            <p className="emotion_wordcloue_text">happy</p>
            <div className="word_cloud" id="positive_wordcloud">좋아용</div>
            <p className="emotion_wordcloue_text">angry</p>
            <div className="word_cloud" id="negative_wordcloud">안좋아요</div>
        </div>
    </div>
</>
    )
}
function GetDiffTime ({aa}){
    const [diffTime, setDiffTime] = useState(0);
    useEffect(()=> {
        // 현재 시간 대비 대기 시간 구하기
        const diffInterval = setInterval(()=>{
            setDiffTime(
                parseInt((new Date()-aa)/1000)
            )
        }, 200);
        return() => clearInterval(diffInterval);
    },[]);
    return parseInt(diffTime / 60).toString().padStart(2,"0") + ':' + parseInt(diffTime % 60).toString().padStart(2,"0")
}
function MakeWaitingList ({room,client, counselor, clientName,counselorName, time}){
    const navigate=useNavigate();
    const cur_style=useRef("waiting_list_bar1");
    console.log(room+clientName);
    if(client!=="null" && counselor===null){
    return (
        <div className={cur_style.current} onClick={() => navigate('/counselor/room/'+room, {
            state: {
                Room:room,
                Name: userName,
                Id: userID
            }
        })}>
                <p className="bar_text_name">이름 {clientName}</p>
                <p className="bar_text_time">대기 시간 {<GetDiffTime aa={time}/>}
                </p>
        </div>
    )
    }
}
function MakingEmotionChangeSentence (){
    return;
}
const Mode2 = () =>{
    const [isActive,setActive]=useState(true);
    const [room_number, setRoomNumber] = useState([]);
    const [ptImg, setPositiveImg] = useState();
    const [ntImg, setNegativeImg] = useState();
    const [enters, setEnters]=useState([]);
    useEffect(()=> {
        setEnters(ModelSample);
        axios.get(URLsetting.LOCAL_API_URL+"consulting/room-list")
        .then((response)=> {
            setRoomNumber(response.data);
            console.log(response.data);
        })
        axios
            .get(URLsetting.LOCAL_API_URL+"consulting/wordcloud/angry", {
                params: {
                    id: 155
                }
            })
            .then((response) => {
                setNegativeImg(response.data);
            })
    },[])

    const toggleClass = () => {
        var toggler = document.querySelector('.toggle-switch');
        toggler.classList.toggle('active');
    }
    
   return(
    <div className="after_calling_center">
        <div className="after_calling_center_bars">
            <button className="after_calling_go_back">back</button>
            <div className="after_calling_info_bar">
                <p className="after_calling_info_text">상담 일시 : 2022년 09월 29일 19:07:06 30분</p>
            </div>
        </div>
        <div className="after_calling_center_top">
            <div className="after_calling_keywords">
                <div className="positive_keyword">긍정 키워드
                    <img src={`data:image/jpeg;base64,${ntImg}`} alt="My Image" className="wordcloud_img"></img>
                </div>
                <div class='v-line'></div>
                <div className="negative_keyword">부정 키워드
                    <img src={`data:image/jpeg;base64,${ntImg}`} alt="My Image"className="wordcloud_img"></img>
                </div>
            </div>
        </div>
        <div className="after_calling_center_bottom">
            <div className="after_calling_center_bottom_left">
                <div className="after_search_box">
                        <input type="text" className="after_search_txt" name=""placeholder="검색할 것을 입력하세요 !"></input>
                    </div>
                    <div className="chatting">
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
                </div>
                <div className="after_calling_center_bottom_right">
                    <div className="after_changeEmotion">
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
   
  /*
   return (
    <>
    <div className="mode2_top">
        대기중인 고객
    </div>
    <div className="mode2_grid">
        {
    room_number.map((tmp) => (
                            <MakeWaitingList
                                room={tmp.roomId}
                                client={tmp.client}
                                counselor={tmp.counselor}
                                clientName={tmp.clientName}
                                counselorName={tmp.counselorName}
                                time={tmp.createTime}/>
                        ))
    }
    </div>
    </>
)*/
}
var userName;
var userID;
var userEmail;
const CounselorMainPage = () => {
    const location = useLocation();
    userName = location.state.Name;
    userID= location.state.Id;
    userEmail=location.state.Email;
    const [current_mode, setMode] = useState(2);
    const leftbar_backgroundcolor = (number) => {
        for (var i = 1; i < 6; i++) {
            var tmp = "select" + i;
            console.log(tmp);
            if (i != number) {
                document
                    .getElementById(tmp)
                    .style['font-weight'] = "lighter";
                document
                    .getElementById(tmp)
                    .style['background'] = "transparent"
            } else {
                document
                    .getElementById(tmp)
                    .style['font-weight'] = "normal";
                document
                    .getElementById(tmp)
                    .style['background'] = "rgba(53, 157, 217, 0.17)"
            }
        }
        setMode(number);
        console.log(number);
    }
    function ModeChange() {
        if (current_mode == 1) {
            return (<Mode1/>)
        }
        else if(current_mode==2){
            return (<Mode2/>)

        }
    }
    return (
        <div className="counselor_cover">
            <div className="left_bar_counselor_mainpage">
                <p className="lincall">LINCALL</p>
                <p className="counselor_text">상담사</p>
                <p className="nameFontStyle">{userName}</p>
                <div className="left_bar_gray_box_counselor">
                    <div className="currentStateStyle">온라인</div>
                </div>
                <div className="counselor_button_grouping">
                    <button
                        className="left_bar_text_font2"
                        value="1"
                        id="select1"
                        onClick={e => leftbar_backgroundcolor(e.target.value)}>메인 페이지</button>
                    <button
                        className="left_bar_text_font"
                        value="2"
                        id="select2"
                        onClick={e => leftbar_backgroundcolor(e.target.value)}>상담 시작</button>
                    <button
                        className="left_bar_text_font"
                        value="3"
                        id="select3"
                        onClick={e => leftbar_backgroundcolor(e.target.value)}>상담 내역 조회</button>
                    <button
                        className="left_bar_text_font"
                        value="4"
                        id="select4"
                        onClick={e => leftbar_backgroundcolor(e.target.value)}>
                        마이페이지
                    </button>
                    <button
                        className="logout"
                        id="select5"
                        value="5"
                        onClick={e => leftbar_backgroundcolor(e.target.value)}>로그 아웃</button>
                </div>
            </div>
            <div className="center_box">
                <ModeChange/>
            </div>
            <div className="right_bar_counselor_mainpage">
                <p className="bigText" id="memo">
                    MEMO
                </p>
            </div>
        </div>
    );
};
export default CounselorMainPage;