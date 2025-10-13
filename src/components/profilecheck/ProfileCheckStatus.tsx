import type { ProfileCheckStatusProps } from "@/components/profilecheck/types";

const ProfileCheckStatus = ({ members }: ProfileCheckStatusProps) => {
  return (
    <section className="mt-6 flex h-[340px] w-full flex-col rounded-[16px] bg-white p-4 shadow-md">
      <h2 className="text-md mb-4 flex justify-center font-bold text-black">참여자 목록</h2>
      <ul className="flex-1 space-y-2 overflow-y-auto">
        {members.map((member) => (
          <li
            key={member.id}
            className="text-md flex h-14 items-center justify-between rounded-[8px] bg-[#F9FAFB] px-6 text-gray-800"
          >
            <span>{member.name}</span>
            <span className="text-sm text-gray-500" aria-label={`MBTI: ${member.mbtiType}`}>
              {member.mbtiType}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProfileCheckStatus;
