import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './LoginPage';
// import axios from 'axios';

jest.mock('axios');

describe('LoginPage', () => {
  test('renders login form and allows guest login', () => {
    const setUsername = jest.fn();
    render(<LoginPage setUsername={setUsername} />);

    // Check if input fields and buttons are rendered
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Log in as Guest')).toBeInTheDocument();

    // Simulate guest login
    fireEvent.click(screen.getByText('Log in as Guest'));
    expect(localStorage.getItem('guestMode')).toBe('true');
    expect(setUsername).toHaveBeenCalledWith('Guest');
  });

  test('handles successful login', async () => {
    axios.post.mockResolvedValueOnce({
      data: { access: 'fake-access-token', refresh: 'fake-refresh-token' },
    });
    const setUsername = jest.fn();
    render(<LoginPage setUsername={setUsername} />);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login'));

    // Wait for the mock login process to complete
    await screen.findByText('Log in as Guest');
    expect(localStorage.getItem('accessToken')).toBe('fake-access-token');
    expect(setUsername).toHaveBeenCalledWith('testuser');
  });

  test('displays error on failed login', async () => {
    axios.post.mockRejectedValueOnce({});
    render(<LoginPage setUsername={jest.fn()} />);

    fireEvent.click(screen.getByText('Login'));

    // Wait for the error to appear
    const error = await screen.findByText('Invalid username or password');
    expect(error).toBeInTheDocument();
  });
});
