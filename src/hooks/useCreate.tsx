import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { useEffect, useState } from "react"

interface ErrorResponse {
  code: number;
  error: string;
  message: string;
}

interface UseCreateOptions extends AxiosRequestConfig {}

export default function useCreate<T>(url: string, data: T, posted: boolean, options: UseCreateOptions = {}) {
  const [isPosted, setIsPosted] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [error409, setError409] = useState<ErrorResponse | null>(null);

  useEffect(() => {
    if (posted){
      setIsPosting(true);
      setError(null);
      setError409(null);
      axios.post(url, data, options)
      .then(res => {
        setIsPosted(true);
      })
      .catch((err: AxiosError<ErrorResponse>) => {
        if (err.response?.status === 409) {
          setError409(err.response.data);
        } else {
          setError(err.response?.data?? { 
            error: "Internal server error",
            message: "An error occurred on our servers. Please try again later.",
            code: 500
          });
        }
      })
      .finally(() => {
        setIsPosting(false);
      })
    }
  }, [posted]);
  
  return { isPosted, isPosting, error, error409 };
}