import { ErrorFactory } from "@/errors/error-factory";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
   throw ErrorFactory.fromAxiosError(error); 
  }
)