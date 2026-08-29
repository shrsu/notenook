const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const httpMocks = require("node-mocks-http");

const { app } = require("./jest.setup");
const { getSessionHandler } = require("../controllers/authControllers");
const { UserModel } = require("../models/UserModel");

const createUser = async (userData) => {
  const response = await request(app).post("/register").send(userData);
  return response;
};

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URI, {});
  console.log("Database connected");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  console.log("Database disconnected");
});

describe("Authentication", () => {
  jest.setTimeout(30000);

  describe("User Registration", () => {
    it("should register a new user", async () => {
      const newUser = {
        username: "testuser",
        fullname: "Test User",
        email: "testuser@example.com",
        password: "TestP@ssword1234.",
      };

      const response = await createUser(newUser);

      expect(response.status).toBe(201);

      const userInDb = await UserModel.findOne({ email: newUser.email });
      expect(userInDb).not.toBeNull();
      expect(userInDb.username).toBe(newUser.username);
      expect(userInDb.fullname).toBe(newUser.fullname);
      expect(userInDb.email).toBe(newUser.email);
    });

    it("should not register an existing user with the same email", async () => {
      const newUser = {
        username: "newTestuser",
        fullname: "Test User",
        email: "testuser@example.com",
        password: "TestUser123!",
      };
      const response = await createUser(newUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email is already registered");
    });

    it("should not register an existing user with the same username", async () => {
      const newUser = {
        username: "testuser",
        fullname: "Test User",
        email: "newtestuser@example.com",
        password: "TestUser123!",
      };
      const response = await createUser(newUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Username is already taken");
    });
  });

  describe("User Login", () => {
    it("should log in an existing user", async () => {
      const loginDetails = {
        username: "testuser",
        password: "TestP@ssword1234.",
      };

      const response = await request(app).post("/login").send(loginDetails);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");

      const decoded = jwt.verify(response.body.token, process.env.SECRET_KEY);
      expect(decoded).toHaveProperty("userId");
      expect(decoded).toHaveProperty("username", "testuser");
    });

    it("should not log in with incorrect password", async () => {
      const loginDetails = {
        username: "testuser",
        password: "wrongpassword",
      };

      const response = await request(app).post("/login").send(loginDetails);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Incorrect username or password");
    });

    it("should not log in with non-existing user", async () => {
      const loginDetails = {
        username: "nonexistingUser",
        password: "somepassword",
      };

      const response = await request(app).post("/login").send(loginDetails);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not Found");
    });
  });

  describe("Session Validation", () => {
    it("should return user data and a new token if session is valid", async () => {
      const user = await UserModel.findOne({ email: "testuser@example.com" });

      const req = httpMocks.createRequest({
        session: {
          passport: {
            user: user._id.toString(),
          },
        },
      });

      const res = httpMocks.createResponse();

      await getSessionHandler(req, res);

      const response = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(response).toHaveProperty("user");
      expect(response.user.username).toBe(user.username);
      expect(response.user.fullname).toBe(user.fullname);
      expect(response.user.email).toBe(user.email);
      expect(response).toHaveProperty("newToken");
    });
  });

  describe("Token Validation", () => {
    it("should return user data with valid token in Authorization header", async () => {
      const user = await UserModel.findOne({ email: "testuser@example.com" });
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.SECRET_KEY,
        { expiresIn: "12hr" }
      );

      const response = await request(app)
        .get("/session")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.username).toBe(user.username);
      expect(response.body.user.fullname).toBe(user.fullname);
      expect(response.body.user.email).toBe(user.email);
    });

    it("should return 401 for invalid or expired token", async () => {
      const invalidToken = jwt.sign(
        { userId: "invalidId", username: "testuser" },
        "wrongSecret"
      );

      const response = await request(app)
        .get("/session")
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid or expired token");
    });
  });
});
