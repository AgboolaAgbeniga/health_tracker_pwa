import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import SignupForm from '../../src/app/components/auth/SignupForm';
import LoginForm from '../../src/app/components/auth/LoginForm';

afterEach(cleanup);

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() })
}));

describe('auth flow', () => {
  it('submits the signup form and creates a session', () => {
    render(<SignupForm />);
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));
    expect(localStorage.getItem('habit-tracker-session')).toContain('test@test.com');
  });

  it('shows an error for duplicate signup email', () => {
    render(<SignupForm />);
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));
    expect(screen.getByText('User already exists')).toBeDefined();
  });

  it('submits the login form and stores the active session', () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));
    expect(localStorage.getItem('habit-tracker-session')).toContain('test@test.com');
  });

  it('shows an error for invalid login credentials', () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));
    expect(screen.getByText('Invalid email or password')).toBeDefined();
  });
});
