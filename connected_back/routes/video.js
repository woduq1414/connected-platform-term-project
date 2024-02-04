const express = require('express');
const router = express.Router();
const db = require('../db');
const csvWriter = require('csv-writer');

const { verifyAccessToken, verifyRefreshToken, checkAccessToken } = require('../utils');
const txtHeader = ['userId', 'roomId', 'socketId', 'watchId', 'bufferedTime', 'currentTime', 'resolution', 'bitrate', 'timestamp'];
const csvWriterHeader = txtHeader.map((el) => {
    return { id: el, title: el };
});
const writer = csvWriter.createObjectCsvWriter({
    path: './logs/data_' + Date.now() + '.csv', // 저장할 CSV 파일 경로 및 이름
    header: csvWriterHeader, // CSV 헤더 설정
    encoding: 'utf8', // 인코딩
});
const saveInterval = 1000 * 10; // 10초마다 데이터 저장

let collectedData = []; // 데이터를 모아둘 배열
let logCount = 0; // 저장된 로그 수

router.post('/likevideo', verifyAccessToken, async (req, res, next) => {
    db.promise().query(`                            
        INSERT INTO video_recommend (user_id, video_id)
        VALUES ('${res.locals.id}', '${req.body.videoId}')
    `).then(() => {
        return res.status(201).json({ message: "비디오 추천 성공" });
    })
        .catch(err => {
            if (err.errno === 1062) {

                db.promise().query(`
                DELETE FROM video_recommend WHERE user_id = '${res.locals.id}' AND video_id = '${req.body.videoId}'
                `)

                return res.status(201).json({ message: "비디오 추천 해제" });
            }
            console.log(err);
        })
});

router.get('/videolist', async (req, res) => {
    let genre = req.query.genre;
    if (!req.query.genre) {
        genre = "";
    }
    if (genre == "urlExist") {
        const [video] = await db.promise().query(`
            SELECT video.id, video.title, video.url, video.thumbnailUrl, video.youtubeUrl, 
            video.duration,
            COUNT(DISTINCT video_recommend.user_id) AS 'like'
            FROM (video
            LEFT JOIN video_recommend ON video.id = video_recommend.video_id) 
            WHERE url IS NOT NULL
            GROUP BY video.id
        `);
        return res.status(200).json({ video: video });
    }
    if (genre == "Topliked") {
        const [video] = await db.promise().query(`
        SELECT video.id, video.title, video.url, video.thumbnailUrl, video.youtubeUrl, 
        video.duration,
        COUNT(DISTINCT video_recommend.user_id) AS 'like'
        FROM (video
        LEFT JOIN video_recommend ON video.id = video_recommend.video_id) 
        GROUP BY video.id
        HAVING \`like\` > 0
        ORDER BY \`like\` DESC
        `);
        return res.status(200).json({ video: video });
    }
    if (genre == "Myliked") {
        try {
            checkAccessToken(req, res, () => { });
        } catch {
            return res.status(200).json({ video: [] });
        }
        const [video] = await db.promise().query(`
        SELECT video.id, video.title, video.url, video.thumbnailUrl, video.youtubeUrl, 
        video.duration,
        COUNT(DISTINCT video_recommend.user_id) AS 'like'
        FROM (video_recommend
        LEFT JOIN video ON video.id = video_recommend.video_id)
        WHERE video_recommend.user_id = ${res.locals.id}
        GROUP BY video.id
        `);
        return res.status(200).json({ video: video });
    }
    if (genre == "Recommend") {
        try {
            checkAccessToken(req, res, () => { });
        } catch {
            return res.status(200).json({ video: [] });
        }
        const [user] = await db.promise().query(`
            SELECT * FROM user WHERE id = '${res.locals.id}'
        `);
        const genre = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama",
            "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction",
            "TV Movie", "Thriller", "War", "Western"]
        let recommend_genre = [];
        let max = 0;
        genre.forEach((x) => {
            if (user[0][x] > max) {
                recommend_genre = [x];
                max = user[0][x]
            } else if (user[0][x] == max) {
                recommend_genre.push(x);
            }
        });
        console.log(recommend_genre);
        if (recommend_genre.length == 1) {
            const [video] = await db.promise().query(`
                SELECT video.id, video.title, video.url, video.thumbnailUrl, video.youtubeUrl, 
                video.duration,
                COUNT(DISTINCT video_recommend.user_id) AS 'like'
                FROM (video
                LEFT JOIN video_recommend ON video.id = video_recommend.video_id) 
                WHERE video.genre LIKE '%${recommend_genre[0]}%'
                GROUP BY video.id
            `);
            return res.status(200).json({ video: video });
        } else if (recommend_genre.length == 2) {
            const [video] = await db.promise().query(`
                SELECT video.id, video.title, video.url, video.thumbnailUrl, video.youtubeUrl, 
                video.duration,
                COUNT(DISTINCT video_recommend.user_id) AS 'like'
                FROM (video
                LEFT JOIN video_recommend ON video.id = video_recommend.video_id) 
                WHERE video.genre LIKE '%${recommend_genre[0]}%${recommend_genre[1]}%'
                GROUP BY video.id
            `);
            return res.status(200).json({ video: video });
        } else {
            num1 = Math.floor(Math.random() * recommend_genre.length);
            num2 = Math.floor(Math.random() * recommend_genre.length);
            while (num1 == num2) {
                num2 = Math.floor(Math.random() * recommend_genre.length);
            }

            const [video] = await db.promise().query(`
                SELECT video.id, video.title, video.url, video.thumbnailUrl, video.youtubeUrl, 
                video.duration,
                COUNT(DISTINCT video_recommend.user_id) AS 'like'
                FROM (video
                LEFT JOIN video_recommend ON video.id = video_recommend.video_id) 
                WHERE video.genre LIKE '%${recommend_genre[num1]}%${recommend_genre[num2]}%'
                GROUP BY video.id
            `);
            return res.status(200).json({ video: video });
        }
    } else {
        const [video] = await db.promise().query(`
            SELECT video.id, video.title, video.url, video.thumbnailUrl, video.youtubeUrl, 
            video.duration,
            COUNT(DISTINCT video_recommend.user_id) AS 'like'
            FROM (video
            LEFT JOIN video_recommend ON video.id = video_recommend.video_id) 
            WHERE video.genre LIKE '%${genre}%'
            GROUP BY video.id
        `);
        return res.status(200).json({ video: video });
    }
})

