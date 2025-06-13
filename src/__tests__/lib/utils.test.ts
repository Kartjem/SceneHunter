import { cn } from '@/lib/utils'

describe('utils', () => {
    describe('cn function', () => {
        it('combines classes correctly', () => {
            expect(cn('class1', 'class2')).toBe('class1 class2')
        })

        it('handles conditional classes', () => {
            expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2')
        })

        it('handles class objects', () => {
            expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2')
        })

        it('correctly handles Tailwind class conflicts', () => {
            expect(cn('p-2', 'p-4')).toBe('p-4')
            expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
        })

        it('handles empty input', () => {
            expect(cn()).toBe('')
            expect(cn('')).toBe('')
            expect(cn(null, undefined)).toBe('')
        })

        it('handles arrays of classes', () => {
            expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
        })

        it('correctly handles duplicate classes', () => {
            expect(cn('class1', 'class1', 'class2')).toBe('class1 class1 class2')
        })
    })
})