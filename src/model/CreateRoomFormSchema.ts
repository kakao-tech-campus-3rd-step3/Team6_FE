import { MAX_PARTICIPANT, MIN_PARTICIPANT, ROOM_PURPOSE } from "@/constants";
import { z } from "zod";

const purposeIds = ROOM_PURPOSE.map((p) => p.id);
const MIN_LENGTH = 1;

export const CreateRoomFormSchema = z.object({
  roomName: z.string().trim().min(MIN_LENGTH, { message: "방 이름을 입력해주세요." }),
  capacity: z
    .number()
    .int()
    .positive({ message: "양수만 입력해주세요." })
    .min(MIN_PARTICIPANT, { message: `최소 ${MIN_PARTICIPANT}명 이상이어야 합니다.` })
    .max(MAX_PARTICIPANT, { message: `최대 ${MAX_PARTICIPANT}명 이하여야 합니다.` }),
  purpose: z.enum(purposeIds as [string, ...string[]], { message: "목적을 선택해주세요." }),
});

export type CreateRoomFormSchemaType = z.infer<typeof CreateRoomFormSchema>;
