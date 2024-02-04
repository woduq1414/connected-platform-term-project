import Stack from "@mui/material/Stack";
import { COMMON_TITLES, TOAST_OPTIONS } from "src/constant";
import HeroSection from "src/components/HeroSection";
import { useGetGenresQuery } from "src/store/slices/genre";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import SliderRowForGenre from "src/components/VideoSlider";
import { useParams, useSearchParams } from "react-router-dom";
import { useMediaQuery } from '@mui/material';

import Plyr from 'plyr';
import "plyr/dist/plyr.css";
import Hls from 'hls.js';
import React, { Suspense, useContext, useEffect, useRef, useState } from "react";
import { Avatar, Box, Container, IconButton, Typography } from "@mui/material";
import StartIcon from '@mui/icons-material/Start';
import GroupIcon from '@mui/icons-material/Group';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ForumIcon from '@mui/icons-material/Forum';

import 'src/styles/customPlyr.css'
import { transform } from "framer-motion";
import { debounce } from "lodash";
import { ChatUser, Chatting } from "src/types/Chat";

import { useWatch } from "src/providers/WatchProvider";
import { ChatContainer } from "src/components/ChatContainer";
import { io } from "socket.io-client";
import { videoDetailApi, userWatchApi, videoLogApi } from "src/api/video";
import toast, { Toaster } from "react-hot-toast";
import { getRandomNumber } from "src/utils";
import { grey } from "@mui/material/colors";

