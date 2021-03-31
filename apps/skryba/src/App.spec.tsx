import { render } from '@testing-library/react';
import React from 'react';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ApiClientProvider } from '@skryba/shared-frontend';
import { MemoryRouter } from 'react-router-dom';

describe('App', () => {
  it('should render successfully', async () => {
    const cmp = render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <ApiClientProvider url="">
            <App />
          </ApiClientProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(cmp).toBeDefined();
  });
});
