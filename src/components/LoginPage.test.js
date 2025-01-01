import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

test('renders the login page', () => {
  const setUsername = jest.fn();

  // Wrap the component with MemoryRouter
  render(
	<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  	<LoginPage setUsername={setUsername} />
	</MemoryRouter>
  );

  // Check that the login page elements are rendered
  expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  expect(screen.getByText('Log in as Guest')).toBeInTheDocument();
});

test('simulates guest login', () => {
  const setUsername = jest.fn();

  render(
    <MemoryRouter>
      <LoginPage setUsername={setUsername} />
    </MemoryRouter>
  );

  // Simulate clicking the "Log in as Guest" button
  fireEvent.click(screen.getByText('Log in as Guest'));

  // Check that guest mode is activated
  expect(localStorage.getItem('guestMode')).toBe('true');
  expect(setUsername).toHaveBeenCalledWith('Guest');
});
