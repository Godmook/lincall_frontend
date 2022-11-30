import React, {useEffect, useState, Component, useRef} from "react";
import {useNavigate} from "react-router-dom";
import "./counselor_mainpage.css";
import axios from "axios";
import {useLocation} from "react-router-dom";
import URLsetting from "../Setting/URLsetting";
import { faMeh,faAngry, faSmile } from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
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
const Createchat = ({type,message,time,emotion,question,answer}) => {
    const [facetype,setFaceType] = useState(faMeh);
    useEffect(()=> {
        if(emotion==="angry")setFaceType(faAngry);
        else if(emotion==="happy")setFaceType(faSmile);
    },[])
    if(type=="client"){
        return(
            <div className="chat_left_container">
                 <FontAwesomeIcon icon={facetype} size="3x"/>
                <div className="chat_left">
                    {message}
                    </div>
            </div>
        )
    }
    else if(type=="counselor"){
        return(
            <div className="chat_right_container">
                <div className="chat_right">{message}</div>
                <FontAwesomeIcon icon={facetype} size="3x"/>
            </div>
        )
    }
}
const CreateEmotionChange = ({type,message,time,emotion,question,answer}) => {
    return(
        <div className="emotion_change_sentence">{message}</div>
    )
}
function Mode1GrayBox ({end,clientName,start,counselorName,time, id}){
    const [timecheck, settimeCheck] = useState("");
    const [thistime, setthistime] = useState("");
    const navigate=useNavigate();
    useEffect(()=>{let yyyy = start.substring(0, 4);
        let mm = start.substring(5, 7);
        let dd = start.substring(8, 10);
        let hour = start.substring(11, 13);
        let minute = start.substring(14, 16);
        let sec = start.substring(17);
    
        let hour2 = end.substring(11, 13);
        let minute2 = end.substring(14, 16);
        let sec2 = end.substring(17);
    
        settimeCheck(
            yyyy + "." + mm + "." + dd + ". " + hour + ":" + minute
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
        }}
    ,[])
    
    return (
        <div className="mode1_grid_gray_box_container">
            <div className="mode1_grid_gray_box" onClick={() => navigate('/counselor/after/room/'+id, {
                state: {
                    id:id,
                    counselorName: counselorName,
                    clientName: clientName,
                    start:start,
                    time:time,
                    email:userEmail,
                    ccid:userID
                }
            })}>
            {timecheck}  ({thistime})
        </div>
        </div>
    )
}
function TodayCallTTime ({time}){
    var tmp= parseInt(time/1000);
    if(tmp<60) return " "+tmp + "초"
    else return " "+parseInt(tmp/60)+"분 "+tmp%60 + "초"
}
function TodayCallCaa ({count}){
    return " "+count+"건";
}
function TodayCallPPP ({count}){
    return " "+count+"명";
}
const Mode1 = () => {
    const [today_info,setTodayInfo]= useState(0);
    const [Mode1_data,setMode1Data]=useState([]);
    const [happy_word,setHappy] = useState();
    const [angry_word,setAngry] = useState();
    const [waiting_people, setWaitPeople] = useState(0);
    useEffect(()=> {
        var tmp=[];
        var tmps = [];
        var tmp1=[];
            axios.get(URLsetting.LOCAL_API_URL+"main/todayKeyword/angry").then((response)=> {
                tmp=response.data;
                for(var i=0;i<tmp.length;i++){
                    tmp1.push(tmp[i]);
                    tmp1.push(1);
                    tmps.push(tmp1);
                    tmp1=[];
                }
                setAngry(tmps);
            })  
        axios
        .get(URLsetting.LOCAL_API_URL+"consulting/records/counselor", {
            params: {
                id: userID
            }
        })
        .then((response) => {
            setMode1Data(response.data);
        })
        axios.get(URLsetting.LOCAL_API_URL+"consulting/counselorInfo/today", {
            params: {
                id: userID
            }
        })
        .then((response)=> {
            setTodayInfo(response.data);
        })
        axios.get(URLsetting.LOCAL_API_URL+"main/todayKeyword/happy")
        .then((response)=> {
            setHappy(response.data);
        })
        axios.get(URLsetting.LOCAL_API_URL+"main/todayKeyword/angry")
        .then((response)=> {
            setAngry(response.data);
        })
        axios.get(URLsetting.LOCAL_API_URL+"consulting/waitClient")
        .then((response)=>{
            setWaitPeople(response.data);
        })
    },[])
    return (
        <> < div className = "center_top" > <div className="text_box">
            <p className="center_top_text" id="todayCallCount">오늘 상담 건수 
                <span className="variable_bold" id="today_call_count"><TodayCallCaa count={today_info.count}/></span>
                </p>
            <p className="center_top_text" id="todayCallTime">오늘 상담 시간
                <span className="variable_bold" id="today_call_time"><TodayCallTTime time={today_info.time}/></span>
            </p>
            <p className="center_top_text" id="todayCallTime">대기 고객
                <span className="variable_bold" id="waiting_customer_count"><TodayCallPPP count={waiting_people}/></span>
                </p>
        </div>
    </div>
    <div className="line"></div>
    <div className="center_bottom">
        <div className="call_record_list_box">
            <p className="bigText">최근 상담 내역</p>
            <div className="mode1_grid">
            {
                        Mode1_data.map((tmp) => (
                            <Mode1GrayBox
                                end={tmp.end}
                                clientName={tmp.clientName}
                                start={tmp.start}
                                counselorName={tmp.counselorName}
                                time={tmp.time}
                                id={tmp.id}/>
                        ))
                    }
            </div>
        </div>
        <div className='v-line'></div>
        <div className="todayKeyword">
            <div className="happy_todayKeyword">
                <div className="emotion_wordcloue_text">오늘의 긍정 키워드</div>
                <div className="wordcloud_img_main_happy">
                <img src={`data:image/jpeg;base64,${happy_word}`} alt="My Image" className="wordcloud_img" ></img>
                </div>
            </div>
            <div className="angry_todayKeyword">
                <div className="emotion_wordcloue_text">오늘의 부정 키워드</div>
                <div className="wordcloud_img_main_angry">
                <img src={`data:image/jpeg;base64,${angry_word}`} alt="My Image" className="wordcloud_img"></img>
                </div>
            </div>
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
    if(client!=="null" && counselor===null){
    return (
        <div className={cur_style.current} onClick={() => navigate('/counselor/room/'+room, {
            state: {
                Room:room,
                Name: userName,
                Id: userID,
                senderEmail:userEmail,
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
    const [waiting_people, setWaitPeople] = useState(0);
    const [isActive,setActive]=useState(true);
    const [room_number, setRoomNumber] = useState([]);
    const [ptImg, setPositiveImg] = useState();
    const [ntImg, setNegativeImg] = useState();
    const [enters, setEnters]=useState([]);
    useEffect(()=> {
        axios.get(URLsetting.LOCAL_API_URL+"consulting/room-list")
        .then((response)=> {
            setRoomNumber(response.data);
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
        axios.get(URLsetting.LOCAL_API_URL+"consulting/waitClient")
        .then((response)=>{
            setWaitPeople(response.data);
        })
    },[])

    const toggleClass = () => {
        var toggler = document.querySelector('.toggle-switch');
        toggler.classList.toggle('active');
    }
    /*
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
   */
   return (
    <>
    <div className="mode2_top">
        대기중인 고객 {waiting_people}
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
)
}
var userName;
var userID;
var userEmail;
const CounselorMainPage = () => {
    const [isPage,setPage] = useState(0);
    const location = useLocation();
    userName = location.state.Name;
    userID= location.state.Id;
    userEmail=location.state.Email;
    const [current_mode, setMode] = useState(2);
    const leftbar_backgroundcolor = (number) => {
        for (var i = 1; i < 6; i++) {
            var tmp = "select" + i;
            if(i==3){continue;}
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
                    <div></div>
                    <ManualPage tt={isPage}/>
                </p>
            </div>
        </div>
    );
};
export default CounselorMainPage;