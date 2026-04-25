const request = require("supertest");
const app = require("../server");

test("POST /api/auth/login should fail with wrong credentials", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "wrong@test.com",
      password: "wrongpassword",
    });

  expect(res.statusCode).toBe(401);
  expect(res.body.message).toBe("Invalid email or password");
});
