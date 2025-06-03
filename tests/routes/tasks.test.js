import { describe, it, expect, afterEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import rewiremock from 'rewiremock/node';

import { Task, User } from '/models';
import TaskFactory from '/factories/TaskFactory';
import UserFactory from '/factories/UserFactory';

let user;
let app;

beforeAll(async () => {
    user = await User.create(UserFactory.one());

    const mockAuth = (req, res, next) => {
        req.user = user;
        next();
    }

    app = rewiremock.proxy('../../app.js', {
        '../../middlewares/authentication': mockAuth
    })
});

afterAll(() => {
    rewiremock.disable();
})

describe('task/ GET', () => {
    afterEach(async () => {
        await Task.destroy({where: {}});
    });

    it('returns a list of tasks', async () => {
        const tasks = await Task.bulkCreate(TaskFactory.many(3, {overrides: {UserId: user.id}}));

        const response = await request(app).get('/tasks');

        expect(response.status).toBe(200);

        const results = response.body.results;

        expect(results.length).toBe(3);

        expect(results.map(x => x.id)).toEqual(tasks.map(x => x.id));
    });

    it('paginates if too many results', async () => {
        const tasks = await Task.bulkCreate(TaskFactory.many(8, {overrides: {UserId: user.id}}));

        let response = await request(app).get('/tasks');

        expect(response.status).toBe(200);
        expect(response.body.total).toBe(8);
        expect(response.body.results.length).toBe(5);
        expect(response.body.hasNext).toBeTruthy();
        expect(response.body.hasPrev).toBeFalsy();

        response = await request(app).get('/tasks?page=2');

        expect(response.status).toBe(200);
        expect(response.body.total).toBe(8);
        expect(response.body.results.length).toBe(3);
        expect(response.body.hasNext).toBeFalsy();
        expect(response.body.hasPrev).toBeTruthy();
    });

    it('filters by title', async () => {
        const tasks = await Task.bulkCreate([
            TaskFactory.one({overrides: {title: "Lancer le lave-vaisselle", UserId: user.id}}),
            TaskFactory.one({overrides: {title: "Acheter du PQ", UserId: user.id}}),
            TaskFactory.one({overrides: {title: "Vider le lave-vaisselle", UserId: user.id}}),
        ]);

        const response = await request(app).get('/tasks?title=lave-vaisselle');
        expect(response.status).toBe(200);

        const results = response.body.results;

        expect(results.map(x => x.id)).toEqual([tasks[0].id, tasks[2].id]);
    });
});
