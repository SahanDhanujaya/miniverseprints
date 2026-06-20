import { canAccessAdmin, getUserRole } from '../permissions';

describe('permissions', () => {
  it('allows only admin metadata into the dashboard', () => {
    expect(canAccessAdmin({ app_metadata: { role: 'admin' } })).toBe(true);
    expect(canAccessAdmin({ user_metadata: { role: 'customer' } })).toBe(false);
    expect(canAccessAdmin(null)).toBe(false);
  });

  it('defaults unknown roles to customer', () => {
    expect(getUserRole({ app_metadata: { role: 'owner' } })).toBe('customer');
  });
});
