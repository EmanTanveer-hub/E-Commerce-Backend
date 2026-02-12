const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../app"); // path to your Express app

describe("Sample Test", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/"); // just test home route
    expect(res.status).to.equal(200);
  });
});