function WatchPage() {
    const { watchId } = useParams();

    const [searchParams] = useSearchParams();
    const preRoomId = searchParams.get('r');
    console.log(preRoomId);

    const { isChatContainerOpen, setIsChatContainerOpen,
        isControlShown, setIsControlShown,
        isUpperMenuShown, setIsUpperMenuShown,
        chatUserList, setChatUserList,
        chatList, setChatList,
        socket, setSocket,
        roomId, setRoomId,
        roomData, setRoomData,
        addChat,
        playerRef
    } = useWatch();

    const [title, setTitle] = useState<string>('');
    let isFirstSeeked = false;


    const [hostTimestampInterval, setHostTimestampInterval] = useState(null);

    const [isReady, setIsReady] = useState(null);

    const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

    useEffect(() => {
        clearInterval(hostTimestampInterval);

        const newInterval = setInterval(() => {
            // console.log(roomData, roomData.host, socket.id, roomId);
            if (roomData.host == socket.id) {
                if (playerRef.current !== undefined) {
                    socket.emit('hostTimestamp', roomId, {
                        playerTimestamp: playerRef.current.currentTime,
                        now: Date.now()
                    });
                }

            }

        }, 1000);

        setHostTimestampInterval(newInterval);

    }, [roomId])

    useEffect(() => {
        return (() => {
            if (socket) {
                socket.disconnect();
            }
        })
    }, [socket])



    useEffect(() => {

        if (preRoomId !== null && preRoomId !== undefined && preRoomId !== '') {
            socket.emit('joinRoom', preRoomId);
            setRoomId(preRoomId);
        }

        videoDetailApi(watchId).then((res) => {
            console.log(res);

            let data = res.data;


            if (data.video.length == 0) {

                setIsReady(false);

                return;
                // location.href = '/';
                // alert('존재하지 않는 영상입니다.');
            } else {
                if (data.video[0].url == undefined || data.video[0].url == null || data.video[0].url == '') {
                    setIsReady(false);
                    return;
                } else {

                }
            }

            const mywatch = data.video[0].mywatch;
            const source = data.video[0].url;
            setTitle(data.video[0].title);
            setThumbnailUrl(data.video[0].thumbnailUrl);
            // const source = "http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8";
            const video = document.querySelector('video');
            // const player = undefined;
            // alert(roomData.isPlaying);
            const defaultOptions = {
                fullscreen: { enabled: true, fallback: false, iosNative: false, container: 'body' },
                autoplay: roomData.isPlaying,
                tooltips: {
                    controls: true,
                    seek: true,
                },
                controls: [
                    'play-large',
                    'play',
                    'progress',
                    'current-time',
                    'duration',
                    'mute',
                    'volume',
                    'captions',
                    'settings',
                    'pip',
                    'fullscreen',
                ],
                settings: ['captions', 'quality', 'speed'],
                captions: {
                    active: true,
                    language: 'auto',
                    update: true,
                },
                i18n: {

                    play: '재생',
                    pause: '일시정지',
                    volume: '볼륨',
                    mute: '음소거',
                    qualityBadge: {
                        2160: '4K',
                        1440: 'UHD',
                        1080: 'FHD',
                        720: 'HD',
                        576: 'SD',
                        480: 'SD',
                    },
                    restart: 'Restart',
                    rewind: 'Rewind {seektime}s',

                    fastForward: 'Forward {seektime}s',
                    seek: 'Seek',
                    seekLabel: '{currentTime} of {duration}',
                    played: 'Played',
                    buffered: 'Buffered',
                    currentTime: 'Current time',
                    duration: 'Duration',

                    unmute: '소리 켜기',
                    enableCaptions: '자막 켜기',
                    disableCaptions: '자막 끄기',
                    download: 'Download',
                    enterFullscreen: '전체화면',
                    exitFullscreen: '전체화면 해제',
                    frameTitle: 'Player for {title}',
                    captions: '자막',
                    settings: '설정',
                    pip: 'PIP',
                    menuBack: 'Go back to previous menu',
                    speed: '재생속도',
                    normal: '기본',
                    quality: '화질',
                    loop: 'Loop',
                    start: 'Start',
                    end: 'End',
                    all: 'All',
                    reset: 'Reset',
                    disabled: 'Disabled',
                    enabled: 'Enabled',
                    advertisement: 'Ad',
                    qualityLabel: {
                        0: '자동',
                    },


                },
                tracks: [
                    {
                        kind: 'captions',
                        label: 'English',
                        srclang: 'en',
                        src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.fr.vtt',
                        default: true,
                    },
                ],
                quality: {
                    default: 0,
                }
            };

            let bitrateResource;
            let resolution;




            if (!Hls.isSupported()) {
                video.src = source;
                const player = new Plyr(video, defaultOptions);
            } else {
                // For more Hls.js options, see https://github.com/dailymotion/hls.js
                const hls = new Hls();
                hls.loadSource(source);

                // From the m3u8 playlist, hls parses the manifest and returns
                // all available video qualities. This is important, in this approach,
                // we will have one source on the Plyr player.
                hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {

                    // Transform available levels into an array of integers (height values).
                    const availableQualities = hls.levels.map(l => l.height);
                    availableQualities.unshift(0); //prepend 0 to quality array

                    // Add new qualities to option
                    defaultOptions.quality = {
                        default: 0, //Default - AUTO
                        options: availableQualities,
                        forced: true,
                        onChange: e => updateQuality(e)
                    };





                    hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
                        var span = document.querySelector(".plyr__menu__container [data-plyr='quality'][value='0'] span");
                        if (hls.autoLevelEnabled) {
                            span.innerHTML = `AUTO (${hls.levels[data.level].height}p)`;
                        } else {
                            span.innerHTML = `AUTO`;
                        }
                    });

                    // Initialize new Plyr player with quality options
                    playerRef.current = new Plyr(video, defaultOptions);
                    let player = playerRef.current;
                    player.on("ready", function () {



                        if (roomData.host == socket.id) {
                            socket.emit("setSpeed", roomId, player.speed);
                        }
                        console.log("ready");

                        player.on("playing", function (d) {
                            console.log(d);
                            if (!isFirstSeeked && mywatch != null && mywatch != 0) {
                                player.currentTime = mywatch;
                                toast(`시청 기록이 존재합니다.`,
                                    {
                                        icon: "😊",
                                        style: TOAST_OPTIONS,
                                    }
                                );

                            } else {
                                userWatchApi(watchId, Math.floor(playerRef.current.currentTime));
                            }
                            isFirstSeeked = true;
                        });

                        player.on("controlsshown", function () {

                            // console.log("controls shown");
                            setIsControlShown(true);
                            // console.log(player.currentTime);
                            // setIsUpperMenuShown(true);
                        });

                        player.on("controlshidden", function () {

                            // console.log("controls hidden");
                            setIsControlShown(false);



                        });

                        player.on("seeked", function (d) {
                            // alert("seeked");
                            if (roomData.host == socket.id) {

                                socket.emit("videoAt", roomId, player.currentTime);
                            } else {
                                toast("방장만 이동할 수 있어요.", {
                                    icon: '❌',
                                    style: TOAST_OPTIONS,
                                }
                                )
                            }
                            // hls.startLoad();
                        });

                        player.on("play", function (d) {
                            console.log("play", d);

                            if (roomData.host == socket.id) {
                                socket.emit("videoToggle", roomId, "play");
                            }
                        });
                        player.on("pause", function (d) {
                            console.log("pause", d);

                            if (roomData.host == socket.id) {
                                socket.emit("videoToggle", roomId, "pause");
                            }
                        });

                        player.on("ratechange", function (d) {
                            if (roomData.host == socket.id) {
                                socket.emit("setSpeed", roomId, player.speed);
                            } else {
                                player.speed = roomData.speed;
                            }
                        })

                        let controlContainer = document.getElementsByClassName("plyr__controls")[0]
                        let playButton = controlContainer.childNodes[0]
                        let progressBar = controlContainer.childNodes[1]
                        let currentTimeLabel = controlContainer.childNodes[2]
                        let fullTimeLabel = controlContainer.childNodes[3]
                        let soundControl = controlContainer.childNodes[4]
                        let captionControl = controlContainer.childNodes[5]
                        let settingControl = controlContainer.childNodes[6]
                        let pipControl = controlContainer.childNodes[7]
                        let fullscreenContol = controlContainer.childNodes[8]


                        let newControl = document.createElement("div")
                        let topControl = document.createElement("div")
                        let durationLabel = document.createElement("div")


                        durationLabel.replaceChildren(currentTimeLabel, fullTimeLabel)

                        durationLabel.classList.add("plyr__durationLabel")

                        let bottomControl = document.createElement("div")
                        let bottomLeftControl = document.createElement("div")
                        let bottomRightControl = document.createElement("div")

                        topControl.classList.add("plyr__topControl")


                        topControl.replaceChildren(progressBar, durationLabel);


                        bottomControl.classList.add("plyr__bottomControl")
                        bottomLeftControl.classList.add("plyr__bottomLeftControl")
                        bottomRightControl.classList.add("plyr__bottomRightControl")

                        bottomLeftControl.replaceChildren(playButton, soundControl)

                        bottomRightControl.replaceChildren(captionControl, settingControl, pipControl, fullscreenContol)

                        bottomControl.replaceChildren(bottomLeftControl, bottomRightControl)

                        controlContainer.replaceChildren(topControl, bottomControl);

                        console.log(hls, "hls");
                        setIsReady(true);

                    });


                });

                hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                    // 품질 데이터 출력
                    bitrateResource = data.levels.map(level => level.bitrate);
                    resolution = data.levels.map(level => ({
                        width: level.width,
                        height: level.height
                    }));

                    console.log('Bitrate Resource:', bitrateResource);
                    console.log('Resolution:', resolution);

                });




                hls.attachMedia(video);
                window.hls = hls;


                var monitoringInterval = 1000 * 2;

                // 버퍼링 상태 모니터링 함수
                function monitorBuffering() {
                    setTimeout(function () {
                        var buffer = video.buffered; // 버퍼링된 범위
                        if (buffer.length > 0) {
                            var bufferedStart = buffer.start(0); // 버퍼링 시작 시간
                            var bufferedEnd = buffer.end(0); // 버퍼링 끝 시간
                            var bufferedTime = bufferedEnd - bufferedStart; // 버퍼링된 시간 (초)
                            // console.log('버퍼링된 시간:', bufferedTime);

                            let data = {
                                bufferedTime: bufferedTime,
                                currentTime: video.currentTime,
                                resolution: resolution[window.hls.currentLevel].height,
                                bitrate: bitrateResource[window.hls.currentLevel],
                                timestamp: Date.now(),
                                roomId: preRoomId ? preRoomId : roomId,
                                watchId: watchId,
                                socketId: socket.id


                            }
                            console.log(data, "data")
                            
                                
                            videoLogApi(data);
                        }
                    }, getRandomNumber(3000));
                }

                // 주기적으로 버퍼링 상태 모니터링 호출
                setInterval(monitorBuffering, monitoringInterval);
            }



            function updateQuality(newQuality) {
                if (newQuality === 0) {
                    window.hls.currentLevel = -1; //Enable AUTO quality if option.value = 0
                } else {
                    window.hls.levels.forEach((level, levelIndex) => {
                        if (level.height === newQuality) {
                            console.log("Found quality match with " + newQuality);
                            window.hls.currentLevel = levelIndex;
                        }
                    });
                }
            }
        });





    }, []);

    let timer = undefined;
    useEffect(() => {
        let timeoutId;
        if (!isControlShown) {
            timeoutId = setTimeout(() => {
                setIsUpperMenuShown(false);
            }, 1000);
        } else {
            setIsUpperMenuShown(true);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [isControlShown]);

    const stopWatching = () => {
        userWatchApi(watchId, Math.floor(playerRef.current.currentTime));
    }




    const isMobile = useMediaQuery('(max-width:600px) or (orientation: portrait)');



    return (


        isReady != false ? (
            <Stack spacing={2} sx={{
                visibility: isReady ? 'visible' : 'hidden',
            }}>
                {/* <Plyr id="plyr" options={defaultOptions} source={{}} ref={ref} /> */}
                {/* make vertical center the Plyr Component and max size with material UI*/}
                <Box sx={{
                    ...{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // height: '100vh',
                        height: '100vh',
                        // overflowY: 'hidden',

                    }, ...isMobile ? {
                        flexDirection: 'column',
                    } : {
                        flexDirection: 'row',
                    }
                }}>
                    <Box sx={{
                        width: '100%',
                        maxHeight: '100vh',
                        marginTop: isMobile && isChatContainerOpen ? '1.6rem' : '0px',
                        // maxWidth: '800px',
                    }}>

                        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                            {/* <Toaster /> */}
                            <video controls crossorigin playsinline poster={thumbnailUrl}></video>
                            <VideoUpperMenu title={title} stopWatching={stopWatching} />
                            <SideChattingOverlay />
                        </Box>

                    </Box>

                    <ChatContainer playerRef={playerRef} />

                </Box>

            </Stack>

        ) : (
            <Stack spacing={2}>
                <Container maxWidth="md"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                    }}
                >
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // height: '50vh',
                        overflowY: 'hidden',
                        backgroundColor: grey[900],
                        padding: 2,
                        borderRadius: 2,
                        color: 'text.primary',

                    }}>
                        <Typography
                            variant="h6"
                        >
                            아직 준비되지 않은 영상이에요.
                        </Typography>

                    </Box>
                </Container>
            </Stack>
        )


    );
}

