# API 테스트 계획서

## Overview

    cd connected_back
    yarn test

를 통해 백엔드 API를 자동으로 테스트합니다.

---

## User API Test Plan

### POST /user/signup

#### 테스트 케이스 1: Create a new user

- Description: Test if the API successfully creates a new user.
- Request:
  - Method: POST
  - URL: /api/user/signup
  - Body:
    ```json
    {
      "email": "test@example.com",
      "password": "password",
      "gender": "M",
      "age": 25,
      "nickname": "testuser"
    }
    ```
- Expected Response:
  - Status Code: 201 (Created)
  - Body:
    ```json
    {
      "message": "<message>"
    }
    ```

#### 테스트 케이스 2: Duplicate email

- Description: Test if the API returns an error when duplicate email is provided.
- Request:
  - Method: POST
  - URL: /api/user/signup
  - Body:
    ```json
    {
      "email": "user@example.com",
      "password": "password",
      "gender": "M",
      "age": 25,
      "nickname": "testuser"
    }
    ```
- Expected Response:
  - Status Code: 409 (Conflict)
  - Body:
    ```json
    {
      "message": "<message>"
    }
    ```

### POST /user/login

#### 테스트 케이스 1: Log in a user

- Description: Test if the API successfully logs in a user.
- Request:
  - Method: POST
  - URL: /api/user/login
  - Body:
    ```json
    {
      "email": "user@example.com",
      "password": "qwe123"
    }
    ```
- Expected Response:
  - Status Code: 200 (OK)
  - Body:
    ```json
    {
      "id": "<user_id>",
      "gender": "<user_gender>",
      "age": "<user_age>",
      "nickname": "<user_nickname>",
      "accessToken": "<access_token>",
      "refreshToken": "<refresh_token>"
    }
    ```

#### 테스트 케이스 2: Email does not exist

- Description: Test if the API returns an error when the provided email does not exist.
- Request:
  - Method: POST
  - URL: /api/user/login
  - Body:
    ```json
    {
      "email": "nonexistent@example.com",
      "password": "password"
    }
    ```
- Expected Response:
  - Status Code: 404 (Not Found)
  - Body:
    ```json
    {
      "message": "<message>"
    }
    ```

#### 테스트 케이스 3: Incorrect password

- Description: Test if the API returns an error when the provided password is incorrect.
- Request:
  - Method: POST
  - URL: /api/user/login
  - Body:
    ```json
    {
      "email": "user@example.com",
      "password": "qwe123412"
    }
    ```
- Expected Response:
  - Status Code: 400 (Bad Request)
  - Body:
    ```json
    {
      "message": "<message>"
    }
    ```

### GET /api/user/refreshToken

#### 테스트 케이스 1: Refresh access token

- Description: Test if the API successfully refreshes the access token.
- Request:
  - Method: GET
  - URL: /api/user/refreshToken
  - Headers:
    ```
    Authorization: Bearer <refresh_token>
    ```
- Expected Response:
  - Status Code: 200 (OK)
  - Body:
    ```json
    {
      "id": "<user_id>",
      "gender": "<user_gender>",
      "age": "<user_age>",
      "nickname": "<user_nickname>",
      "accessToken": "<new_access_token>",
      "refreshToken": "<new_refresh_token>"
    }
    ```

#### 테스트 케이스 2: Refresh token is missing

- Description: Test if the API returns an error when the refresh token is missing.
- Request:
  - Method: GET
  - URL: /api/user/refreshToken
- Expected Response:
  - Status Code: 400 (Bad Request)
  - Body:
    ```json
    {
      "message": "<message>"
    }
    ```

#### 테스트 케이스 3: Invalid refresh token

- Description: Test if the API returns an error when the refresh token is invalid.
- Request:
  - Method: GET
  - URL: /api/user/refreshToken
  - Headers:
    ```
    Authorization: Bearer <invalid_refresh_token>
    ```
- Expected Response:
  - Status Code: 401 (Unauthorized)
  - Body:
    ```json
    {
      "message": "<message>"
    }
    ```

### GET /api/user/me

#### 테스트 케이스 1: Get user information

- Description: Test if the API successfully returns user information.
- Request:
  - Method: GET
  - URL: /api/user/me
  - Headers:
    ```
    Authorization: Bearer <access_token>
    ```
- Expected Response:
  - Status Code: 200 (OK)
  - Body:
    ```json
    {
      "id": "<user_id>",
      "gender": "<user_gender>",
      "age": "<user_age>",
      "nickname": "<user_nickname>"
    }
    ```

#### 테스트 케이스 2: Access token is missing

- Description: Test if the API returns an error when the access token is missing.
- Request:
  - Method: GET
  - URL: /api/user/me
- Expected Response:
  - Status Code: 400 (Bad Request)
  - Body:
    ```json
    {
      "message": "<message>"
    }
    ```

#### 테스트 케이스 3: Invalid access token

