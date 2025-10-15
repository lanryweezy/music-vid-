import React from 'react';
import { AppProvider } from '../../context/AppContext';
import { AppHeader } from './AppHeader';
import { AppMain } from './AppMain';
import { ErrorBoundary } from '../ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="app-container">
          <AppHeader />
          <AppMain />
        </div>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
