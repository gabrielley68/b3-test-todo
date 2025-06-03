/***
 * Fichier avec la version 1 du routeur sans Sequelize
 */

const express = require('express');
const router = express.Router();

const sql = require('../core/sql');

const filters = [
    {
        name: 'title',
        getQuery: value => "title LIKE '%?%'",
        escapeValue: true,   
    },
    {
        name: 'done',
        getQuery: value => "done = " + (value == "true" ? '1' : '0'),
        choices: ['true', 'false']
    },
    {
        name: 'late',
        getQuery: value => "due_date " + (value == "true" ? '<' : '>=') + " NOW()",
        choices: ['true', 'false']
    }
];

router.get('/', async (req, res) => {
    const { page = 1, limit = 5 } = req.query;

    const whereClauses = [];
    const escapedValues = [];

    if(isNaN(page) || isNaN(limit) || page < 1){
        res.status(400);
        res.send("Pagination error");
        return;
    }

    for(let filter of filters){
        if(filter.name in req.query){
            const value = req.query[filter.name];
            if(filter.choices && !filter.choices.includes(value)){
                res.status(400)
                res.send(`Unexpected choice for filter '${filter.name}'`);
                return;
            }

            whereClauses.push(filter.getQuery(value));

            if(filter.escapeValue){
                escapedValues.push(value);
            }
        }
    }

    const whereQuery = whereClauses.length > 0 ? (' WHERE ' + whereClauses.join(' AND ')) : '';

    escapedValues.push(limit, (page - 1) * limit);

    try {
        const countResult = await sql.query('SELECT COUNT(*) as count FROM task' + whereQuery);
        const count = countResult[0].count;

        let query = (
            "SELECT id, title, description, type, done, due_date, creation_date, update_date"
            + " FROM task" + whereQuery
            + " LIMIT ? OFFSET ?"
        );
        const results = await sql.query({sql: query, values: escapedValues});

        res.json({
            'total': count,
            'hasNext': (limit * page) < Math.max(count, limit),
            'hasPrev': page > 1,
            'results': results
        })
    } catch(exception){
        console.error(exception);
        res.status(500)
        res.send("Unexpected error");
    }
});


router.get('/:id', async (req, res) => {
    const id = req.params.id;

    let results;
    try {
        results = await sql.query({
            sql: 'SELECT * FROM task WHERE ??=?',
            values: ['id', id]
        });
    } catch(err){
        res.status(500);
        console.error(err);
        res.send("Unexpected error");
        return;
    }

    if(results.length === 0){
        res.status(404);
        res.send(`No task with id '${id}'`);
        return;
    } else if(results.length > 1){
        res.status(500);
        console.error("Found multiple tasks with id " + id);
        res.send("Unexpected error");
        return;
    }

    res.json(results[0]);
});


router.post('/', async (req, res) => {
    const {
        title,
        due_date,
        type: typeId,
        description = '',
        done = false,
    } = req.body;

    if(!title || !due_date){
        res.status(400);
        res.send("Title and due_date are mandatory");
        return;
    }

    if(isNaN(Date.parse(due_date))){
        res.status(400);
        res.send("Date format of field due_date not supported");
        return;
    }

    if(typeId){
        const typeResult = await sql.query({
            sql: 'SELECT id FROM type WHERE id = ?',
            values: [typeId]
        });

        if(typeResult.length !== 1){
            res.status(404);
            res.send(`Type with id '${typeId}' not found`);
            return;
        }
    }

    const insertionResult = await sql.query({
        sql: (
            'INSERT INTO task (title, due_date, type, description, done)'
            + ' VALUES(?,?,?,?,?)'
        ),
        values: [
            title, new Date(due_date),
            typeId || null,
            description, done
        ]
    });

    // Get the final object from DB
    const result = await sql.query({
        sql: (
            "SELECT id, title, description, type, done, due_date, creation_date, update_date"
            + " FROM task WHERE id = ?"
        ),
        values: [insertionResult.insertId]
    })

    res.status(201);
    res.json(result[0]);
});



module.exports = router;