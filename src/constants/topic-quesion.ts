export type TopicQA = { title: string; description: string };

export const TOPIC_QUESTIONS: Record<string, TopicQA[]> = {
  "#스포츠": [
    { title: "좋아하는 스포츠 종목", description: "자주 보는 경기나 직접 하는 스포츠가 있나요?" },
    { title: "응원 경험", description: "현장에서 응원해 본 경험이 있나요?" },
    { title: "선호하는 선수", description: "가장 좋아하는 선수나 팀은 누구인가요?" },
  ],
  "#음악": [
    { title: "음악 취향", description: "주로 즐겨 듣는 음악 장르는 무엇인가요?" },
    { title: "공연 경험", description: "기억에 남는 콘서트나 공연이 있나요?" },
    { title: "악기 연주", description: "배워본 적 있거나 배우고 싶은 악기가 있나요?" },
  ],
  "#영화": [
    { title: "영화 취향", description: "가장 좋아하는 영화 장르는 무엇인가요?" },
    { title: "기억에 남는 영화", description: "인생 영화가 있다면 어떤 작품인가요?" },
    { title: "관람 장소", description: "영화관과 집 중 어디를 선호하나요?" },
  ],
  "#독서": [
    { title: "좋아하는 책", description: "최근에 읽은 책 중 기억에 남는 것은?" },
    { title: "독서 습관", description: "종이책 vs 전자책, 어떤 걸 선호하나요?" },
    { title: "추천 도서", description: "다른 사람에게 추천하고 싶은 책이 있나요?" },
  ],
  "#여행": [
    { title: "여행 취향", description: "국내와 해외 중 어디를 선호하나요?" },
    { title: "기억에 남는 여행", description: "인상 깊었던 여행지는 어디인가요?" },
    { title: "버킷리스트", description: "꼭 가보고 싶은 여행지가 있나요?" },
  ],
  "#요리": [
    { title: "즐겨 하는 요리", description: "자주 만들어 먹는 음식이 있나요?" },
    { title: "요리 취향", description: "한식/양식/중식 중 어떤 걸 선호하나요?" },
    { title: "특별한 경험", description: "누군가를 위해 요리한 적이 있나요?" },
  ],
  "#게임": [
    { title: "게임 취향", description: "주로 어떤 장르를 좋아하나요?" },
    { title: "최근 플레이", description: "가장 재미있게 한 최근 게임은?" },
    { title: "추억의 게임", description: "어릴 적 기억에 남는 게임은?" },
  ],
  "#사진": [
    { title: "사진 취향", description: "풍경, 인물, 음식 중 무엇을 주로 찍나요?" },
    { title: "촬영 장비", description: "휴대폰 vs 카메라, 무엇을 쓰나요?" },
    { title: "인상적인 사진", description: "가장 마음에 드는 본인 사진은?" },
  ],
  "#운동": [
    { title: "운동 습관", description: "주로 하는 운동이 있나요?" },
    { title: "운동 계기", description: "운동을 시작하게 된 계기는?" },
    { title: "운동 목표", description: "앞으로 이루고 싶은 목표는?" },
  ],
  "#카페": [
    { title: "카페 취향", description: "어떤 분위기의 카페를 좋아하나요?" },
    { title: "음료 선택", description: "커피, 차, 디저트 중 무엇을 즐기나요?" },
    { title: "카페 추억", description: "기억에 남는 카페 경험이 있나요?" },
  ],
  "#쇼핑": [
    { title: "쇼핑 습관", description: "온라인 vs 오프라인, 무엇을 선호하나요?" },
    { title: "기억에 남는 구매", description: "최근 만족스러운 지름템은?" },
    { title: "주요 카테고리", description: "옷/전자기기/인테리어 중 무엇을 주로 사나요?" },
  ],
  "#반려동물": [
    { title: "반려 경험", description: "현재 키우거나 키워본 적이 있나요?" },
    { title: "애정 표현", description: "어떻게 애정을 표현하나요?" },
    { title: "추억", description: "가장 기억에 남는 에피소드는?" },
  ],
};
