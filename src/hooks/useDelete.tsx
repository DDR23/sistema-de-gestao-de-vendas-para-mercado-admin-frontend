import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

interface ErrorResponse {
  code: number;
  error: string;
  message: string;
}

interface UsePutOptions extends AxiosRequestConfig {}

export default function useDelete(url: string, isDelete: boolean, options: UsePutOptions = {}) {
  const [isDeleted, setIsDeleted] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [error, setError] = useState<ErrorResponse | null>(null)

  useEffect(() => {
    if (isDelete === true){
      setIsDeleting(true)
      axios.delete(url, options)
        .then(() => {
          setIsDeleted(true)
        })
        .catch(err => {
          setError(err)
        })
        .finally(() => {
          setIsDeleting(false)
        })
    }
  }, [isDelete])

  return { isDeleted, isDeleting, error }
}