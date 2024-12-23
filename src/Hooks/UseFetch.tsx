import { useRef, useState, useCallback } from "react";
import { httpget } from "../Api/httpclient";

export default function useFetch<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const controllerRef = useRef<AbortController>();

  const callFetch = useCallback(async (endpoint: string, path: string | undefined | null) => {
    setLoading(true);
    setError(null);
    setData(null);

    controllerRef.current = new AbortController();

    const data = httpget<T>(endpoint + path, { signal: controllerRef.current.signal });

    data.then(response => {

      setError(null);
      setData(response);

    }).catch(e => {

      const error = e as Error;

      if (error.name === "AbortError") {
        setError("Request was canceled");
      } else {
        setError(error.message);
      }
      
      setData(null);

    }).finally(() => {
      setLoading(false);
    })
  }, []);

  const abortFetch = useCallback(() => {
    controllerRef.current?.abort();
    setLoading(false);
    setError(null);
  }, []);

  const setDataControlled = useCallback((newData: T) => {
    setLoading(false);
    setError(null);
    setData(newData);
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    callFetch,
    abortFetch,
    setData: setDataControlled,
    reset
  }
}