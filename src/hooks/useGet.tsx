import axios, { AxiosRequestConfig } from "axios"
import { useEffect, useState } from "react"

interface ErrorResponse {
  code: number;
  error: string;
  message: string;
}

interface UseGetOptions extends AxiosRequestConfig {}

export default function useGet(url: string, options: UseGetOptions = {}, deps: any[] = []) {
  const [data, setData] = useState<any>(null);
  const [isGetting, setIsGetting] = useState<boolean>(true);
  const [error, setError] = useState<ErrorResponse | null>(null);

  useEffect(() => {
    if (deps.every(dep => dep !== null && dep !== undefined)) {
      setIsGetting(true);
      axios.get(url, options)
        .then(res => {
          setData(res.data);
        })
        .catch(err => {
          setError(err);
        })
        .finally(() => {
          setIsGetting(false);
        });
    }
  }, deps);

  return { data, isGetting, error };
}