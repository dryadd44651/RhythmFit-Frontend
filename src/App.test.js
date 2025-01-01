import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the navigation links', () => {
  render(<App />);
  expect(screen.getByText(/training/i)).toBeInTheDocument();
  expect(screen.getByText(/profile/i)).toBeInTheDocument();
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});