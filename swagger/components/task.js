const Task = {
    type: 'object',
    properties: {
        id: {
            type: 'integer',
            description: 'Unique ID'
        },
        title: {
            type: 'string',
            description: 'Title of the task'
        },
        done: {
            type: 'boolean',
            description: 'Status of the task (completed or not)'
        },
        due_date: {
            type: 'string',
            format: 'date-time',
            description: 'Planned datetime for the task'
        }
    },
    required: ['id', 'title', 'due_date']
}

module.exports = Task;