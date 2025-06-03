import { build, sequence } from 'mimicry-js';
import { faker } from '@faker-js/faker';

const TaskFactory = build({
    fields: {
        title: sequence(x => `Tâche n°${x}`),
        description: () => faker.lorem.lines(1),
        done: false,
        due_date: () => faker.date.soon({days: 7}),
    }
});

export default TaskFactory