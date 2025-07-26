import { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

// Define types for common API responses
interface LoginResponse {
  message?: {
    statusMsg?: string;
    accessToken?: string;
    loginDetails?: {
      loginType?: string;
      id?: number;
    };
  };
  statusMsg?: string;
  status?: string;
  // Add other properties you expect from your API
}

interface UseHTTPResponse<T = any> {
  loading: boolean;
  data: T | null;
  callAPI: (config: AxiosRequestConfig) => Promise<void>;
  error: string | null;
  success: boolean;
}

const useHTTP = <T = LoginResponse>(): UseHTTPResponse<T> => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const callAPI = async (config: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios(config);
      setData(response.data);
      setSuccess(true);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, callAPI, error, success };
};

export default useHTTP;