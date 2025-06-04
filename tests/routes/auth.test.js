import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken'

import app from '/app';
import { User } from '/models';
import UserFactory from '/factories/UserFactory';

const STRONG_PASSWORD = "3hW2RdkiAgY4biqNxS/u9Nt40P6qAFUEg9PxMxhPdOE";

afterEach(async () => {
    await User.destroy({where: {}});
});

describe("signup", () => {
    it('needs all mandatory fields', async () => {
        const response = await request(app).post('/auth/signup').send({});
        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/mandatory/);
    });

    it('needs atleast 8 characters password', async () => {
        const response = await request(app).post('/auth/signup').send({
            email: 'gabriel@mailinator.com',
            password: "motdepasse",
            display_name: "Toto"
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/Password is not strong enough/);
    });

    it('validates email format', async () => {
        const response = await request(app).post('/auth/signup').send({
            email: "blablabla",
            password: STRONG_PASSWORD,
            display_name: "Toto"
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('The email is not valid or already used');
    });

    it('cant use same email twice', async () => {
        const existingUser = await User.create(UserFactory.one());

        const response = await request(app).post('/auth/signup').send({
            email: existingUser.email,
            password: STRONG_PASSWORD,
            display_name: "Toto"
        });

        expect(response.status).toBe(500);
    });

    it('creates a User if everything is ok', async () => {
        const fakeData = UserFactory.one();
        const response = await request(app).post('/auth/signup').send({
            email: fakeData.email,
            password: fakeData.password,
            display_name: fakeData.display_name,
        });

        expect(response.status).toBe(204);

        const user = await User.findOne({where: {email: fakeData.email}});
        expect(user.display_name).toBe(fakeData.display_name);
    });
});

describe("login", () => {
    it('expects an existing email', async () => {
        const response = await request(app).post('/auth/login').send({
            email: 'unknown@mailinator.com',
            password: STRONG_PASSWORD
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Email or password incorrect");
    });

    it('expects password matching email', async () => {
        const user = await User.create(UserFactory.one());
        const response = await request(app).post('/auth/login').send({
            email: user.email,
            password: "random password"
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Email or password incorrect");
    });

    it('generates a jwt token on successful login', async () => {
        const userData = UserFactory.one({overrides: {'password': STRONG_PASSWORD}});
        const user = await User.create(userData);
        const response = await request(app).post('/auth/login').send({
            email: user.email,
            password: STRONG_PASSWORD
        });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();

        const decoded = jwt.verify(response.body.token, process.env.JWT_PRIVATE_KEY);
        expect(decoded.id).toBe(user.id);
    });
});