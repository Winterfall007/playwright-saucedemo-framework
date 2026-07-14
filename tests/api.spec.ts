import { test, expect } from '@playwright/test';
import { AuthService } from '../services/AuthService';

test('authenticated request returns user data', async ({ request }) => {

  const response = await request.get(
    'https://reqres.in/api/users/2',
    {
      headers: AuthService.headers()
    }
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  console.log(body);

  expect(body.data.id).toBe(2);
  expect(body.data.email).toContain('@');
  expect(body.data.first_name).toBe('Janet');
  expect(body.data.last_name).toBe('Weaver');
  expect(body.data.avatar).toContain('https://');
  
});