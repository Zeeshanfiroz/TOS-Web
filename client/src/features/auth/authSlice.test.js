import { describe, it, expect, vi, beforeEach } from 'vitest';
import reducer, { initializeAuth } from './authSlice';

describe('initializeAuth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('marks auth as initialized immediately when no tokens are present', async () => {
    const dispatched = [];
    const dispatch = vi.fn((action) => {
      dispatched.push(action);
      if (typeof action === 'function') {
        return action(dispatch, () => ({ auth: reducer(undefined, { type: '@@INIT' }) }));
      }
      return action;
    });

    await initializeAuth()(dispatch, () => ({ auth: reducer(undefined, { type: '@@INIT' }) }));

    expect(dispatched).toContainEqual(expect.objectContaining({ type: 'auth/markInitialized' }));
  });
});
