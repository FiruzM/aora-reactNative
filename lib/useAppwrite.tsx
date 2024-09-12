import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn: () => Promise<any>) => {
  const [data, setData] = useState({ documents: [] });
  const isLoading = useRef(false);

  const fetchData = async () => {
    isLoading.current = true;
    try {
      const res = await fn();
      setData(res as any);
    } catch (err: Error | any) {
      Alert.alert("Error", err.message);
    } finally {
      isLoading.current = false;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, isLoading, refetch };
};

export default useAppwrite;
