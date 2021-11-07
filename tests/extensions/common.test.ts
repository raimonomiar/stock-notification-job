import { generateHash, compareHash, generateJwtToken } from "../../src/shared/extensions";

describe('generateHash', () => {
    
    it('should return hash that matches the value.', async () => {
        const result = await generateHash('ayushs', '10');
        expect(result).toContain('$2b$10');
    });
});

describe('compareHash', () => {
    
    it('should return true if data matches the hash value.', async () => {
        const result = await compareHash('ayushs', '$2b$10$DG4fr6a4EjAC2qPGCLoHYe2vwikvl21VzLSNcteHPsNgISNvp5GvC');
        expect(result).toBeTruthy();
    });
   
    it('should return false if data doesnt matches the hash value.', async () => {
        const result = await compareHash('ayushslol', '$2b$10$DG4fr6a4EjAC2qPGCLoHYe2vwikvl21VzLSNcteHPsNgISNvp5GvC');
        expect(result).toBeFalsy();
    });
});

describe('generateJwtToken', () => {
    
    it('should generate token based on private key.', () => {
        const data = {
            email: 'raimonomiar@gmail.com',
            name: 'ayush karki',
            userId: '62d75ffd-426b-4cc7-929e-7a93cea8197e'
        };

        const jwtPrivateKey = 'somethingprivate123';

        const result = generateJwtToken(data, jwtPrivateKey, '3600');

        expect(result).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
    });
   
});


