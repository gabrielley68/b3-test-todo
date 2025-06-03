import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken'

import { User } from '/models';
import UserFactory from '/factories/UserFactory';
import authenticate from '/middlewares/authentication';

function createDummyApp(){
    const app = express();
    app.use(authenticate);
    app.get('/', (req, res) => {
        res.json({user: req.user.id});
    });

    return app;
}

afterEach(async () => {
    await User.destroy({where: {}});
});

describe("authenticate", () => {
    async function generateToken(){
        const user = await User.create(UserFactory.one());
        const token = jwt.sign(
            {'id': user.id},
            process.env.JWT_PRIVATE_KEY,
            {expiresIn: '1h'}
        );

        return [user, token]
    }

    it("returns 401 with missing header", async () => {
        const response = await request(createDummyApp()).get('/');

        expect(response.status).toBe(401);
        expect(response.text).toBe('Unauthorized');
    });

    it("follows standard jwt specification", async () => {
        const [user, token] = await generateToken()
        const response = await request(createDummyApp())
            .get('/')
            .set('Authorization', token);

        expect(response.status).toBe(401);
        expect(response.text).toBe('Unauthorized');
    });

    it("returns 401 if token is invalid", async () => {
        const response = await request(createDummyApp())
            .get('/')
            .set('Authorization', 'Bearer 123toto');

        expect(response.status).toBe(401);
        expect(response.text).toBe('Invalid token');
    });


    it("returns 401 if user is expired", async () => {
        vi.useFakeTimers()

        vi.setSystemTime(
            new Date(2000, 1, 1, 13)
        );
        const [user, token] = await generateToken();

        vi.setSystemTime(
            new Date(2000, 1, 1, 16)
        );
        const response = await request(createDummyApp())
            .get('/')
            .set('Authorization', 'Bearer ' + token);

        expect(response.status).toBe(401);
        expect(response.text).toBe('Token expired');

        vi.useRealTimers();        
    });

    it("returns 401 if user is not found", async () => {
        const [user, token] = await generateToken();

        await user.destroy();
        const response = await request(createDummyApp())
            .get('/')
            .set('Authorization', 'Bearer ' + token);

        expect(response.status).toBe(401);
        expect(response.text).toBe('Unauthorized');
    });

    it("associates user to request", async () => {
        const [user, token] = await generateToken();

        const response = await request(createDummyApp())
            .get('/')
            .set('Authorization', 'Bearer ' + token);

        expect(response.status).toBe(200);
        expect(response.body.user).toBe(user.id);
    });
});