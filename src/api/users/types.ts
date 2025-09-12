import type { InterestType } from "@/constants";
import type { MBTI } from "@/types/mbti";

export interface GetUserResponseBody {
  id: number;
  name: string;
  phone: string;
  age: number;
  mbti: MBTI;
  introduction: string;
  interests: InterestType[];
}

export interface CreateUserRequestBody {
  name: string;
  phone: string;
  age: number;
  interests: InterestType[];
  mbtiValue: MBTI;
  introduction: string;
}

export interface CreateUserResponseBody {
  userId: number;
  token: string;
}
