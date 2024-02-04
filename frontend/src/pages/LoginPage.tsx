import {
    Button, Container, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography,
    FormGroup, FormControl, FormControlLabel, Checkbox
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/zh-cn';
import { Link as RouterLink } from "react-router-dom";
import { MAIN_PATH, TOAST_OPTIONS } from "src/constant";
import { loginApi } from "src/api/user";
import { useAuth } from "src/providers/GlobalProvider";
import { LoadingButton } from '@mui/lab';
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function LoginPage() {

    const [email, setEmail] = useState<string | null>('');
    const [password, setPassword] = useState<string | null>('');


    const [isSubmitActive, setIsSubmitActive] = useState<boolean>(false);

    const [isPending, setIsPending] = useState<boolean>(false);

    const {
        isLogin, setIsLogin,
        user, setUser
    } = useAuth();

    const navigate = useNavigate();



    // 
    useEffect(() => {



        // valid check
        let flag = true;

        if (email === null || email.length === 0) {
            flag = false;
        }
        if (password === null || password.length === 0) {
            flag = false;
        }

        setIsSubmitActive(flag);


    }, [email, password]);


    async function handleLogin(email, password) {
        const response = await loginApi(email, password);

        if (response.status === 200) {
            const data = response.data;
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            let user = {
                id: data.id,
                nickname: data.nickname,
                age: data.age,
                gender: data.gender
            };

            localStorage.setItem("userInfo", JSON.stringify(user));

            setUser(user);
            setIsLogin(true);

            console.log("login success");

            navigate("/" + MAIN_PATH.root);

            toast("로그인 성공!",
                {
                    icon: '👍',
                    style: TOAST_OPTIONS,
                }
            );
        } else {
            setIsPending(false);
            toast("아이디 또는 비밀번호가 일치하지 않습니다.",
                {
                    icon: '❌',
                    style: TOAST_OPTIONS,
                }
            );
        }


    }


    return (
        <Stack spacing={2} sx={{
            bgcolor: "background.default",
            display: "flex", justifyContent: "center", alignItems: "center",
            height: "100vh"
        }}>

            <Container maxWidth="sm"
                sx={{
                    bgcolor: "background.container",
                    borderRadius: "1.2rem",

                    padding: "3rem 1rem 0rem 1rem",
                }}
            >
                <Typography variant="h4" component="h1"
                    sx={{
                        color: "text.primary", lineHeight: "1.2",
                        fontWeight: 700, marginBottom: "2rem"
                    }}
                >
                    로그인 :)
                </Typography>

                <TextField
                    hiddenLabel
                    color="secondary"
                    label="이메일"
                    placeholder="abc@example.com"
                    type="email"

                    value={email}
                    onChange={(event) => setEmail(event.target.value)}

                    sx={{
                        width: "100%",
                        margin: "3rem 0 1rem 0",
                    }}

                />

                <TextField
                    hiddenLabel
                    color="secondary"
                    label="비밀번호"
                    // placeholder="abc@example.com"
                    type="password"

                    value={password}
                    onChange={(event) => setPassword(event.target.value)}

                    sx={{
                        width: "100%",
                        margin: "0 0 2rem 0",
                    }}

                />



                <LoadingButton
                    sx={{
                        width: "100%",
                        margin: "0rem 0 1.5rem 0",
                    }}
                    size="large"
                    variant="contained" disableElevation color="secondary"
                    disabled={!isSubmitActive}
                    onClick={async () => {
                        setIsPending(true);
                        handleLogin(email, password);
                    }}
                    loading={isPending}
                >
                    로그인
                </LoadingButton>

            </Container>


            <Typography color="text.primary"

                sx={{
                    "display": "inline"

                }}>
                아직 회원이 아니신가요?
                <Typography color="text.primary"
                    onClick={() => {
                        navigate("/" + MAIN_PATH.register);
                    }}
                    sx={{
                        "display": "inline",
                        "margin": "0 0rem 0 0.5rem",
                        "textDecoration": "underline",
                        cursor: "pointer"
                    }}>


                    회원가입
                </Typography>
            </Typography>


        </Stack>


    );
}

export default LoginPage;