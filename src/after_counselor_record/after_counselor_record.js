import React, {useEffect, useState, Component, useRef} from "react";
import {useNavigate} from "react-router-dom";
import "./after_counselor_record.css"
import "../counselor/counselor_mainpage.css";
import axios from "axios";
import {useLocation} from "react-router-dom";
import URLsetting from "../Setting/URLsetting";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import {faMeh, faAngry, faSmile} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
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
    {"emotion":"angry","time":1669833533489,"type":"notice","message":" 지금부터 고객의 음성이 차단됩니다."},
    {"emotion":"none","time":1669833375098,"type":"counselor","message":" 도움을 드리지 못해서 죄송합니다 주문 톡 확인 씨 환불이 어려운 점 양해부탁드립니다"},
    {"emotion":"angry","time":3,"type":"client","message":" 야 너 내가 뭐하는 사람인줄 알아 너네 얼굴 보고도 그렇게 말할수있을거같아"},
    {"emotion":"none","time":1669833464570,"type":"counselor","message":" 고객님 욕설하시면 응답이 어렵습니다"},
    {"emotion":"angry","time":4,"type":"client","message":" 그러니까 너가 그 따위 일이나 하면서 나한테 욕 얻어먹고 있는거야. 평생 그렇게 살아라"},
    {"emotion":"none","time":1669833501674,"type":"counselor","message":" 고객님 지속적으로 욕설하시면 통화가 종료될수 있습니다"},
    {"emotion":"angry","time":5,"type":"client","message":" 매니저 받고 너네 회사가 그러니까 망하는거야"},
    {"emotion":"angry","time":1669833533489,"type":"notice","message":" 상담이 종료되었습니다."},
]
var stun_config = {
    'iceServers': [
        {
            "urls": "stun:stun.l.google.com:19302"
        }, {
            "urls": "turn:211.202.222.162:8080",
            'credential': '1234',
            'username': 'admin'
        }, {
            "urls": "stun1:stun.l.google.com:19302"
        }
    ]
}
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
function Abcd({type, time, emotion, text}) {
    console.log(type);
    const [facetype, setFaceType] = useState(faMeh);
    const [chatcolor, setChatColor] = useState("chat_normal");
    useEffect(() => {
        if (emotion === "angry") {
            setChatColor("chat_angry")
            setFaceType(faAngry);
        } else if (emotion === "happy") {
            setChatColor("chat_happy");
            setFaceType(faSmile);
        }
    }, [])
    if (type == "client") {
        return (
            <div className="chat_left_container">
                <FontAwesomeIcon icon={facetype} size="3x"/>
                <div className={chatcolor}>{text}</div>
            </div>
        )
    } else if (type == "counselor") {
        return (
            <div className="chat_right_container">
                <div className={chatcolor}>{text}</div>
                <FontAwesomeIcon icon={facetype} size="3x"/>
            </div>
        )
    } else if (type == "notice") {
        return (
            <div className="chat_container_center">
                <div className="chat_center">{text}</div>
            </div>
        )
    } else {
        return (<div>HELLO</div>)
    }
}
const AfterCounselor = () => {
    const location = useLocation();
    const start = location.state.start;
    const counselorName = location.state.counselorName;
    const clientName = location.state.clientName;
    const time = location.state.time;
    const Roomid = location.state.id;
    const counselorID = location.state.ccid;
    const counselorEmail = location.state.email;
    const [ptImg, setPositiveImg] = useState();
    const [ntImg, setNegativeImg] = useState();
    const [talkmessage, setTalkmessage] = useState([]);
    const [getangerpoint, setAngerPoint] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios
            .all([
                axios.get(
                    URLsetting.LOCAL_API_URL + "consulting/wordcloud/angry",
                    {
                        params: {
                            id: Roomid
                        }
                    }
                ),
                axios.get(
                    URLsetting.LOCAL_API_URL + "consulting/wordcloud/happy",
                    {
                        params: {
                            id: Roomid
                        }
                    }
                ),
                axios.get(URLsetting.LOCAL_API_URL + "main/dialogue", {
                    params: {
                        roomId: Roomid
                    }
                }),
                axios.get(URLsetting.LOCAL_API_URL + "main/angerPoint", {
                    params: {
                        roomId: Roomid
                    }
                })
            ])
            .then(axios.spread((res1, res2, res3, res4) => {
                setNegativeImg(res1.data);
                setPositiveImg(res2.data);
                setTalkmessage(makeTmp);
                setAngerPoint(makeTmp);
            }))
    }, [])
    return (
        <div className="after_calling_center">
            <div className="after_calling_center_bars">
                <button
                    className="after_calling_go_back"
                    onClick={() => navigate('/counselormain', {
                        state: {
                            Name: counselorName,
                            Id: counselorID,
                            Email: counselorEmail

                        }
                    })}>back</button>
                <div className="after_calling_info_bar">
                    <p className="after_calling_info_text">
                        상담 일시 : {start}
                        &nbsp; {time}분</p>
                </div>
            </div>
            <div className="after_calling_center_top">
                <div className="after_calling_keywords">
                    <div className="positive_keyword">긍정 키워드
                        <img
                            src={`data:image/jpeg;base64,${ptImg}`}
                            alt="My Image"
                            className="wordcloud_img"></img>
                    </div>
                    <div className='v-line'></div>
                    <div className="negative_keyword">부정 키워드
                        <img
                            src={`data:image/jpeg;base64,${ntImg}`}
                            alt="My Image"
                            className="wordcloud_img"></img>
                    </div>
                </div>
            </div>
            <div className="after_calling_center_bottom">
                <div className="after_calling_center_bottom_left">
                <div className="big_text">상담 내용</div>
                    <div className="chatting">
                        {
                            talkmessage.map((tmp) => (
                                <Abcd type={tmp.type} time={tmp.time} emotion={tmp.emotion} text={tmp.message}/>
                            ))
                        }
                    </div>
                </div>
                <div className="after_calling_center_bottom_right">
                <div className="big_text">감정 변화 시점</div>
                    <div className="after_changeEmotion"> 
                        {
                    getangerpoint.map((tmp) => (
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
    )
}

export default AfterCounselor