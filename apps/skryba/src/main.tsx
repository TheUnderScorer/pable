import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  ApiClientProvider,
  DialogController,
  ThemeProvider,
} from '@skryba/shared-frontend';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ApiClientProvider url={process.env.NX_API_URL}>
              <DialogController />
              <App />
            </ApiClientProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </DndProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