- Description: Test if the API returns an error when the access token is invalid.
- Request:
  - Method: GET
  - URL: /api/user/me
  - Headers:
    ```
    Authorization: Bearer <invalid_access_token>
    ```
- Expected Response:
  - Status Code: 401 (Unauthorized)
  - Body:
    ```json
    {
      "message": "<message>"
    }
    ```



---

## Video API Test Plan

### POST /api/video/likevideo

#### 테스트 케이스 1: Like a video

- Description: Test if the API successfully likes a video.
- Request:
  - Method: POST
  - URL: /api/video/likevideo
  - Headers:
    ```
    Authorization: Bearer <access_token>
    ```
  - Body:
    ```json
    {
      "videoId": 1
    }
    ```
- Expected Response:
  - Status Code: 201 (Created)
  - Body:
    ```json
    {
      "message": "<message>"
    }
    ```

#### 테스트 케이스 2: Access token is missing

- Description: Test if the API returns an error when the access token is missing.
- Request:
  - Method: POST
  - URL: /api/video/likevideo
  - Body:
    ```json
    {
      "videoId": 1
    }
    ```
- Expected Response:
  - Status Code: 400 (Bad Request)
  - Body:
    ```json
    {
      "message": "<message>"
    }
    ```

#### 테스트 케이스 3: Invalid access token

- Description: Test if the API returns an error when the access token is invalid.
- Request:
  - Method: POST
  - URL: /api/video/likevideo
  - Headers:
    ```
    Authorization: Bearer <invalid_access_token>
    ```
  - Body:
    ```json
    {
      "videoId": 1
    }
    ```
- Expected Response:
  - Status Code: 401 (Unauthorized)
  - Body:
    ```json
    {
      "message": "<message>"
    }
    ```

### GET /api/video/videolist

#### 테스트 케이스 1: Get video list without authorization

- Description: Test if the API successfully returns the video list without authorization.
- Request:
  - Method: GET
  - URL: /api/video/videolist
- Expected Response:
  - Status Code: 200 (OK)
  - Body:
    ```json
    {
      "video": ["<video_list>"]
    }
    ```

#### 테스트 케이스 2: Get video list with genre filter

- Description: Test if the API successfully returns the video list with a genre filter.
- Request:
  - Method: GET
  - URL: /api/video/videolist?genre=<genre>
  - Headers:
    ```
    Authorization: Bearer <access_token>
    ```
- Expected Response:
  - Status Code: 200 (OK)
  - Body:
    ```json
    {
      "video": ["<video_list>"]
    }
    ```

### GET /api/video/search

#### 테스트 케이스 1: Search videos by title

- Description: Test if the API successfully searches videos by title.
- Request:
  - Method: GET
  - URL: /api/video/search?target=<target>
- Expected Response:
  - Status Code: 200 (OK)
  - Body:
    ```json
    {
      "video": ["<search_result>"]
    }
    ```

### GET /api/video/video/:videoId

#### 테스트 케이스 1: Get video details without authorization

- Description: Test if the API successfully returns video details without authorization.
- Request:
  - Method: GET
  - URL: /api/video/video/:videoId
- Expected Response:
  - Status Code: 200 (OK)
  - Body:
    ```json
    {
      "video": ["<video_details>"]
    }
    ```

#### 테스트 케이스 2: Get video details with authorization

- Description: Test if the API successfully returns video details with authorization.
- Request:
  - Method: GET
  - URL: /api/video/video/:videoId
  - Headers:
    ```
    Authorization: Bearer <access_token>
    ```
- Expected Response:
  - Status Code: 200 (OK)
  - Body:
    ```json
    {
      "video": ["<video_details>"]
    }
    ```

### POST /api/video/userwatch

#### 테스트 케이스 1: Update user watch history

- Description: Test if the API successfully updates the user's watch history.
- Request:
  - Method: POST
  - URL: /api/video/userwatch
  - Headers:
    ```
    Authorization: Bearer <access_token>
    ```
  - Body:
    ```json
    {
      "videoId": 1,
      "duration": 100
    }
    ```
- Expected Response:
  - Status Code: 201 (Created)
  - Body:
    ```json
    {
      "message": "<message>"
    }
    ```

### POST /api/video/log

#### 테스트 케이스 1: Save playback log

- Description: Test if the API successfully saves the playback log.
- Request:
  - Method: POST
  - URL: /api/video/log
  - Headers:
    ```
    Authorization: Bearer <access_token>
    ```
  - Body:
    ```json
    {
      "watchId": "watch-id",
      "roomId": "room-id",
      "socketId": "socket-id",
      "bufferedTime": 60,
      "currentTime": 120,
      "resolution": "720p",
      "bitrate": 2000,
      "timestamp": 1622722400
    }
    ```
- Expected Response:
  - Status Code: 201 (Created)
  - Body:
    ```json
    {
      "message": "<message>"
    }
    ```

---