router.get('/video/:videoId', async (req, res) => {
    try {
        checkAccessToken(req, res, () => { });
    } catch {
        res.locals.id = -1;
    }

    const [video] = await db.promise().query(`
        SELECT video.id, video.title, video.url, video.summary, video.duration, video.genre,
        video.thumbnailUrl, video.youtubeUrl, user_watch.duration AS 'mywatch',
        COUNT(DISTINCT video_recommend.user_id) AS 'like', COUNT(video_recommend.video_id) AS 'mylike'
        FROM (((video
        LEFT JOIN video_recommend ON video.id = video_recommend.video_id)
        LEFT JOIN video_recommend AS my_video_recommend ON video.id = my_video_recommend.video_id AND my_video_recommend.user_id = '${res.locals.id}')
        LEFT JOIN user_watch ON video.id = user_watch.video_id AND user_watch.user_id = '${res.locals.id}')
        WHERE video.id = ${req.params.videoId}
        GROUP BY video.id
    `);
    return res.status(200).json({ video: video });
});

router.get('/search', async (req, res) => {
    let target = req.query.target;
    if (!req.query.target) {
        return res.status(200).json({ video: [] });
    }
    const [video] = await db.promise().query(`
            SELECT video.id, video.title, video.url, video.thumbnailUrl, video.youtubeUrl, 
            video.duration,
            COUNT(DISTINCT video_recommend.user_id) AS 'like'
            FROM (video
            LEFT JOIN video_recommend ON video.id = video_recommend.video_id) 
            WHERE video.title LIKE '%${target}%'
            GROUP BY video.id
        `);
    return res.status(200).json({ video: video });
})


router.post('/userwatch', verifyAccessToken, async (req, res) => {
    if (!req.body.user_id) {
        try {
            await db.promise().query(`
                INSERT INTO user_watch (user_id, video_id, duration)
                VALUES ('${res.locals.id}', '${req.body.videoId}', '${req.body.duration}')
            `);
            const [genre] = await db.promise().query(`
                SELECT genre FROM video
                WHERE video.id = '${req.body.videoId}'
            `);
            const genres = genre[0].genre.split(', ')
            genres.forEach(async (x) => {
                await db.promise().query(`
                    UPDATE user
                    SET \`${x}\` = user.${x} + 1
                    WHERE id = '${res.locals.id}'
                `);
            });
        } catch {
            await db.promise().query(`
                UPDATE user_watch
                SET duration = '${req.body.duration}'
                WHERE user_id = '${res.locals.id}' AND video_id = '${req.body.videoId}'
            `);
        }

    }
    return res.status(201).json({ message: "비디오 기록 저장" });
});

router.post('/log', verifyAccessToken, async (req, res) => {

    let data = req.body;
    data.userId = res.locals.id;

    if (logCount <= 2000) {
        collectedData.push(data);

        logCount++;
    }


    return res.status(201).json({ message: "로그 저장" });


});


setInterval(saveDataToFile, saveInterval);

function saveDataToFile() {
    if (collectedData.length == 0) {
        return; // 저장할 데이터가 없으면 종료
    }
    console.log(collectedData.length);
    // 데이터 CSV 파일에 추가
    writer
        .writeRecords(collectedData)
        .then(() => {
            console.log('데이터 저장 성공');
            collectedData = [];
        })
        .catch((error) => {
            console.error('데이터 저장 중 오류:', error);
        });

}

module.exports = router;