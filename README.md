# 얼음땡 (Icebreaking)

> 실시간 아이스브레이킹 게임 플랫폼

카카오테크캠퍼스 3기 경북대학교 2팀 프로젝트

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
│   ├── common/      # 공통 컴포넌트 (Button, Modal 등)
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

### 2. 게임 선택

- 랜덤 룰렛
- 마니또
- 주제 추천
- 종료

### 3. 게임 진행

- 실시간 게임 결과 공유
- 참가자 프로필 확인

## 팀원

| 이름     | 역할          | GitHub                                   |
| -------- | ------------- | ---------------------------------------- |
| [김건호] | [FE 테크리더] | [@kimgho](https://github.com/kimgho)     |
| [차서현] | [FE]          | [@cktjgus](https://github.com/cktjgus)   |
| [최원아] | [FE]          | [@wnhaoo](https://github.com/wnhaoo)     |
| ------   | ------        | ---------------------------------------- |
