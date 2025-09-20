import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { AppProvider } from './context/AppContext';

describe('App', () => {
  it('renders the main heading', () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );
    expect(screen.getByText('AI Music Video Generator')).toBeInTheDocument();
  });
});
