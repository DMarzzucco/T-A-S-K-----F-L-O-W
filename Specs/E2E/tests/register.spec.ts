import { test, expect, request } from '@playwright/test';

test("register flow", async () => {

  const api = await request.newContext({ignoreHTTPSErrors: true});

  const res = await api.post("https://localhost:5024/api/Auth/register", {
    data: {
      "First_name": "Marcos",
      "Last_name": "Rossi",
      "Age": "27",
      "Username": "MarRoss",
      "Email": "MarRoss@gmail.com",
      "Password": "Sr@motheus98",
      "Roles": 10
    }
  });

  expect(res.ok()).toBeTruthy();
});
