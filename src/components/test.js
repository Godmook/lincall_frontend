import React, {useEffect, useState, Component, useRef} from "react";
import URLsetting from "../Setting/URLsetting";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

const Test = () => {
    const [stream,setStream]=useState(null);
    useEffect(()=>{
        var ROOM_ID=prompt("");
        function handlerIceCandidate (e){
            if(e.candidate) pc.addIceCandidate(e.candidate);
            if(e.candidate) console.log(e.candidate);
        }
        const pc= new RTCPeerConnection(URLsetting.STUN_CONFIG)
        navigator.mediaDevices.getUserMedia({video:false, audio:true})
        .then((currentStream)=>{
            setStream(currentStream);
            pc.addTrack(stream.getTrack());
        })
        var socket= new SockJS("//localhost:8080/ws");
                var stomp = Stomp.over(socket);
                console.log(ROOM_ID);
                pc.onicecandidate=handlerIceCandidate;
                stomp.connect( {}, function(frame){
                    stomp.subscribe("/sub/room/"+ROOM_ID,function(msg){
                            var tmp=JSON.parse(msg.body);
                            console.log(tmp);
                            if(tmp.type=="offer"){
                                var sdps=JSON.parse(tmp.data);
                                pc.setRemoteDescription(sdps.sdp);
                                pc.createAnswer()
                                .then((answer)=>pc.setLocalDescription(answer))
                                .then(()=>{
                                    stomp.send("/pub/data",JSON.stringify({type:'answer', sender:"counselor1", channelId:ROOM_ID, data:pc.localDescription}))
                                })
                            }
                            else if(tmp.type=="ice"){
                                stomp.send("/pub/data",JSON.stringify({type:'ice', sender:"counselor1", channelId:ROOM_ID, data:"client ice"}));
                                stomp.send("/pub/success");
                            }  
                    })
                    stomp.send("/pub/join",JSON.stringify({type:'counselor', sender:"counselor1", channelId:ROOM_ID, data:"dkdk"}));
                })

    },[])
    return (
        <>
        </>
    )
}

export default Test