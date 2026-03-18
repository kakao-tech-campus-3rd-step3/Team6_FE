import {
  IntroSection,
  QuestionList,
  QuestionListSkeleton,
  TopicList,
  TopicListSkeleton,
} from "@/components/topicrecommend";
import type { InterestType } from "@/constants";
import { useHandleBackPage, useStageNavigation } from "@/hooks";
import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import { PageLayout } from "@/layouts/PageLayout";
import { getMessageBody } from "@/utils/stomp/getMessageBody";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Category {
  name: InterestType;
}

interface Question {
  content: string;
}

interface TopicRecommendInitialData {
  topics: Category[];
  questions: Question[];
}

type TopicRecommendInitialResponse = BaseResponse<TopicRecommendInitialData>;
type TopicRecommendSelectedResponse = BaseResponse<Question[]>;
type TopicRecommendResponse = TopicRecommendInitialResponse | TopicRecommendSelectedResponse;

const TopicRecommendPage = () => {
  const [selected, setSelected] = useState<Category>();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId") || "";
  const isHost = searchParams.get("isHost") === "true";
  const { publish } = useStompPublish();
  const [topics, setTopics] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRandomTopicMessage = useCallback((message: IMessage) => {
    const response = getMessageBody<TopicRecommendResponse>(message);
    if (!response) {
      console.error("메시지 파싱 실패", message.body);
      setIsLoading(false);
      return;
    }
    const { data } = response;
    if (!Array.isArray(data) && "topics" in data) {
      setTopics(data.topics);
      setQuestions(data.questions);
      setIsLoading(false);
      return;
    }
    if (Array.isArray(data)) {
      setQuestions(data);
      setIsLoading(false);
    }
  }, []);

  const handleTopicSelect = useCallback(
    (topic: Category) => {
      setSelected(topic);
      if (!isHost || !roomId) return;
      publish(`/app/room/${roomId}/start-game`, {
        roomCode: roomId,
        type: "TOPIC_RECOMMEND",
        topicName: topic.name,
      });
    },
    [isHost, roomId, publish],
  );

  useEffect(() => {
    if (!isHost || !roomId) return;

    publish(`/app/room/${roomId}/start-game`, {
      roomCode: roomId,
      type: "TOPIC_RECOMMEND",
    });
  }, [roomId, isHost, publish]);

  useStompSubscription(`/topic/game-result/${roomId}`, handleRandomTopicMessage);

  useStageNavigation();
  const { handleBack, canGoBack } = useHandleBackPage();

  return (
    <PageLayout
      appBar={{
        title: "주제 추천",
        backButton: canGoBack
          ? {
              onClick: handleBack,
            }
          : { render: () => null },
      }}
    >
      <main className="bg-gradient-primary min-h-screen space-y-4 p-4 pb-8">
        {isLoading ? (
          <>
            <TopicListSkeleton />
            <IntroSection topic="" />
            <QuestionListSkeleton />
          </>
        ) : (
          <>
            <TopicList topics={topics} selected={selected} onSelect={handleTopicSelect} />
            <IntroSection topic={selected?.name ?? ""} />
            <QuestionList questions={questions} selectedInterest={selected?.name} />
          </>
        )}
      </main>
    </PageLayout>
  );
};

export default TopicRecommendPage;
