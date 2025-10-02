import { StompMonitor } from "@/components/dev/StompMonitor";
import { Layout } from "@/layouts";
import { queryClient } from "@/lib/queryClient";
import { Stack } from "@/stackflow";
import { QueryClientProvider } from "@tanstack/react-query";

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Stack />
      </Layout>
      {process.env.NODE_ENV === "development" && <StompMonitor />}
    </QueryClientProvider>
  );
};
