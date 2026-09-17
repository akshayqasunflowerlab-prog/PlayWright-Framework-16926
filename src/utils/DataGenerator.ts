import { faker } from "@faker-js/faker";

export interface TtaCredentials {
    username: string;
    password: string;
}

export function generateUsername(): string {
    return faker.internet.username().toLowerCase();
}

export function generatePassword(): string {
    return faker.internet.password({ length: 12, memorable: false });
}

export function generateCredentials(): TtaCredentials {
    return {
        username: generateUsername(),
        password: generatePassword(),
    };
}

export default {
    generateUsername,
    generatePassword,
    generateCredentials,
};
