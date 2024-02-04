import Stack from "@mui/material/Stack";
import { COMMON_TITLES, TOAST_OPTIONS } from "src/constant";
import HeroSection from "src/components/HeroSection";
import { useGetGenresQuery } from "src/store/slices/genre";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import SliderRowForGenre from "src/components/VideoSlider";
import { useParams } from "react-router-dom";

import Plyr from 'plyr';
import "plyr/dist/plyr.css";
import Hls from 'hls.js';
import React, { Suspense, useContext, useEffect, useRef, useState } from "react";
import { Avatar, Box, Button, IconButton, TextField, Typography } from "@mui/material";
import StartIcon from '@mui/icons-material/Start';
import GroupIcon from '@mui/icons-material/Group';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ForumIcon from '@mui/icons-material/Forum';
import AddIcon from '@mui/icons-material/Add';

import 'src/styles/customPlyr.css'
import { transform } from "framer-motion";
import { debounce } from "lodash";
import { ChatUser, Chatting } from "src/types/Chat";

import { useWatch } from "src/providers/WatchProvider";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { useAuth } from "src/providers/GlobalProvider";
import toast from "react-hot-toast";

import { useMediaQuery } from '@mui/material';


export function ChatContainer(props) {

    const playerRef = props.playerRef;
    const isMobile = useMediaQuery('(max-width:600px) or (orientation: portrait)');
    const { isChatContainerOpen, setIsChatContainerOpen,
        chatUserList, setChatUserList,
        chatList, setChatList,
        addChat,
        socket, setSocket,
        roomId, setRoomId,
    } = useWatch();

    const {
        isLogin, setIsLogin,
        user, setUser
    } = useAuth();

    const [myChattingMessage, setMyChattingMessage] = useState<string>("");

    const [isChattingMode, setIsChattingMode] = useState<boolean>(true);

    const messagesEndRef = useRef(null); // 스크롤 위치를 관리하기 위한 ref
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatList]);


    function closeChatContainer() {


        setIsChatContainerOpen(false);
    }

    function sendChat() {
        if (myChattingMessage.length > 0) {

            socket.emit("send message", socket.id, roomId,
                { userId: user.id, content: myChattingMessage, createdAt: Date.now(), videoAt: playerRef.current.currentTime });


            setMyChattingMessage("");
        }
    }

    useEffect(() => {

    }, [])

    function copyRoomLink() {
        prompt("Ctrl + C를 눌러 방 링크를 복사하세요!", `${window.location.origin}${window.location.pathname}?r=${roomId}`);
        // navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?r=${roomId}`);

    }


    return (
        <Box sx={isMobile ? {
            width: '100%',
            flexGrow: 1,
            display: isChatContainerOpen ? 'flex' : "none",
            flexDirection: 'column',
        } : {
            width: '25%',
            minWidth: '300px',
            maxHeight: '100vh',
            height: '100vh',
            display: isChatContainerOpen ? 'flex' : "none",
            flexDirection: 'column',

            // transition : "all 0.5s ease-in-out"

        }}>
            <Box sx={{ backgroundColor: "primary", flexShrink: "0", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <IconButton sx={{ color: "text.primary" }} onClick={closeChatContainer}>
                    <StartIcon />
                </IconButton>
                <Typography
                    variant="h8"
                    sx={{ color: "text.primary", lineHeight: "1.2" }}
                    onClick={() => {
                        // alert(roomId);
                        toast(roomId,
                            {
                                icon: '👏',
                                style: TOAST_OPTIONS,
                            }
                        );
                    }}
                >{
                        isChattingMode ? "실시간 채팅" : "참여자"
                    }</Typography>
                <IconButton sx={{ color: "text.primary" }} onClick={() => {
                    setIsChattingMode(!isChattingMode);
                }}>
                    {
                        isChattingMode ? <GroupIcon /> : <ForumIcon />
                    }

                </IconButton>
            </Box>

            {
                isChattingMode ?
                    (
                        <>
                            <Box sx={{
                                backgroundColor: "grey.900", flexGrow: "1", "overflowY": "auto",
                                scrollBehavior: "smooth"
                            }}>
                                {chatList.map((chatting, index) => {
                                    // console.log(chatting);
                                    return (
                                        <ChattingMessage playerRef={playerRef} chatting={chatting} index={index} />
                                    );
                                })
                                }
                                <div ref={messagesEndRef} />

                            </Box>
                            <Box sx={{
                                backgroundColor: "primary", flexShrink: "0", display: "flex", flexDirection: "column", alignItems: "center",
                                "padding": "0.5rem 0.8rem"
                            }}>
                                {/* Chatting Input */}
                                <TextField
                                    id="standard-multiline-flexible"

                                    multiline
                                    // hiddenLabel
                                    maxRows={2}
                                    color="secondary"
                                    variant="standard"
                                    sx={{
                                        width: "100%",
                                        overflowY: "hidden",
                                        borderRadius: "0.5rem",

                                    }}
                                    value={myChattingMessage}
                                    onChange={(event) => setMyChattingMessage(event.target.value)}
                                    onKeyDown={(event) => {

                                        if (event.key === "Enter" && !event.shiftKey) {

                                            // console.log(chatList.length);

                                            sendChat();
                                            event.preventDefault(); // 폼 전송 방지
                                        }
                                    }
                                    }
                                />

                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", width: "100%" }}>

                                    <Button variant="contained" disableElevation color="secondary"
                                        sx={{
                                            margin: "0.8rem 0 0.5rem 0.5rem",
                                            borderRadius: "0.5rem",
                                            padding: "0.3rem 0rem",
                                            width: "3.5rem",
                                            minWidth: "2rem",
                                            fontWeight: "bold",
                                        }}
                                        onClick={sendChat}
                                    >
                                        채팅
                                    </Button>


                                </Box>


                            </Box>
                        </>
                    ) : (
                        <>
                            <Box sx={{
                                backgroundColor: "grey.900", flexGrow: "1", "overflowY": "auto",
                                scrollBehavior: "smooth"
                            }}>
                                {chatUserList.map((chatUser, index) => {
                                    // console.log(chatting);
                                    if(chatUser.live == false){
                                        return <></>;
                                    }
                                    return (
                                        <Box key={index} sx={{
                                            display: "flex", flexDirection: "row",
                                            justifyContent: "flex-start", alignItems: "start", padding: "0.5rem",
                                            color: "text.primary",
                                            marginBottom: "0.2rem",
                                        }}>
                                            <Box sx={{ width: "3rem", borderRadius: "100%", backgroundColor: "primary", marginRight: "0.2rem", flexShrink: "0" }}>
                                                <Avatar alt="user_avatar" src={chatUser.profileImage} variant="circular"
                                                    sx={{ filter: `hue-rotate(${chatUser.color}deg)` }}
                                                />
                                            </Box>
                                            <Box sx={{
                                                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start",
                                                flexGrow: "1",
                                                height: "100%",
                                                margin: "auto 0"
                                            }}>
                                                <Typography
                                                    variant="h7"
                                                    sx={{ color: "text.primary", lineHeight: "1.2", fontWeight: "bold" }}
                                                >{chatUser.nickname}</Typography>
                                            </Box>

                                        </Box>
                                    );
                                })
                                }

                                <Box sx={{
                                    display: "flex", flexDirection: "row",
                                    justifyContent: "flex-start", alignItems: "start", padding: "0.5rem",
                                    color: "text.primary",
                                    marginBottom: "0.2rem"
                                }}
                                    onClick={copyRoomLink}
                                >
                                    <Box sx={{ width: "3rem", borderRadius: "100%", backgroundColor: "primary", marginRight: "0.2rem", flexShrink: "0" }}>
                                        <IconButton sx={{ color: "text.primary" }} onClick={() => {

                                        }}>
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                    <Box sx={{
                                        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start",
                                        flexGrow: "1",
                                        height: "100%",
                                        margin: "auto 0"
                                    }}>
                                        <Typography
                                            variant="h7"
                                            sx={{ color: "text.primary", lineHeight: "1.2", }}
                                        >초대 링크 복사</Typography>
                                    </Box>

                                </Box>


                            </Box>
                        </>
                    )
            }


        </Box >
    );
}

export function ChattingMessage(props: { playerRef, chatting: Chatting, index: number }) {
    const { chatting, index, playerRef } = props;
    const {
        chatUserList, setChatUserList,
        roomData,
        socket,
        roomId
    } = useWatch();
    let chatUser = chatUserList.find((chatUser) => {
        return chatUser.userId === chatting.userId;
    })

    // console.log(chatting);

    let chatNickname = chatUser ? chatUser.nickname : "익명";
    let chatAvatar = chatUser ? chatUser.profileImage : undefined;

    // second -> 00:00:00
    let videoAtString = new Date(chatting.videoAt * 1000).toISOString().substr(12, 7);
    // alert(videoAtString);



    return (
        <Box key={index} sx={{
            display: "flex", flexDirection: "row",
            justifyContent: "flex-start", alignItems: "start", padding: "0.5rem",
            color: "text.primary",
            marginBottom: "0.2rem",
        }}>
            <Box sx={{ width: "3rem", borderRadius: "100%", backgroundColor: "primary", marginRight: "0.2rem", flexShrink: "0" }}>
                <Avatar alt="user_avatar" src={chatAvatar} variant="circular"
                    sx={{ filter: `hue-rotate(${chatUser.color}deg)` }}
                />
            </Box>
            <Box sx={{
                display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start",
                flexGrow: "1"
            }}>
                <Box sx={{
                    display: "flex", flexDirection: "row",
                    justifyContent: "space-between", alignItems: "center",
                    width: "100%"
                }}>
                    <Typography
                        variant="h7"
                        sx={{ color: "text.primary", lineHeight: "1.2", fontWeight: "bold" }}
                    >{chatNickname}</Typography>
                    <Typography
                        variant="h9"
                        sx={{
                            color: "text.secondary", lineHeight: "1.2", cursor: "pointer",
                        }}
                        onClick={() => {

                            if (roomData.host == socket.id) {
                                playerRef.current.currentTime = chatting.videoAt;

                                // socket.emit("videoAt", roomId, chatting.videoAt);
                            } else {
                                toast("방장만 이동할 수 있어요.", {
                                    icon: '❌',
                                    style: TOAST_OPTIONS,
                                }
                                )
                            }




                        }}

                    >{videoAtString}</Typography>
                </Box>
                <Typography
                    variant="h8"
                    sx={{
                        color: "text.primary", lineHeight: "1.2", wordBreak: "break-all",
                        whiteSpace: "pre-wrap"
                    }}
                >{chatting.content}</Typography>

            </Box>

        </Box>
    );
}