describe('Jest Setup Test', () => {
    it('Jest is correctly configured and working', () => {
        expect(1 + 1).toBe(2)
    })

    it('supports async/await', async () => {
        const result = await Promise.resolve('test')
        expect(result).toBe('test')
    })

    it('supports ES6 modules', () => {
        const testArray = [1, 2, 3]
        const doubled = testArray.map(x => x * 2)
        expect(doubled).toEqual([2, 4, 6])
    })
})