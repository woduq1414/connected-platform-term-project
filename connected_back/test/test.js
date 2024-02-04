const request = require('supertest');
require('dotenv').config();
process.env.NODE_ENV = "test";
const app = require('../app');
const { expect } = require('chai');


let accessToken, refreshToken;

describe('User API', () => {
  describe('POST /user/signup', () => {
    it('should create a new user', (done) => {
      const newUser = {
        email: `test${Math.random(1, 100000)}@example.com`,
        password: 'password',
        gender: 'M',
        age: 25,
        nickname: 'testuser'
      };

      request(app)
        .post('/api/user/signup')
        .send(newUser)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('should return 409 if email is duplicated', (done) => {
      const newUser = {
        email: `user@example.com`,
        password: 'password',
        gender: 'M',
        age: 25,
        nickname: 'testuser'
      };

      request(app)
        .post('/api/user/signup')
        .send(newUser)
        .expect(409)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });

  describe('POST /user/login', () => {
    it('should log in a user', (done) => {
      const userCredentials = {
        email: 'user@example.com',
        password: 'qwe123'
      };

      request(app)
        .post('/api/user/login')
        .send(userCredentials)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('gender');
          expect(res.body).to.have.property('age');
          expect(res.body).to.have.property('nickname');
          expect(res.body).to.have.property('accessToken');
          expect(res.body).to.have.property('refreshToken');

          accessToken = res.body.accessToken;
          refreshToken = res.body.refreshToken;

          done();
        });
    });

    it('should return 404 if email does not exist', (done) => {
      const userCredentials = {
        email: 'nonexistent@example.com',
        password: 'password'
      };

      request(app)
        .post('/api/user/login')
        .send(userCredentials)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('should return 400 if password is incorrect', (done) => {
      const userCredentials = {
        email: 'user@example.com',
        password: 'qwe123412'
      };

      request(app)
        .post('/api/user/login')
        .send(userCredentials)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });

  describe('GET /api/user/refreshToken', () => {
    it('should refresh access token', (done) => {


      request(app)
        .get('/api/user/refreshToken')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('gender');
          expect(res.body).to.have.property('age');
          expect(res.body).to.have.property('nickname');
          expect(res.body).to.have.property('accessToken');
          expect(res.body).to.have.property('refreshToken');
          done();
        });
    });

    it('should return 400 if refresh token is missing', (done) => {
      request(app)
        .get('/api/user/refreshToken')
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('should return 401 if refresh token is invalid', (done) => {
      const tempRefreshToken = "not a valid refresh token"

      request(app)
        .get('/api/user/refreshToken')
        .set('Authorization', `Bearer ${tempRefreshToken}`)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });

  describe('GET /api/user/me', () => {
    it('should return user information', (done) => {

      request(app)
        .get('/api/user/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('gender');
          expect(res.body).to.have.property('age');
          expect(res.body).to.have.property('nickname');
          done();
        });
    });

    it('should return 400 if access token is missing', (done) => {
      request(app)
        .get('/api/user/me')
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('should return 401 if access token is invalid', (done) => {
      const accessToken = 'invalid-access-token';

      request(app)
        .get('/api/user/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });
});

describe('Video API', () => {
  describe('POST /api/video/likevideo', () => {
    it('should like a video', (done) => {
      const videoId = 1;

      request(app)
        .post('/api/video/likevideo')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ videoId })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });
    it('should return 400 if access token is missing', (done) => {
      const videoId = 1;

      request(app)
        .post('/api/video/likevideo')
        .send({ videoId })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });
    it('should return 401 if access token is invalid', (done) => {
      const videoId = 1;
      const invalidAccessToken = 'invalid-access-token';

      request(app)
        .post('/api/video/likevideo')
        .set('Authorization', `Bearer ${invalidAccessToken}`)
        .send({ videoId })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });

  });

  describe('GET /api/video/videolist', () => {
    it('should get video list without authorization', (done) => {
      request(app)
        .get('/api/video/videolist')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('video');
          done();
        });
    });

    it('should get video list with genre filter', (done) => {
      const genre = 'action';

      request(app)
        .get(`/api/video/videolist?genre=${genre}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('video');
          done();
        });
    });
  });

  describe('GET /api/video/search', () => {
    it('should search videos by title', (done) => {
      const target = 'sinte';

      request(app)
        .get(`/api/video/search?target=${target}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('video');

          expect(res.body.video).to.have.length.greaterThan(0);

          expect(res.body.video[0]).to.have.property('title');
          expect(res.body.video[0].title).to.equal('Sintel');
          done();
        });
    });

  });

  describe('GET /api/video/video/:videoId', () => {
    it('should get video details without authorization', (done) => {
      const videoId = 1;

      request(app)
        .get(`/api/video/video/${videoId}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('video');



          expect(res.body.video).to.have.length.greaterThan(0);

          expect(res.body.video[0]).to.have.property('id');
          expect(res.body.video[0]).to.have.property('title');
          expect(res.body.video[0]).to.have.property('url');
          expect(res.body.video[0]).to.have.property('like');
          expect(res.body.video[0]).to.have.property('thumbnailUrl');
          expect(res.body.video[0]).to.have.property('youtubeUrl');
          expect(res.body.video[0]).to.have.property('duration');

          done();
        });
    });

    it('should get video details with authorization', (done) => {
      const videoId = 1;

      request(app)
        .get(`/api/video/video/${videoId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('video');

          
          expect(res.body.video).to.have.length.greaterThan(0);

          expect(res.body.video[0]).to.have.property('id');
          expect(res.body.video[0]).to.have.property('title');
          expect(res.body.video[0]).to.have.property('url');
          expect(res.body.video[0]).to.have.property('like');
          expect(res.body.video[0]).to.have.property('thumbnailUrl');
          expect(res.body.video[0]).to.have.property('youtubeUrl');
          expect(res.body.video[0]).to.have.property('duration');
          expect(res.body.video[0]).to.have.property('mylike');
          expect(res.body.video[0]).to.have.property('summary');
          expect(res.body.video[0]).to.have.property('genre');

          done();
        });
    });
  });

  describe('POST /api/video/userwatch', () => {
    it('should update user watch history', (done) => {
      const videoId = 1;
      const duration = 100;

      request(app)
        .post('/api/video/userwatch')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ videoId, duration })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });

  describe('POST /api/video/log', () => {
    it('should save playback log', (done) => {
      const logData = {
        watchId: 'watch-id',
        roomId: 'room-id',
        socketId: 'socket-id',
        bufferedTime: 60,
        currentTime: 120,
        resolution: '720p',
        bitrate: 2000,
        timestamp: 1622722400,
      };

      request(app)
        .post('/api/video/log')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(logData)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });
});