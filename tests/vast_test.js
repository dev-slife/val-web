const fetch = require('node-fetch');

describe('API VAST Tests', () => {
    test('simplify', async () => {
        const response = await fetch('localhost:3000/api/vast/simplify?expression=5x-3x%2B2');
        expect(response.status).toBe(200);
        expect(response.body.answer).toBe("2x+2");
    });

    test('solve', async () => {
        const response = await fetch('localhost:3000/api/vast/solve?expression=5x-3x%2B2');
        expect(response.status).toBe(200);
        expect(response.body.answer.replaceAll(' ', '').substring(0, 4)).toBe("x=-1");
    });

    test('ask', async () => {
        const response = await fetch('localhost:3000/api/vast/ask?question=Hey%20VAL%20could%20you%20help%20me%20solve%20this%20equation%3F%0A5x-3x%2B2');
        expect(response.status).toBe(200);
    });
});