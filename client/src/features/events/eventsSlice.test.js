import { describe, it, expect, vi } from 'vitest';

// Mock the axios instance so no network happens in tests
vi.mock('../../api/axios', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

import reducer, {
  fetchEvents,
  fetchEventById,
  fetchMyRsvps,
  toggleRsvp,
} from './eventsSlice';

const initialState = {
  list: [],
  pagination: null,
  current: null,
  myRsvps: [],
  isLoading: false,
  error: null,
};

describe('eventsSlice reducer', () => {
  it('has the expected initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('sets isLoading on fetchEvents.pending and clears it on fulfilled', () => {
    const loading = reducer(initialState, { type: fetchEvents.pending.type });
    expect(loading.isLoading).toBe(true);
    expect(loading.error).toBeNull();

    const payload = { data: [{ _id: 'e1', title: 'Plantation Drive' }], pagination: { page: 1 } };
    const done = reducer(loading, { type: fetchEvents.fulfilled.type, payload });
    expect(done.isLoading).toBe(false);
    expect(done.list).toHaveLength(1);
    expect(done.pagination).toEqual({ page: 1 });
  });

  it('stores the error message on fetchEvents.rejected', () => {
    const state = reducer(initialState, {
      type: fetchEvents.rejected.type,
      payload: 'Failed to load events',
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Failed to load events');
  });

  it('updates RSVP state of the current event on toggleRsvp.fulfilled', () => {
    const withCurrent = {
      ...initialState,
      current: { _id: 'e1', rsvps: ['x'], rsvpCount: 1 },
    };
    const state = reducer(withCurrent, {
      type: toggleRsvp.fulfilled.type,
      payload: { eventId: 'e1', rsvped: true, rsvpCount: 2 },
    });
    expect(state.current.rsvpCount).toBe(2);
    expect(state.current._rsvped).toBe(true);
  });

  it('ignores toggleRsvp for an event that is not currently loaded', () => {
    const state = reducer(initialState, {
      type: toggleRsvp.fulfilled.type,
      payload: { eventId: 'e9', rsvped: true, rsvpCount: 5 },
    });
    expect(state.current).toBeNull();
  });

  it('stores fetched RSVPs on fetchMyRsvps.fulfilled', () => {
    const state = reducer(initialState, {
      type: fetchMyRsvps.fulfilled.type,
      payload: [{ _id: 'e1' }],
    });
    expect(state.myRsvps).toEqual([{ _id: 'e1' }]);
  });

  it('replaces current event on fetchEventById.fulfilled', () => {
    const state = reducer(initialState, {
      type: fetchEventById.fulfilled.type,
      payload: { _id: 'e2', title: 'Clean-up Drive' },
    });
    expect(state.current).toEqual({ _id: 'e2', title: 'Clean-up Drive' });
    expect(state.isLoading).toBe(false);
  });
});