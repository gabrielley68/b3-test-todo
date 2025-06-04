import { build, sequence } from 'mimicry-js';
import { faker } from '@faker-js/faker';

const UserFactory = build({
    fields: {
        email: () => faker.internet.email(),
        password: "3hW2RdkiAgY4biqNxS/u9Nt40P6qAFUEg9PxMxhPdOE",
        display_name: () => faker.person.fullName(),
        birth_date: () => faker.date.birthdate(),
    }
});

export default UserFactory