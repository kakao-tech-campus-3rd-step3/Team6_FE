export const ErrorMessage = ({ error }: { error?: string | boolean }) => {
  return <p className="pt-1 pl-2 text-xs text-red-500">{error}</p>;
};
