const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
require("dotenv").config();


const { verifyAccessToken, verifyRefreshToken, checkAccessToken } = require('../utils');



router.post('/signup', async (req, res) => {



    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, encrypted) => {
            db.promise().query(`
                INSERT INTO user (email, password, gender, age, nickname)
                VALUES ('${req.body.email}', '${encrypted}', '${req.body.gender}', '${req.body.age}', '${req.body.nickname}')
            `).then(() => {
                return res.status(201).json({ message: "회원가입 성공" });
            })
                .catch(err => {
                    if (err.errno === 1062) {
                        return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
                    }
                    console.log(err);
                })
        })
    })
});

router.post('/login', async (req, res) => {
    const [user] = await db.promise().query(`
        SELECT id, password, gender, age, nickname FROM user WHERE email = '${req.body.email}'
    `);
    if (user.length == 0) {
        return res.status(404).json({ message: "존재하지 않는 이메일입니다." });
    }
    console.log(process.env.JWT_SECRET_KEY);
    bcrypt.compare(req.body.password, user[0].password, async (err, same) => {
        if (same) {
            const accessToken = jwt.sign(
                {
                    id: user[0].id,
                    nickname: user[0].nickname
                },
                `${process.env.JWT_SECRET_KEY}`,
                { algorithm: 'HS256', expiresIn: '1d' }
            );
            const refreshToken = jwt.sign(
                { id: user[0].id },
                `${process.env.JWT_SECRET_KEY}`,
                { algorithm: 'HS256', expiresIn: '30d' }
            );

            return res.status(200).json({
                id: user[0].id,
                gender: user[0].gender,
                age: user[0].age,
                nickname: user[0].nickname,
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } else {
            return res.status(400).json({ message: "잘못된 비밀번호입니다." });
        }
    })
});

router.get("/logout", verifyAccessToken, (req, res, next) => {
    res.status(200).json({ message: "로그아웃 성공" });
});

router.delete("/unlink", verifyAccessToken, async (req, res, next) => {
    await db.promise().query(`DELETE FROM user WHERE id = ${req.query.id}`);
    res.status(200).json({ message: "회원탈퇴 성공" });
});

router.get("/refreshToken", verifyRefreshToken, async (req, res, next) => {
    const [user] = await db.promise().query(`
    SELECT id, gender, age, nickname From user WHERE id = ${res.locals.id}
    `);
    console.log(user, "user", res.locals.id);
    if (user.length == 0) {
        return res.status(404).json({ message: "존재하지 않는 회원입니다." });
    }
    const accessToken = jwt.sign(
        { id: user[0].id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1d' }
    );
    const refreshToken = jwt.sign(
        { id: user[0].id },
        `${process.env.JWT_SECRET_KEY}`,
        { algorithm: 'HS256', expiresIn: '30d' }
    );
    return res.status(200).json({
        id: user[0].id,
        gender: user[0].gender,
        age: user[0].age,
        nickname: user[0].nickname,
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
});

// router.get('/like', verifyAccessToken, async (req, res) => {
//     const [video] = await db.promise().query(`
//         SELECT video.id, video.title, video.url,
//         COUNT(DISTINCT video_recommend.user_id) AS 'like'
//         FROM (video_recommend
//         LEFT JOIN video ON video.id = video_recommend.video_id)
//         WHERE video_recommend.user_id = ${req.query.user_id}
//         GROUP BY video.id
//     `);
//     return res.status(200).json({ video: video });
// })

router.get('/me', verifyAccessToken, async (req, res) => {
    const [user] = await db.promise().query(`
    SELECT id, gender, age, nickname From user WHERE id = ${res.locals.id}
    `);
    if (user.length == 0) {
        return res.status(404).json({ message: "존재하지 않는 회원입니다." });
    }
    return res.status(200).json({
        id: user[0].id,
        gender: user[0].gender,
        age: user[0].age,
        nickname: user[0].nickname,
    });
});

    module.exports = router;