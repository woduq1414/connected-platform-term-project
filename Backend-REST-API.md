# REST-API 문서

## 1. 유저 정보 관련 API
유저와 관련된 정보를 저장하는 API입니다.

---
### 1-1. 회원가입
데이터베이스에 유저의 이메일, 암호화된 비밀번호, 성별, 나이, 닉네임을 저장합니다.

**Request**

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| 01-1 | /api/user/signup | http://localhost:4000 | POST |

**Body**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| email | String | 유저의 이메일 | TRUE |
| password | String | 유저의 비밀번호 | TRUE |
| gender | String | 유저의 성별(여자: 'F', 남자: 'M') | TRUE |
| age | Number | 유저의 나이 | TRUE |
| nickname | String | 유저의 닉네임 | TRUE |

**Response**

요청에 실패했을 때 (status code: 400), 중복 이메일 (status code: 409)

| Name | Type | Description | 
| --- | --- | --- |
| message | string | 로그인에 실패한 이유 |

요청에 성공했을 때 (status code: 201)
| Name | Type | Description | 
| --- | --- | --- |
| message | string | 성공 메시지 |

---

### 1-2 로그인
데이터베이스에 저장되어 있는 유저의 정보와 비교하여 로그인을 성공시킬지 말지를 결정합니다.

**Request**

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| 01-2 | /api/user/login | http://localhost:4000 | POST |

**Body**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| email | String | 유저의 이메일 | TRUE |
| password | String | 유저의 비밀번호 | TRUE |

**Response**

이메일 미존재(status code: 404) 또는 비밀번호 불일치(status code: 400) 

| Name | Type | Description | 
| --- | --- | --- |
| message | string | 로그인에 실패한 이유 |

요청에 성공했을 때 (status code: 200)
| Name | Type | Description | 
| --- | --- | --- |
| id | Number | 유저의 id |
| gender | String | 유저의 성별 |
| age | Number | 유저의 나이 |
| nickname | String | 유저의 닉네임 |
| accessToken | String | 액세스 토큰 값 |
| refreshToken | String | 리프레시 토큰 값 |

---

### 1-3 로그아웃
유저의 로그아웃 요청이 가능한지 확인합니다.

**Request**

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| 01-3 | /api/user/logout | http://localhost:4000 | GET |

**Header**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| Authorization | String | 액세스 토큰 값 Bearer ${ACCESS_TOKEN} | TRUE |

---

### 1-4 회원탈퇴
유저의 정보를 데이터베이스에서 삭제합니다.

**Request**

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| 01-4 | /api/user/unlink | http://localhost:4000 | DELETE |

**Header**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| Authorization | String | 액세스 토큰 값 Bearer ${ACCESS_TOKEN} | TRUE |

---

### 1-5 refreshToken 검증
refreshToken을 검증하고 새 accessToken를 발급합니다.

**Request**

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| 01-5 | /api/user/refreshToken | http://localhost:4000 | GET |

**Header**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| Authorization | String | 리프레쉬 토큰 값 Bearer ${REFRESH_TOKEN} | TRUE |

**Response**

토큰 미전송(status code : 400), 유효하지 않은 토큰 전송(status code : 401), 미존재 회원(status code: 404), 만료된 리프레쉬 토큰(status code: 420)

| Name | Type | Description | 
| --- | --- | --- |
| message | string | 로그인에 실패한 이유 |

요청에 성공했을 때 (status code: 200)
| Name | Type | Description | 
| --- | --- | --- |
| id | Number | 유저의 id |
| gender | String | 유저의 성별 |
| age | Number | 유저의 나이 |
| nickname | String | 유저의 닉네임 |
| accessToken | String | 액세스 토큰 값 |
| refreshToken | String | 리프레시 토큰 값 |



---

### 1-6 내 정보
accessToken을 검증하고 유저의 정보를 반환합니다.

**Request**

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| 01-6 | /api/user/me | http://localhost:4000 | GET |

**Header**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| Authorization | String | 액세스 토큰 값 Bearer ${ACCESS_TOKEN} | TRUE |

**Response**

토큰 미전송(status code : 400), 유효하지 않은 토큰 전송(status code : 401), 미존재 회원(status code: 404), 만료된 액세스 토큰(status code: 409)

| Name | Type | Description | 
| --- | --- | --- |
| message | string | 로그인에 실패한 이유 |

요청에 성공했을 때 (status code: 200)
| Name | Type | Description | 
| --- | --- | --- |
| id | Number | 유저의 id |
| gender | String | 유저의 성별 |
| age | Number | 유저의 나이 |
| nickname | String | 유저의 닉네임 |



---

## 2. 비디오 정보 관련 API
비디오와 관련된 정보를 저장하는 API입니다.

---
### 2-1 비디오 추천
유저가 비디오를 추천하거나 추천을 취소합니다.

**Request**

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| 02-1 | /api/video/likevideo | http://localhost:4000 | POST |

**Header**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| Authorization | String | 액세스 토큰 값 Bearer ${ACCESS_TOKEN} | TRUE |

**Body**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| videoId | Number | 비디오의 id | TRUE |

**Response**

토큰 미전송(status code : 400), 유효하지 않은 토큰 전송(status code : 401), 미존재 회원(status code: 404), 만료된 액세스 토큰(status code: 409)

