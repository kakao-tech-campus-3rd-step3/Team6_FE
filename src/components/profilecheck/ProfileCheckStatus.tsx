interface Member {
  name: string;
  isReady: boolean;
}

interface ProfileCheckStatusProps {
  members: Member[];
}

const ProfileCheckStatus = ({ members }: ProfileCheckStatusProps) => {
  return (
    <div className="mt-6 flex h-[340px] w-full flex-col rounded-[16px] bg-white p-4 shadow-md">
      <h3 className="text-md mb-4 flex justify-center font-bold text-black">준비 상태</h3>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {members.map((member) => (
          <div
            key={member.name}
            className="text-md flex h-14 items-center justify-between rounded-[8px] bg-[#F9FAFB] px-6 text-gray-800"
          >
            {member.name}
            <span
              className={`text-md rounded-full px-4 py-1 ${
                member.isReady ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEF9C3] text-[#A16207]"
              }`}
            >
              {member.isReady ? "준비 완료" : "대기 중"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCheckStatus;
