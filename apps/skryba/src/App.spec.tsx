import { render } from '@testing-library/react';
import React from 'react';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ApiClientProvider } from '@skryba/shared-frontend';

describe('App', () => {
  it('should render successfully', async () => {
    const cmp = render(
      <QueryClientProvider client={new QueryClient()}>
        <ApiClientProvider url="">
          <App />
        </ApiClientProvider>
      </QueryClientProvider>
    );

    expect(cmp).toBeDefined();
  });
});
