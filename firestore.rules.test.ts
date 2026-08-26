/**
 * Security Rule Tests for Laura Luíza Beauty
 * Tests verify ABAC and dirty dozen payload rejection
 */

export interface TestPayload {
  name: string;
  expectedResult: 'ALLOW' | 'DENY';
  path: string;
  data: any;
  auth: { uid: string; email?: string } | null;
}

export const DIRTY_DOZEN_TESTS: TestPayload[] = [
  {
    name: 'Reject malicious service injection without admin rights',
    expectedResult: 'DENY',
    path: '/services/fake-service',
    data: { id: 'fake-service', name: 'Free Cut', price: 0, category: 'cabelo' },
    auth: { uid: 'regular-user', email: 'user@test.com' }
  },
  {
    name: 'Reject admin spoofing attempt',
    expectedResult: 'DENY',
    path: '/admins/hacker-id',
    data: { role: 'admin' },
    auth: { uid: 'hacker-id', email: 'hacker@test.com' }
  },
  {
    name: 'Reject oversized document ID poisoning',
    expectedResult: 'DENY',
    path: `/appointments/${'a'.repeat(200)}`,
    data: { clientName: 'Attacker' },
    auth: null
  },
  {
    name: 'Reject appointment with negative price',
    expectedResult: 'DENY',
    path: '/appointments/apt-123',
    data: {
      id: 'apt-123',
      serviceName: 'Escova',
      date: '2026-08-26',
      time: '14:00',
      clientName: 'Test',
      clientPhone: '11999999999',
      price: -500,
      status: 'Confirmado'
    },
    auth: null
  },
  {
    name: 'Reject invalid status injection',
    expectedResult: 'DENY',
    path: '/appointments/apt-123',
    data: {
      id: 'apt-123',
      serviceName: 'Escova',
      date: '2026-08-26',
      time: '14:00',
      clientName: 'Test',
      clientPhone: '11999999999',
      price: 100,
      status: 'HACKED'
    },
    auth: null
  }
];
