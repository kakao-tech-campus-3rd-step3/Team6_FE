import { INTERESTS, REGEX_PHONE_NUMBER } from "@/constants";
import { z } from "zod";

const AVAILABLE_START_AGE = 15;
const AVAILABLE_END_AGE = 55;
const MIN_LENGTH = 1;

const mbtiValues = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

export const FormSchema = z.object({
  name: z.string().min(MIN_LENGTH, { message: "이름을 입력해주세요." }),
  phone: z.string().regex(REGEX_PHONE_NUMBER, { message: "전화번호 형식이 올바르지 않습니다." }),
  age: z
    .number()
    .min(AVAILABLE_START_AGE, { message: `나이는 ${AVAILABLE_START_AGE}세 이상이어야 합니다.` })
    .max(AVAILABLE_END_AGE, { message: `나이는 ${AVAILABLE_END_AGE}세 이하여야 합니다.` }),
  mbti: z.enum(mbtiValues, { message: "MBTI를 선택해주세요." }),
  interests: z.array(z.enum(INTERESTS)).min(MIN_LENGTH, { message: "최소 1개 이상의 관심사를 선택해주세요." }),
  introduction: z.string().min(MIN_LENGTH, { message: "자신을 간단히 소개해주세요." }),
});

export type FormSchemaType = z.infer<typeof FormSchema>;