const VideoUpperMenu = (props) => {

    const { title } = props;
    const { stopWatching } = props;

    function openChatContainer() {


        setIsChatContainerOpen(true);
    }


    const { isChatContainerOpen, setIsChatContainerOpen,
        isControlShown, setIsControlShown,
        isUpperMenuShown, setIsUpperMenuShown,
        chatUserList, setChatUserList,
        chatList, setChatList } = useWatch();

    return (
        <Box sx={{
            top: 0, left: 0, position: "absolute",
            //  backgroundColor: "rgba(255,0,255,0.2)",
            background: "linear-gradient(#000000bf, #0000)",
            color: "#000",
            width: "100%",

            transform: "translateY(-50%)", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center",
            visibility: isUpperMenuShown ? "1" : "0", transition: "opacity .5s", opacity: isUpperMenuShown ? "1" : "0"
        }}>
            <IconButton onClick={() => { }} sx={{ flexShrink: "0" }}>
                <ArrowBackIcon sx={{ fontSize: "32px", color: "white" }}
                    onClick={() => {
                        stopWatching();
                        location.href = "/";
                    }}
                />
            </IconButton>

            <Typography
                variant="h4"
                sx={{ color: "text.primary", lineHeight: "1.2", flexGrow: "1", marginLeft: "1.5rem" }}
            >{
                    title
                }</Typography>
            <IconButton onClick={openChatContainer} sx={{ flexShrink: "0", }}>
                {
                    isChatContainerOpen ? <React.Fragment /> : <ForumIcon sx={{ fontSize: "32px", color: "white" }} />
                }

            </IconButton>

        </Box>
    );
}

function SideChattingOverlay() {

    const { isChatContainerOpen, setIsChatContainerOpen,
        isControlShown, setIsControlShown,
        isUpperMenuShown, setIsUpperMenuShown,
        chatUserList, setChatUserList,
        chatList, setChatList } = useWatch();


    return (
        <React.Fragment />
    );
    return (
        <Box sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "30%",
            height: "100%",
            backgroundColor: "rgba(255,0,255,0.2)",
            color: "#000",
            zIndex: 100,
            pointerEvents: "none",
            overflowY: "hidden",

        }}>
            {
                chatList.map((chat, index) => {
                    return (
                        <Box key={index} sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            width: "100%",
                            height: "3rem",
                            backgroundColor: "rgba(255,0,255,0.2)",
                            color: "#000",
                            pointerEvents: "none",

                        }}>
                            <Avatar sx={{ width: "2rem", height: "2rem", marginLeft: "1rem" }} />
                            <Typography sx={{ marginLeft: "1rem" }}>{chat.content}</Typography>
                        </Box>
                    );
                })

            }
        </Box>
    );

}



export default WatchPage;
