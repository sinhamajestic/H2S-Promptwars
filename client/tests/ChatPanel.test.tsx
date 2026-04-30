import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { ChatPanel } from '../src/components/ChatPanel';
import * as chatHook from '../src/hooks/useChat';
import React from 'react';
import '@testing-library/jest-dom';

vi.mock('../src/hooks/useChat', () => ({
  useChat: vi.fn(),
}));

describe('ChatPanel', () => {
  let mockSendMessage: Mock;

  beforeEach(() => {
    mockSendMessage = vi.fn();
    vi.mocked(chatHook.useChat).mockReturnValue({
      messages: [],
      isLoading: false,
      sendMessage: mockSendMessage,
    });
  });

  it('renders the empty state correctly', () => {
    render(<ChatPanel />);
    expect(screen.getByText(/Ask me anything about voter registration/i)).toBeInTheDocument();
  });

  it('sends a message on Enter key', async () => {
    render(<ChatPanel />);
    const input = screen.getByPlaceholderText(/Ask a question/i);
    
    fireEvent.change(input, { target: { value: 'How do I vote?' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: false });

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('How do I vote?');
    });
  });

  it('shows loading indicator and disables input while loading', () => {
    vi.mocked(chatHook.useChat).mockReturnValue({
      messages: [],
      isLoading: true,
      sendMessage: mockSendMessage,
    });

    render(<ChatPanel />);
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
    expect(screen.getByLabelText(/Chat input/i)).toBeDisabled();
    expect(screen.getByText('Assistant is typing...')).toBeInTheDocument();
  });
});