| Name | Type | Description | 
| --- | --- | --- |
| message | string | 로그인에 실패한 이유 |

요청에 성공했을 때 (status code: 201)
| Name | Type | Description | 
| --- | --- | --- |
| message | string | 완료 메시지 |




---
### 2-2 비디오 목록
데이터베이스에 존재하는 비디오의 목록을 보여줍니다.

**Request**

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| 02-2 | /api/video/videolist | http://localhost:4000 | GET |

**Header**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| Authorization | String | 액세스 토큰 값 Bearer ${ACCESS_TOKEN} | FALSE |

**Query**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| genre | String | 선택한 장르 | FALSE |

**Response**

요청에 성공했을 때 (status code: 200)

| Name | Type | Description | 
| --- | --- | --- |
| video | Array[Video] | 비디오 목록 |

***Video***
| Name | Type | Description |
| --- | --- | --- |
| id | Number | 비디오의 id |
| title | String | 비디오 제목 |
| url | String | 비디오 주소 |
| like | Number | 비디오 추천수 |
| thumbnailUrl | String | 비디오 썸네일 주소 |
| youtubeUrl | String | 비디오 유튜브 주소 |
| duration | number | 비디오 길이 |

---

### 2-3 비디오 검색
제목을 통해 비디오를 검색합니다.

**Request**

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| 02-3 | /api/video/search | http://localhost:4000 | GET |

**Query**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| target | String | 검색어 | TRUE |

**Response**

요청에 성공했을 때 (status code: 200)

| Name | Type | Description | 
| --- | --- | --- |
| video | Array[Video] | 비디오 목록 |

***Video***
| Name | Type | Description |
| --- | --- | --- |
| id | Number | 비디오의 id |
| title | String | 비디오 제목 |
| url | String | 비디오 주소 |
| like | Number | 비디오 추천수 |
| thumbnailUrl | String | 비디오 썸네일 주소 |
| youtubeUrl | String | 비디오 유튜브 주소 |
| duration | number | 비디오 길이 |

---

### 2-4 비디오 상세보기

선택한 비디오에 대한 상세한 정보를 확인합니다.

**Request**

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| 02-4 | /api/video/video/:videoId | http://localhost:4000 | GET |

**Header**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| Authorization | String | 액세스 토큰 값 Bearer ${ACCESS_TOKEN} | FALSE |

**Params**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| videoId | Number | 비디오의 id | TRUE |

**Response**

요청에 성공했을 때 (status code: 200)

| Name | Type | Description | 
| --- | --- | --- |
| video | Array[VideoDetail] | 비디오 세부 정보 목록 |

***VideoDetail***
| Name | Type | Description | 
| --- | --- | --- |
| id | Number | 비디오의 id |
| title | String | 비디오 제목 |
| url | String | 비디오 주소 |
| summary | String | 비디오 줄거리 |
| duration | String | 비디오의 길이 |
| genre | String | 비디오의 장르 |
| like | Number | 비디오 추천수 |
| mylike | Number | 유저의 추천여부 |
| thumbnailUrl | String | 비디오 썸네일 주소 |
| youtubeUrl | String | 비디오 유튜브 주소 |
| duration | number | 비디오 길이 |

---


### 2-5 재생 기록

재생 기록을 업데이트 합니다.

**Request**

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| 02-5 | /api/video/userwatch | http://localhost:4000 | POST |

**Header**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| Authorization | String | 액세스 토큰 값 Bearer ${ACCESS_TOKEN} | TRUE |

**Body**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| videoId | Number | 비디오의 id | TRUE |
| duration | Number | 재생 시간 | TRUE |

**Response**

토큰 미전송(status code : 400), 유효하지 않은 토큰 전송(status code : 401), 미존재 회원(status code: 404), 만료된 액세스 토큰(status code: 409)

| Name | Type | Description | 
| --- | --- | --- |
| message | string | 실패한 이유 |

요청에 성공했을 때 (status code: 201)
| Name | Type | Description | 
| --- | --- | --- |
| message | string | 완료 메시지 |


### 2-6 재생 로그 저장

재생 로그를 저장합니다.

**Request**

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| 02-6 | /api/video/log | http://localhost:4000 | POST |

**Header**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| Authorization | String | 액세스 토큰 값 Bearer ${ACCESS_TOKEN} | TRUE |

**Body**
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| watchId | String | 비디오의 id | TRUE |
| roomId | String | 방의 id | TRUE |
| socketId | String | 소켓의 id | TRUE |
| bufferedTime | Number | 버퍼에 쌓인 초 | TRUE |
| currentTime | Number | 플레이어 재생 시점 | TRUE |
| resolution | String | 해상도 | TRUE |
| bitrate | Number | 비트레이트 | TRUE |
| timestamp | Number | 현재 시각 타임스탬프 | TRUE |

**Response**

토큰 미전송(status code : 400), 유효하지 않은 토큰 전송(status code : 401), 미존재 회원(status code: 404), 만료된 액세스 토큰(status code: 409)

| Name | Type | Description | 
| --- | --- | --- |
| message | string | 실패한 이유 |

요청에 성공했을 때 (status code: 201)
| Name | Type | Description | 
| --- | --- | --- |
| message | string | 완료 메시지 |
