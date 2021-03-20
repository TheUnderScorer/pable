import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import { ApiClient } from '@pable/shared-frontend';

export interface ApiClientProviderProps {
  url: string;
}

export interface ApiClientProviderContext {
  apiClient: ApiClient;
}

const Context = createContext<ApiClientProviderContext>({
  apiClient: new ApiClient(''),
});

export const useApiClient = () => useContext(Context);

export const ApiClientProvider = ({
  url,
  children,
}: PropsWithChildren<ApiClientProviderProps>) => {
  const apiClient = useMemo(() => new ApiClient(url), [url]);

  return <Context.Provider value={{ apiClient }}>{children}</Context.Provider>;
};
