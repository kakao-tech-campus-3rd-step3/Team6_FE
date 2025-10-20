export const ErrorMessage = ({ error }: { error?: string }) => {
  if (!error) return null;
  return (
    <p className="pt-1 pl-2 text-xs text-red-500" role="alert">
      {error}
    </p>
  );
};
