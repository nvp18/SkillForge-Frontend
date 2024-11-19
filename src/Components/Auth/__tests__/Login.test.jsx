import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login'; // Adjust path if necessary

describe('Login Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  });

  it('renders the login form correctly', () => {
    expect(screen.getByText(/Welcome to SkillForge/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('toggles password visibility when the eye icon is clicked', () => {
    const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input' });
    const toggleButton = screen.getByRole('button', { name: /Show password visibility/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    expect(screen.getByRole('button', { name: /Hide password visibility/i })).toBeInTheDocument();
  });

  it('shows an error message when login fails', async () => {
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input' });
    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: 'wrongUser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongPassword' } });
    fireEvent.click(loginButton);

    const errorMessage = await screen.findByText(/Login failed/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('navigates to dashboard on successful login for ADMIN role', async () => {
    // Mock API logic or routing behavior.
  });

  it('stores token and role in localStorage on successful login', async () => {
    // Mock successful login and ensure localStorage is updated.
  });
});
