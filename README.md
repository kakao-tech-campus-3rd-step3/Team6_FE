# 얼음땡 (Icebreaking)

> 실시간 아이스브레이킹 게임 플랫폼

카카오테크캠퍼스 3기 경북대학교 2팀 프로젝트

![얼음땡 로고](https://github.com/user-attachments/assets/2e36f1be-3b3e-4967-b670-47d7b522f81e)

## 프로젝트 소개

얼음땡은 처음 만난 사람들이 어색함을 깨고 친해질 수 있도록 돕는 실시간 아이스브레이킹 게임 플랫폼입니다.
방을 생성하여 참가자들을 초대하고, 다양한 게임을 통해 서로를 알아갈 수 있습니다.

### 주요 기능

- **랜덤 룰렛**: 참가자 중 랜덤으로 선정하여 질문에 답하기
- **마니또**: 마니또를 배정받아 서로 알아가기
- **주제 추천**: 관심사별 대화 주제 추천
- **실시간 대기방**: WebSocket 기반 실시간 참가자 관리

## 기술 스택

### Library

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **State Management**: Zustand v5, Tanstack Query v5
- **Real-time Communication**: STOMP.js (WebSocket)
- **Routing**: React Router v7
- **Test** : Vitest

### Code Quality

- **Linting**: ESLint
- **Type Checking**: TypeScript

## 📂 프로젝트 구조

```
src/
├── api/              # REST API 통신 관련
├── assets/           # 정적 리소스 (이미지, 폰트 등)
├── components/       # 재사용 가능한 UI 컴포넌트
│   ├── common/      # 공통 컴포넌트
│   ├── createprofile/ # 프로필 생성 관련
│   ├── createroom/  # 방 생성 관련
│   ├── ending/      # 종료 화면 관련
│   ├── menuselect/  # 게임 선택 관련
│   ├── profilecheck/ # 프로필 확인 관련
│   ├── profileview/ # 프로필 표시 관련
│   ├── randomroulette/ # 랜덤 룰렛 게임 관련
│   ├── topicrecommend/ # 주제 추천 관련
│   └── waitingroom/ # 대기방 관련
├── constants/        # 상수 정의
├── context/          # React Context
├── errors/           # 에러 처리
├── hooks/            # 커스텀 훅
│   ├── createroom/  # 방 생성 관련 훅
│   ├── profilecheck/ # 프로필 확인 관련 훅
│   ├── profileview/ # 프로필 뷰 관련 훅
│   ├── randomroulette/ # 룰렛 게임 관련 훅
│   ├── stomp/       # WebSocket 관련 훅
│   ├── users/       # 사용자 관련 훅
│   └── waitingroom/ # 대기방 관련 훅
├── layouts/          # 레이아웃 컴포넌트
├── lib/              # 외부 라이브러리 설정
├── model/            # 데이터 모델 및 스키마
├── pages/            # 페이지 컴포넌트
├── services/         # 외부 서비스 연동 (STOMP 등)
├── store/            # 전역 상태 관리 (Zustand)
├── styles/           # 전역 스타일
├── types/            # 전역 타입 정의
└── utils/            # 유틸리티 함수
```

## 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

### 빌드

```bash
pnpm build
```

### 프리뷰

```bash
pnpm build
pnpm preview
```

## 주요 화면

### 1. 방 생성 및 대기

- 방 이름, 인원 설정
- 참가자 실시간 확인

![방 생성 및 인원 확인](https://github.com/user-attachments/assets/e35fb5a1-7e0d-42aa-a665-62eaa40555ef)

### 2. 참여자 확인

<table>
  <tr style="text: center;">
    <td>
      <img src="https://github.com/user-attachments/assets/d3eff977-49ea-42ca-ab5b-b293f9f7075e" alt="룰렛 시작 전 이미지" style="width: 100%; max-width: 300px;">
      <br>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/a40c042d-dd64-481b-81df-dd64506ff4b0" alt="이미지 설명 2" style="width: 100%; max-width: 300px;">
      <br>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/097c7053-c70a-4e24-9a9e-f0f8fbcb9cfc" alt="이미지 설명 2" style="width: 100%; max-width: 300px;">
      <br>
    </td>
     <td>
      <img src="https://github.com/user-attachments/assets/4be2ad3a-5db0-46ed-aea7-ab3deb8e6be0" alt="이미지 설명 2" style="width: 100%; max-width: 300px;">
      <br>
    </td>
  </tr>
</table>

### 3. 게임 선택

- 랜덤 룰렛
- 마니또
- 주제 추천
- 종료

![게임 리스트](https://github.com/user-attachments/assets/70a0a35f-295e-44dc-8a28-25b7007b5741)

### 4. 게임 진행

- 실시간 게임 결과 공유

<table>
  <tr style="text: center;">
    <td>
      <img src="https://github.com/user-attachments/assets/d809838d-41d4-467b-8649-83f530c06c40" alt="룰렛 시작 전 이미지" style="width: 100%; max-width: 300px;">
      <br>
      <sub>룰렛 시작 전</sub>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/55cf5b58-bc10-496f-98a4-662a48609efd" alt="이미지 설명 2" style="width: 100%; max-width: 300px;">
      <br>
      <sub>룰렛 결과</sub>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/69b40c6a-6d3d-4ea1-bad2-b2f6c6ac1dce" alt="이미지 설명 2" style="width: 100%; max-width: 300px;">
      <br>
      <sub>대화 주제 추천</sub>
    </td>
     <td>
      <img src="https://github.com/user-attachments/assets/44fa552a-7a6e-4aff-975f-c6e375e83bd7" alt="이미지 설명 2" style="width: 100%; max-width: 300px;">
      <br>
      <sub>마니또</sub>
    </td>
  </tr>
</table>

## 팀원

| 이름   | 역할        | GitHub                                 |
| ------ | ----------- | -------------------------------------- |
| 김건호 | FE 테크리더 | [@kimgho](https://github.com/kimgho)   |
| 차서현 | FE          | [@cktjgus](https://github.com/cktjgus) |
| 최원아 | FE          | [@wnhaoo](https://github.com/wnhaoo)   |

## 백엔드 Github

[경북대 2팀 백엔드 레포지토리](https://github.com/kakao-tech-campus-3rd-step3/Team6_BE)
