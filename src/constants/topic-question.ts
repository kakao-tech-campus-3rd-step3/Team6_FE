import type { InterestType } from "./interests";

export type TopicQA = { title: string; description: string };

export const TOPIC_QUESTIONS: Record<InterestType, TopicQA[]> = {
  스포츠: [
    {
      title: "좋아하는 스포츠 종목",
      description: "자주 보는 경기나 직접 하는 스포츠가 있나요?",
    },
    { title: "응원 경험", description: "현장에서 응원해 본 경험이 있나요?" },
    {
      title: "선호하는 선수",
      description: "가장 좋아하는 선수나 팀은 누구인가요?",
    },
  ],
  음악: [
    {
      title: "음악 취향",
      description: "주로 즐겨 듣는 음악 장르는 무엇인가요?",
    },
    { title: "공연 경험", description: "기억에 남는 콘서트나 공연이 있나요?" },
    {
      title: "악기 연주",
      description: "배워본 적 있거나 배우고 싶은 악기가 있나요?",
    },
  ],
  영화: [
    {
      title: "영화 취향",
      description: "가장 좋아하는 영화 장르는 무엇인가요?",
    },
    {
      title: "기억에 남는 영화",
      description: "인생 영화가 있다면 어떤 작품인가요?",
    },
    { title: "관람 장소", description: "영화관과 집 중 어디를 선호하나요?" },
  ],
  도서: [
    {
      title: "좋아하는 책",
      description: "최근에 읽은 책 중 기억에 남는 것은?",
    },
    {
      title: "독서 습관",
      description: "종이책 vs 전자책, 어떤 걸 선호하나요?",
    },
    {
      title: "추천 도서",
      description: "다른 사람에게 추천하고 싶은 책이 있나요?",
    },
  ],
  여행: [
    { title: "여행 취향", description: "국내와 해외 중 어디를 선호하나요?" },
    {
      title: "기억에 남는 여행",
      description: "인상 깊었던 여행지는 어디인가요?",
    },
    { title: "버킷리스트", description: "꼭 가보고 싶은 여행지가 있나요?" },
  ],
  음식: [
    {
      title: "선호 음식",
      description: "자주 먹는 음식이나 좋아하는 음식이 있나요?",
    },
    { title: "특별한 경험", description: "기억에 남는 식사 경험이 있나요?" },
    { title: "추천 음식점", description: "추천하고 싶은 맛집이 있나요?" },
  ],
  기술: [
    {
      title: "관심 있는 기술",
      description: "요즘 눈여겨보는 기술 트렌드는 무엇인가요?",
    },
    { title: "도구 활용", description: "자주 사용하는 앱이나 툴이 있나요?" },
    {
      title: "미래 전망",
      description: "앞으로 가장 주목할 기술은 무엇이라고 생각하나요?",
    },
  ],
  게임: [
    { title: "게임 취향", description: "주로 어떤 장르를 좋아하나요?" },
    { title: "최근 플레이", description: "가장 재미있게 한 최근 게임은?" },
    { title: "추억의 게임", description: "어릴 적 기억에 남는 게임은?" },
  ],
  예술: [
    {
      title: "예술 취향",
      description: "미술, 무용, 연극 중 어떤 예술을 좋아하나요?",
    },
    { title: "전시 경험", description: "기억에 남는 전시회나 공연이 있나요?" },
    { title: "창작 경험", description: "직접 창작해 본 경험이 있나요?" },
  ],
  사진: [
    {
      title: "사진 취향",
      description: "풍경, 인물, 음식 중 무엇을 주로 찍나요?",
    },
    { title: "촬영 장비", description: "휴대폰 vs 카메라, 무엇을 쓰나요?" },
    { title: "인상적인 사진", description: "가장 마음에 드는 본인 사진은?" },
  ],
  패션: [
    { title: "패션 스타일", description: "자주 입는 옷 스타일은 무엇인가요?" },
    {
      title: "쇼핑 습관",
      description: "온라인과 오프라인 중 어디서 주로 쇼핑하나요?",
    },
    { title: "패션 영감", description: "패션 영감을 어디서 얻나요?" },
  ],
  피트니스: [
    { title: "운동 루틴", description: "헬스장에서 어떤 운동을 주로 하나요?" },
    {
      title: "목표",
      description: "운동을 통해 이루고 싶은 목표는 무엇인가요?",
    },
    { title: "동기부여", description: "꾸준히 운동할 수 있는 비결이 있나요?" },
  ],
  건강: [
    { title: "건강 습관", description: "매일 챙기는 건강 습관이 있나요?" },
    {
      title: "식습관",
      description: "건강을 위해 특별히 지키는 식습관이 있나요?",
    },
    { title: "스트레스 관리", description: "스트레스를 어떻게 관리하나요?" },
  ],
  야외활동: [
    {
      title: "활동 취향",
      description: "캠핑, 낚시, 피크닉 중 어떤 걸 좋아하나요?",
    },
    { title: "자연 경험", description: "자연 속에서 인상 깊었던 경험은?" },
    {
      title: "계절별 활동",
      description: "어떤 계절에 어떤 야외활동을 즐기나요?",
    },
  ],
  등산: [
    { title: "등산 경험", description: "최근에 다녀온 산이 있나요?" },
    {
      title: "선호 코스",
      description: "장거리 등산 vs 가벼운 산책 중 어떤 걸 좋아하나요?",
    },
    { title: "등산 장비", description: "등산할 때 꼭 챙기는 장비는?" },
  ],
  자전거: [
    {
      title: "자전거 취향",
      description: "로드, MTB, 자전거 여행 중 어떤 걸 선호하나요?",
    },
    { title: "라이딩 경험", description: "가장 멀리 가본 곳은 어디인가요?" },
    {
      title: "자전거 관리",
      description: "자전거 관리나 업그레이드 해본 적 있나요?",
    },
  ],
  달리기: [
    { title: "달리기 습관", description: "얼마나 자주 달리기를 하나요?" },
    {
      title: "목표 거리",
      description: "달리면서 이루고 싶은 목표 거리가 있나요?",
    },
    { title: "경험", description: "마라톤이나 대회에 참가해본 적이 있나요?" },
  ],
  수영: [
    { title: "수영 경험", description: "언제부터 수영을 배웠나요?" },
    { title: "선호 영법", description: "자주 하는 수영 영법은 무엇인가요?" },
    { title: "수영 목표", description: "수영을 통해 이루고 싶은 목표는?" },
  ],
  요리: [
    { title: "즐겨 하는 요리", description: "자주 만들어 먹는 음식이 있나요?" },
    {
      title: "요리 취향",
      description: "한식/양식/중식 중 어떤 걸 선호하나요?",
    },
    { title: "특별한 경험", description: "누군가를 위해 요리한 적이 있나요?" },
  ],
  반려동물: [
    { title: "반려 경험", description: "현재 키우거나 키워본 적이 있나요?" },
    { title: "애정 표현", description: "어떻게 애정을 표현하나요?" },
    { title: "추억", description: "가장 기억에 남는 에피소드는?" },
  ],
};
