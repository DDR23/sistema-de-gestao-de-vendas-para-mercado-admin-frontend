import axios, { AxiosRequestConfig } from "axios"
import { useEffect, useState } from "react"

interface ErrorResponse {
  code: number;
  error: string;
  message: string;
}

interface UsePutOptions extends AxiosRequestConfig {}

export default function usePut<T>(url: string, data: T, posted: boolean, options: UsePutOptions = {}) {
  const [isUpdated, setUpdated] = useState<any>(null)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [error, setError] = useState<ErrorResponse | null>(null)

  useEffect(() => {
    if (posted){
      setIsUpdating(true)
      axios.put(url, data, options)
      .then(res => {
        setUpdated(res.data)
      })
      .catch(err => {
        setError(err)
      })
      .finally(() => {
        setIsUpdating(false)
      })
    }
  }, [posted])
  
  return { isUpdated, isUpdating, error }
}