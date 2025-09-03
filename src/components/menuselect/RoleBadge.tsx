import { cn } from "@/utils/cn";

interface RoleProps {
  role: string;
}
const cardStyles = { 
  base: "flex h-18 w-full cursor-pointer items-center rounded-2xl shadow-lg bg-[#687EFF]/15", 
};

const checkStyles = { 
  base: "flex h-5 w-5 items-center justify-center rounded-full bg-primary", 
};

export const RoleBadge = ({ role }: RoleProps) => {

  return (
    <div className={cn(cardStyles.base)}>
      <div className="flex w-1/6 items-center justify-center pl-4">
        <div className={cn(checkStyles.base)} />
      </div>

      <div className="w-5/6 text-left">
        <p className="text-lg font-medium text-primary">{role}</p>
      </div>
    </div>
  );
};
