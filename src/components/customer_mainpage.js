import React, {useEffect, useState, Component, useRef} from "react";
import {useNavigate} from "react-router-dom";
import "./customer_mainpage.css";
import axios from "axios";
import {useLocation} from "react-router-dom";
import Spinner from "../assets/spinner5.gif";
import URLsetting from "../Setting/URLsetting";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

const TimeStamp = () => {
    const [current_Time, setTime] = useState("");
    useEffect(() => {
        const myInterval = setInterval(() => {
            let current = new Date();
            let year = current.getFullYear();
            let month = current.getMonth() + 1;
            let date = current.getDate();
            let hour = current.getHours();
            let minute = current.getMinutes();
            let sec = current.getSeconds();
            setTime(
                "현재시각: " + year + "년 " + month.toString().padStart(2, "0") + "월 " + date.toString().padStart(2, "0") +
                "일 " + hour.toString().padStart(2, "0") + ":" + minute.toString().padStart(2, "0") +
                ":" + sec.toString().padStart(2, "0")
            );
        }, 1000);
        return() => clearInterval(myInterval);
    }, []);
    return (
        <div className="center_gray_box">
            <div className="timeFontStyle">{current_Time}</div>
        </div>
    );
};
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
const CustomerMainPage = () => {
    const ClientWebRTC = () => {
       
    }
    const location = useLocation();
    const userName = location.state.Name;
    const userID= location.state.Id;
    const userEmail=location.state.Email;
    const [current_mode, setMode] = useState(2);
    const [consultingData, setData] = useState([]);
    const SetButtonFunction2 = () => {
        setMode(2);
        document
            .getElementById("select2")
            .style["font-weight"] = "normal";
        document
            .getElementById("select2")
            .style["background"] = "rgba(53, 157, 217, 0.54)";
        document
            .getElementById("select1")
            .style["font-weight"] = "lighter";
        document
            .getElementById("select1")
            .style["background"] = "transparent";
        document
            .getElementById("select3")
            .style["font-weight"] = "lighter";
        document
            .getElementById("select3")
            .style["background"] = "transparent";
    };
    const SetButtonFunction1 = () => {
        setMode(1);
        fieldSetDisable();
        document
            .getElementById("select1")
            .style["font-weight"] = "normal";
        document
            .getElementById("select1")
            .style["background"] = "rgba(53, 157, 217, 0.54)";
        document
            .getElementById("select2")
            .style["font-weight"] = "lighter";
        document
            .getElementById("select2")
            .style["background"] = "transparent";
        document
            .getElementById("select3")
            .style["font-weight"] = "lighter";
        document
            .getElementById("select3")
            .style["background"] = "transparent";
    };
    const SetButtonFunction3 = () => {
        setMode(3);
        document
            .getElementById("select3")
            .style["font-weight"] = "normal";
        document
            .getElementById("select3")
            .style["background"] = "rgba(53, 157, 217, 0.54)";
        document
            .getElementById("select1")
            .style["font-weight"] = "lighter";
        document
            .getElementById("select1")
            .style["background"] = "transparent";
        document
            .getElementById("select2")
            .style["font-weight"] = "lighter";
        document
            .getElementById("select2")
            .style["background"] = "transparent";
    };
    function MakeWhiteBox({start, end, time, id, people}) {
        const [timecheck, settimeCheck] = useState("");
        const [thistime, setthistime] = useState("");
        useEffect(() => {
            let yyyy = start.substring(0, 4);
            let mm = start.substring(5, 7);
            let dd = start.substring(8, 10);
            let hour = start.substring(11, 13);
            let minute = start.substring(14, 16);
            let sec = start.substring(17);

            let hour2 = end.substring(11, 13);
            let minute2 = end.substring(14, 16);
            let sec2 = end.substring(17);

            settimeCheck(
                yyyy + "." + mm + "." + dd + ". " + hour + ":" + minute + " ~ " + hour2 + ":" +
                minute2
            )

            let hour3 = time.substring(0, 2);
            let minute3 = time.substring(3, 5);
            let sec3 = time.substring(6);
            if (hour3 == "00") {
                if (minute3 == "00") {
                    setthistime(parseInt(sec3) + "초");
                } else {
                    setthistime(parseInt(minute3) + "분 " + parseInt(sec3) + "초");
                }
            } else {
                setthistime(
                    parseInt(hour3) + "시간" + parseInt(minute3) + "분 " + parseInt(sec3) + "초"
                );
            }
        },[])
        return (
            <div
                className="main_white_box"
                onClick={() => {
                    console.log(id);
                }}
                value={people}>
                <div className="aaFontStyle">{timecheck}
                </div>
                <div className="leftalign_box">
                    <p>
                        <span className="buttonFontStyle"><br/>상담사
                        </span>
                        <span className="bbFontStyle">{people}</span>
                    </p>
                    <p>
                        <span className="buttonFontStyle">상담 시간
                        </span>
                        <span className="bbFontStyle">{thistime}</span>
                    </p>
                </div>
            </div>
        );
    }
    const MyPage = () => {
        return (
            <div className="mypageStyle">
                <p>
                    <span className="ccFontStyle">이름 </span>
                    <span className="ddFontStyle">{userName}</span>
                </p>
                <p>
                    <span className="ccFontStyle">아이디 </span>
                    <span className="ddFontStyle">{userID}</span>
                </p>
                <p>
                    <span className="ccFontStyle">이메일 </span>
                    <span className="ddFontStyle">{userEmail}</span>
                </p>
                <div className="row_align">
                        <div className="eeFontStyle">
                            현재 비밀번호
                        </div>
                        <input type="password" className="passwordInput"/>
                </div>
                <div className="row_align">
                        <div className="eeFontStyle">
                            새 비밀번호
                        </div>
                        <input type="password" className="passwordInput"/>
                </div>
            </div>
        )
    }
    var LoadingToggleSelect= useRef(0);
    var ROOM_NUMBER_CONSIST=useRef();
    var isStompDisconnected=useRef(0);
    const WaitLoadingToggle = () => {
        const [wait_time, setWaitTime] = useState(0);
        useEffect(() => {
            const myInterval = setInterval(() => {
                setWaitTime((setWaitTime) => setWaitTime + 1);
            }, 1000);
            return() => clearInterval(myInterval);
        }, []);
        const CalculateTime = () => {
            if (wait_time >= 60) {
                return parseInt(wait_time / 60) + '분 ' + wait_time % 60 + '초';
            } else {
                return wait_time % 60 + '초';
            }
        }
        function WebSocketInit (){
            document.addEventListener("DOMContentLoaded", function(){
                WebSocket.init();
            })
        }
        if(!LoadingToggleSelect.current){
        return (
            <div className="loading_margin">
                <div className="image_centerpos">
                    <img width="70%" src={Spinner}/>
                </div>
                <div className="loadingFontStyle">
                    현재 상담을 기다리고 있습니다.
                    <br/><br/>
                    상담 대기 시간 :
                    <CalculateTime/>
                </div>
                <div className="red_bar" onClick={fieldSetAable}>
                    상담 종료하기
                </div>
                <WebSocketInit/>
            </div>
        )
        }
        else{
            return (
                <div className="center_inner_box">HELLO</div>
            )
        }
    }
    const Loading = () => {
        var flag=0;
        let remoteVideo = new MediaStream();
        useEffect(()=> {
            axios.get(URLsetting.LOCAL_API_URL+"consulting/create")
            .then((response)=> {
                const pc = new RTCPeerConnection(
                    {configuration: URLsetting.MEDIACONSTRAINTS ,stun_config }
                );
                ROOM_NUMBER_CONSIST.current=response.data;
                function handlerIceCandidate(e) {
                    if (e.candidate) {
                        if(flag){
                        stomp.send(
                            "/pub/data",
                            JSON.stringify({type: 'ice', sender: userID, channelId: response.data, data: e.candidate})
                        );
                        }
                        console.log("HANDLER ICE State: " + pc.iceConnectionState);
                    }
                }(async () => {
                    await navigator
                        .mediaDevices
                        .getUserMedia({audio: true, video: false})
                        .then(stream => {
                            stream
                                .getTracks()
                                .forEach(track => pc.addTrack(track, stream));
                        })
                })();
                var socket = new SockJS("//211.202.222.162:8080/ws");
                var stomp = Stomp.over(socket);
                pc.onicecandidate = handlerIceCandidate;
                pc.addEventListener("icecandidate", handlerIceCandidate);
                pc.addEventListener('track', async (event) => {
                    const [remoteStream] = event.streams;
                    remoteVideo.srcObject = remoteStream;
                    console.log(remoteVideo.srcObject)
                })
                pc.addEventListener("connectionstatechange",(event)=>{
                    if(pc.iceConnectionState=="connected"){
                        console.log(pc.iceConnectionState);
                        LoadingToggleSelect.current=1;
                    }
                })
                stomp.connect({}, function () {
                    stomp.subscribe("/sub/room/" + response.data, function (msg) {
                        if ((msg.body).includes('join')) {
                            var tmp2 = (msg.body).substring(0, (msg.body).length - 5);
                            if (tmp2 != userID) {
                                pc
                                    .createOffer({mandatory: { OfferToReceiveAudio: true, OfferToReceiveVideo: false }})
                                    .then((offer) => pc.setLocalDescription(offer))
                                    .then(() => {
                                        stomp.send(
                                            "/pub/data",
                                            JSON.stringify({type: 'offer', sender: userID, channelId: response.data, data: pc.localDescription})
                                        );
                                    })
                            }
                        } else {
                            var tmp = JSON.parse(msg.body);
                            if (tmp.type == "answer") {
                                flag=1;
                                pc.setRemoteDescription(tmp.data);
                                console.log("answer!!");
                            } else if (tmp.type == "ice") {
                                if (tmp.data) {
                                    if(flag){
                                        pc.addIceCandidate(tmp.data);
                                        console.log("ICE State: " + pc.iceConnectionState);
                                    }
                                }
                                console.log("ICE State: " + pc.iceConnectionState);
                            }
                        }
                    })
                    stomp.send(
                        "/pub/join",
                        JSON.stringify({type: 'client', sender: userID, channelId: response.data, data: pc.localDescription})
                    );
                })
            })
        },[])
        return (
            <>
            <WaitLoadingToggle/>
            </>
        ) 
    }
    const fieldSetDisable = () => {
        const fieldset = document.getElementById('button_disable');
        fieldset.disabled = true;
    }
    const fieldSetAable = () => {
        const fieldset = document.getElementById('button_disable');
        fieldset.disabled = false;
        SetButtonFunction2();
        var socket = new SockJS(URLsetting.LOCAL_API_URL+"/ws");
                var stomp = Stomp.over(socket);
                stomp.connect({}, function () {
                    stomp.send("/pub/quit",JSON.stringify({type:"client",sender:userID,channelId:ROOM_NUMBER_CONSIST.current,data:"asdfafdasf"}));
                    stomp.disconnect()
                })
    }
    useEffect(() => {
        axios
            .get(URLsetting.LOCAL_API_URL+"consulting/records", {
                params: {
                    clientID: "cmoh4135"
                }
            })
            .then((response) => {
                setData(response.data);
            })
    }, [])
    function ModeChange() {
        if (current_mode == 2) {
            return (
                <div className="grid">
                    {
                        consultingData.map((tmp) => (
                            <MakeWhiteBox
                                start={tmp.start}
                                end={tmp.end}
                                time={tmp.time}
                                id={tmp.id}
                                people={tmp.counselorName}/>
                        ))
                    }
                </div>
            );
        } else if (current_mode == 1) {
            return (<Loading/>);
        } else if (current_mode == 3) {
            return (<MyPage/>);
        }
    }
    return (
        <div className="customer_cover">
            <div className="grouping2">
                <div className="left_bar">
                    <div className="mainStyle">LINCALL</div>
                    <div className="regularFontStyle">{userName}</div>
                    <div className="smallFontStyle">고객</div>
                    <div className="left_bar_gray_box">
                        <div className="currentStateStyle">온라인</div>
                    </div>
                    <fieldset className="button_grouping" id="button_disable">
                        <button className="buttonFontStyle" id="select1" onClick={SetButtonFunction1}>
                            상담 시작하기
                        </button>
                        <button className="buttonFontStyle2" id="select2" onClick={SetButtonFunction2}>
                            상담 세부 내역
                        </button>
                        <button className="buttonFontStyle" id="select3" onClick={SetButtonFunction3}>
                            마이페이지
                        </button>
                    </fieldset>
                </div>
                <div className="center_box">
                    <TimeStamp/>
                    <ModeChange/>
                </div>
            </div>
        </div>
    );
};
export default CustomerMainPage;