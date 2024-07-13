import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface ErrorResponse {
  code: number;
  error: string;
  message: string;
}

interface UsePostAuthResult {
  token: TokenAccess | null;
  isPosted: boolean;
  isPosting: boolean;
  error: ErrorResponse | null;
  error409: ErrorResponse | null;
}

interface TokenAccess {
  token: string;
  tokenAdmin?: string;
}

export default function usePost<T>(url: string, data: T, posted: boolean): UsePostAuthResult {
  const [token, setToken] = useState<TokenAccess | null>(null);
  const [isPosted, setIsPosted] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [error409, setError409] = useState<ErrorResponse | null>(null);

  useEffect(() => {
    if (posted) {
      setIsPosting(true);
      setError(null);
      setError409(null);
      axios.post(url, data)
        .then((res) => {
          setToken(res.data)
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
        });
    }
  }, [posted, url, data]);

  return { token, isPosted, isPosting, error, error409 };
}