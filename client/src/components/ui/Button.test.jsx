import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Button from './Button';

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Button', () => {
  it('renders a <button> when no `to` prop is given', () => {
    renderWithRouter(<Button>Plant a Tree</Button>);
    expect(screen.getByRole('button', { name: 'Plant a Tree' })).toBeTruthy();
  });

  it('renders a router <Link> when `to` is provided', () => {
    renderWithRouter(<Button to="/events">Our Events</Button>);
    const link = screen.getByRole('link', { name: 'Our Events' });
    expect(link.getAttribute('href')).toBe('/events');
  });

  it('applies the primary variant classes by default', () => {
    renderWithRouter(<Button>Go</Button>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn.className).toContain('bg-neem');
  });

  it('applies outline variant classes when requested', () => {
    renderWithRouter(<Button variant="outline">Go</Button>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn.className).toContain('border-humus');
  });

  it('fires onClick when clicked', () => {
    const onClick = vi.fn();
    renderWithRouter(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});