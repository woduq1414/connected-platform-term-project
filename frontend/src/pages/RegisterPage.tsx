import {
    Button, Container, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography,
    FormGroup, FormControl, FormControlLabel, Checkbox, InputLabel, Select, MenuItem
} from "@mui/material";

import { useEffect, useState } from "react";

import { LoadingButton } from '@mui/lab';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { MAIN_PATH, TOAST_OPTIONS } from "src/constant";
import { loginApi, registerApi } from "src/api/user";
import { useAuth } from "src/providers/GlobalProvider";
import toast, { Toaster } from "react-hot-toast";


function RegisterPage() {

    const [email, setEmail] = useState<string | null>('');
    const [password, setPassword] = useState<string | null>('');
    const [nickname, setNickname] = useState<string | null>('');
    const [gender, setGender] = useState<string | null>(null);
    const [birthYear, setBirthYear] = useState<number | null>(null);
    const [isAgree, setIsAgree] = useState<boolean>(false);

    const [isPending, setIsPending] = useState<boolean>(false);
    const [isSubmitActive, setIsSubmitActive] = useState<boolean>(false);

    const {
        isLogin, setIsLogin,
        user, setUser
    } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {



        // valid check
        let flag = true;

        if (email === null || email.length === 0) {
            flag = false;
        }
        if (password === null || password.length === 0) {
            flag = false;
        }
        if (nickname === null || nickname.length === 0) {
            flag = false;
        }
        if (gender === null) {
            flag = false;
        }
        if (birthYear === null) {
            flag = false;
        }
        if (isAgree === false || isAgree === null) {
            flag = false;
        }

        setIsSubmitActive(flag);


    }, [email, password, nickname, gender, birthYear, isAgree]);

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
        }


    }

    async function handleRegister() {

        let age = 2023 - birthYear + 1;
        const response = await registerApi(
            email, password, gender, age, nickname
        );
        console.log(response);


        if (response.status === 201) {

            await handleLogin(email, password);

        } else {
            setIsPending(false);

            if (response.status === 400) {
                toast("이미 존재하는 이메일입니다.",
                    {
                        icon: '❌',
                        style: TOAST_OPTIONS,
                    }
                );
            } else {
                toast("회원가입에 실패했습니다.",
                    {
                        icon: '❌',
                        style: TOAST_OPTIONS,
                    }
                );
            }

        }


    }


    return (
        // <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
        <Stack spacing={2} sx={{
            bgcolor: "background.default",
            display: "flex", justifyContent: "center", alignItems: "center",
            height: "100vh"
        }}>
            {/* <Toaster /> */}
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
                    정보를 입력해주세요.
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


                <TextField
                    hiddenLabel
                    color="secondary"
                    label="닉네임"
                    placeholder="홍길동"

                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}


                    sx={{
                        width: "100%",
                        margin: "1rem 0",
                    }}

                />
                <ToggleButtonGroup
                    color="secondary"
                    sx={{
                        width: "100%",
                    }}
                    value={gender}
                    exclusive
                    onChange={(event, newGender) => {
                        setGender(newGender);
                    }}
                    aria-label="text alignment"
                >
                    <ToggleButton value="M"
                        sx={{
                            width: "50%",
                        }}
                    >
                        <Typography variant="body1" component="span">
                            남자
                        </Typography>
                    </ToggleButton>
                    <ToggleButton value="F"
                        sx={{
                            width: "50%",
                        }}
                    >
                        <Typography variant="body1" component="span">
                            여자
                        </Typography>
                    </ToggleButton>

                </ToggleButtonGroup>

                <FormControl fullWidth sx={{
                    margin: "1rem 0",
                }}>
                    <InputLabel id="demo-simple-select-label"
                        color="secondary"
                    >출생년도</InputLabel>
                    <Select
                        color="secondary"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // hiddenLabel
                        label="출생년도"
                        value={birthYear}

                        onChange={(event) => setBirthYear(event.target.value)}
                    >
                        {
                            Array.from({ length: 100 }, (_, i) => i + 1924).reverse().map((year) => (
                                <MenuItem value={year}>{year}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormGroup
                    sx={{
                        margin: "2.5rem 0 0.5rem 0",
                    }}
                >
                    <FormControlLabel control={<Checkbox
                        color="secondary"

                        checked={isAgree}
                        onChange={(event) => setIsAgree(event.target.checked)}

                    />} label="이용약관 및 개인정보처리방침에 동의합니다."

                        sx={{
                            color: "text.primary",


                        }}

                    />

                </FormGroup>

                <LoadingButton
                    sx={{
                        width: "100%",
                        margin: "0rem 0 1.5rem 0",
                    }}
                    size="large"
                    variant="contained" disableElevation color="secondary"
                    disabled={!isSubmitActive}
                    onClick={(handleRegister)}
                    loading={isPending}
                >
                    회원가입
                </LoadingButton>

            </Container>


            <Typography color="text.primary"

                sx={{
                    "display": "inline"

                }}>
                계정이 이미 있으신가요?
                <Typography color="text.primary"
                    onClick={() => {
                        navigate("/" + MAIN_PATH.login);
                    }}
                    sx={{
                        "display": "inline",
                        "margin": "0 0rem 0 0.5rem",
                        "textDecoration": "underline",
                        "cursor": "pointer"
                    }}>
                    로그인
                </Typography>
            </Typography>

        </Stack>
        // </LocalizationProvider>


    );
}

export default RegisterPage;