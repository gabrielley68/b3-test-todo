import { describe, it, expect } from 'vitest';

import {
    validatePassword, 
    NO_CAPITAL, NO_LOWERCASE,
    NO_NUMBER, CONTAINS_NAME,
 } from '/utils/password_validator';

describe("validatePassword", () => {
    it("should contain a capital letter", () => {
        expect(validatePassword("monsupermotdepasse")).toContain(
            NO_CAPITAL
        );
        expect(validatePassword("Monsupermotdepasse")).not.toContain(
            NO_CAPITAL
        );
    });

    it("should contain a lowercase letter", () => {
        expect(validatePassword("MONSUPERMOTDEPASSE")).toContain(
            NO_LOWERCASE
        );
        expect(validatePassword("mONSUPERMOTDEPASSE")).not.toContain(
            NO_LOWERCASE
        );
    });

    it("should contain a lowercase letter", () => {
        expect(validatePassword("monsupermotdepasse")).toContain(
            NO_NUMBER
        );
        expect(validatePassword("monsupermotdepasse123")).not.toContain(
            NO_NUMBER
        );
    });

    it("shouldn't contain username", () => {
        const username = "Gabriel Ley";

        expect(validatePassword("gabriellebg", username)).toContain(
            CONTAINS_NAME
        );
        expect(validatePassword("gloirealafamilleley", username)).toContain(
            CONTAINS_NAME
        );

        expect(validatePassword("motdepasseneutre", username)).not.toContain(
            CONTAINS_NAME
        );
    });

    it("small words shouldn't impact name detection", () => {
        const username = "Gabriel le gros bg";

        expect(validatePassword("jesuisunbg", username)).not.toContain(
            CONTAINS_NAME
        );
    });

    it("should validate strong password", () => {
        expect(validatePassword("3hW2RdkiAgY4biqNxS/u9Nt40P6qAFUEg9PxMxhPdOE")).toEqual([]);
    });
});