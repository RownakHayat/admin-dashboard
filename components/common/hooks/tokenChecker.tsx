import { useEffect, useState } from 'react';
import Cookies from "js-cookie";

export function useToken() {
  const [hasToken, setHasToken] = useState<boolean>(false);

  useEffect(() => {
    setHasToken(!!Cookies.get('token'));
  }, []);

  return hasToken;
}
