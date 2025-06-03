import { build, sequence } from 'mimicry-js';
import { faker } from '@faker-js/faker';

const UserFactory = build({
    fields: {
        email: () => faker.internet.email(),
        password: () => faker.internet.password(),
        display_name: () => faker.person.fullName(),
        birth_date: () => faker.date.birthdate(),
    }
});

export default UserFactory