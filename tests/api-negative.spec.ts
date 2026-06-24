import { test, expect } from '@playwright/test';

test('request without api key returns 401', async ({ request }) => {

    // Sends a GET request and stores the response
    const response = await request.get('https://reqres.in/api/users/2');

    // Verifies the API returns HTTP 200 (Success)
    console.log(response.status());
    console.log(await response.text());

    // Converts the JSON response into a TypeScript object
    const body = await response.json();
    console.log(body);

    // Verifies the returned user's first name is "Janet"
    expect(body.error).toBe('missing_api_key');
});