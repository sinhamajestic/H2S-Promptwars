import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { LanguageSwitcher } from '../src/components/LanguageSwitcher';
import { useUserContext } from '../src/store/userContext';
import React from 'react';
import '@testing-library/jest-dom';

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    useUserContext.setState({ language: 'en' });
  });

  it('renders correctly', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('combobox', { name: /select language/i })).toBeInTheDocument();
  });

  it('changes language on select', () => {
    render(<LanguageSwitcher />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'es' } });
    expect(useUserContext.getState().language).toBe('es');
  });
});
