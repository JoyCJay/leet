import { faker } from '@faker-js/faker';
import * as fs from 'node:fs';

const database = { users: [] };

for (let i = 1; i <= 100; i++) {
    database.users.push({
        id: i,
        name: faker.name.findName(),
        email: faker.internet.email()
    });
}

fs.writeFile('./database.json', JSON.stringify(database), 'utf8', (err) => {
    if (err) { console.error(err); return; };
    console.log("database.json created");
});