import { ReactNode, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import createSafeContext from "src/lib/createSafeContext";
import { MEDIA_TYPE } from "src/types/Common";
import { ChatUser, Chatting } from "src/types/Chat";
import { io } from "socket.io-client";
import { HOST_URL, MAIN_PATH, TOAST_OPTIONS } from "src/constant";
import toast from "react-hot-toast";

export interface WatchConsumerProps {
    isChatContainerOpen: boolean;
    setIsChatContainerOpen: (isChatContainerOpen: boolean) => void;
    isControlShown: boolean;
    setIsControlShown: (isControlShown: boolean) => void;
    isUpperMenuShown: boolean;
    setIsUpperMenuShown: (isUpperMenuShown: boolean) => void;
    chatUserList: ChatUser[];
    setChatUserList: (chatUserList: ChatUser[]) => void;
    chatList: Chatting[];
    setChatList: (chatList: Chatting[]) => void;
    addChat: (chatting: Chatting) => void;
    socket: SocketIOClient.Socket;
    setSocket: (socket: SocketIOClient.Socket) => void;

    roomId: string;
    setRoomId: (roomId: string) => void;

    roomData: any;
    setRoomData: (roomData: any) => void;

    playerRef: React.MutableRefObject<Plyr | null>;


}

export const [useWatch, Provider] =
    createSafeContext<WatchConsumerProps>();

export default function WatchProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [isChatContainerOpen, setIsChatContainerOpen] = useState<boolean>(true);
    const [isControlShown, setIsControlShown] = useState<boolean>(false);

    const [isUpperMenuShown, setIsUpperMenuShown] = useState<boolean>(false);

    const [chatUserList, setChatUserList] = useState<ChatUser[]>([
        {
            userId: 1,
            nickname: '안녕',
            profileImage: '/avatar.png'
        },

    ]);
    const [chatList, setChatList] = useState<Chatting[]>([
        // {
        //     userId: 1, content: "안녕하세요", createdAt: Date.now(), videoAt: 0
        // }
    ]);

    const addChat = function (chatting: Chatting) {

        // setChatList([...chatList, chatting]);
        setChatList(chatList => [...chatList, chatting]);
        console.warn("addChat", chatList.length);
    }

    const [socket, setSocket] = useState<SocketIOClient.Socket>(undefined);

    const [roomId, setRoomId] = useState<string | null>(null);
    const [roomData, setRoomData] = useState<any>(undefined);
    const playerRef = useRef<Plyr | null>(null);

    console.log("!!!!", chatList.length);

    useEffect(() => {
        const socketIo = io(`${HOST_URL.replace("/api", "")}`, {
            cors: {
                origin: `${HOST_URL.replace("/api", "")}`,
                credentials: true
            },
            transports: ["websocket"],
            query: {
                tenant: 'EGU',
                token: localStorage.getItem('accessToken')
            }
        });

        socketIo.on("connect", () => {
            console.log("socket connected");
        });
        socketIo.on("disconnect", () => {
            console.log("socket disconnected");
        });
        // socketIo.emit('join room', "hello", "world");
        socketIo.on("new message", (userId, message, createdAt) => {
            console.log("new message");
            console.log(userId, message, createdAt);

            if (userId == "system") {
                toast(message.message,
                    {
                        icon: message.icon,
                        style: TOAST_OPTIONS,
                    }
                );
            } else {
                addChat(message);
            }

            // setChatList([...chatList, message]);
        });

        socketIo.on("videoAt", (data) => {

            let videoAt = Math.floor(data.videoAt);

            // videoAt -> 0:00:00
            let videoAtString = new Date(data.videoAt * 1000).toISOString().substr(12, 7);



            toast(`${videoAtString}로 이동했어요.`,
                {
                    icon: "📺",
                    style: TOAST_OPTIONS,
                }
            );
        });

        socketIo.on("videoToggle", (data) => {
            console.log("videoToggle", data);
            let type = data.type;

            if (type == "play") {
                playerRef.current.play();
            }else if(type == "pause"){
                playerRef.current.pause();
            }
        });

        socketIo.on("updateRoomInfo", (data) => {
            setRoomData(data.roomData);
            setRoomId(data.roomId);

            let tempChatUserList = data.roomData.users.map((user) => {
                return {
                    userId: user.userData.userId,
                    nickname: user.userData.nickname,
                    profileImage: user.userData.profileImage,
                    color : user.userData.color,
                    live : user.live
                }
            }) as ChatUser[];

            setChatUserList(tempChatUserList);


            // if(data.roomData.isPlaying){
            //     playerRef.current.play();
            // }else{
            //     playerRef.current.pause();
            // }

            playerRef.current.speed = data.roomData.speed

            console.log(data, "updateRoomInfo");
        });

        socketIo.on("hostTimestamp", (data) => {
            // console.log("hostTimestamp", data);

            if (playerRef.current.playing) {
                let hostPlayerTimestamp = data.playerTimestamp;
                let hostNow = data.now;

                if (Math.abs(playerRef.current.currentTime - hostPlayerTimestamp) > 1) {
                    playerRef.current.currentTime = hostPlayerTimestamp + (hostNow - Date.now()) / 1000;
                }
            }




        });

        socketIo.on("error", (data) => {

            location.href = "/" + MAIN_PATH.login;
            alert(data);

        });

        setSocket(socketIo);


    }, []);

    return <Provider value={{
        isChatContainerOpen, setIsChatContainerOpen,
        isControlShown, setIsControlShown,
        isUpperMenuShown, setIsUpperMenuShown,
        chatUserList, setChatUserList,
        chatList, setChatList,
        addChat,
        socket, setSocket,
        roomId, setRoomId,
        roomData, setRoomData,
        playerRef

    }}>{children}</Provider>;
}
