import { StompMonitor } from "@/components/dev/StompMonitor";
import { Layout } from "@/layouts";
import { queryClient } from "@/lib/queryClient";
import { Stack } from "@/stackflow";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
        <Stack />
      </Layout>
      {process.env.NODE_ENV === "development" && <StompMonitor />}
    </QueryClientProvider>
  );
};
