import { deepMerge, canUseDom, bindFunctions } from '../src/utils/util'

describe('the deepMerge function', () => {
  test('merge number and string values in one level', () => expect(
    deepMerge({ a: 1, b: 2 }, { a: '3', b: 4 })).toEqual({ a: '3', b: 4 })
  )
  test('replace str with arr', () => expect(
    deepMerge({ a: 1 }, { a: ['3', 4] })).toEqual({ a: { 0: '3', 1: 4} })
  )
  test('replace arr with obj', () => expect(
    deepMerge({ a: [1, 2] }, { a: { b: 1, c: '2' } })).toEqual({ a: { 0: 1, 1: 2, b: 1, c: '2' } })
  )
  test('replace arr with obj', () => expect(
    deepMerge({ a: [1, 2] }, { a: { b: 1, c: '2' } })).toEqual({ a: { 0: 1, 1: 2, b: 1, c: '2' } })
  )
  test('replace obj with obj', () => expect(
    deepMerge({ a: { b: 1 } }, { a: { b: '2' } })).toEqual({ a: { b: '2' } })
  )
  test('replace array value with arr', () => expect(
    deepMerge({ a: [1] }, { a: { b: [2, 3] } })).toEqual({ a: { 0: 1, b: [2, 3] } })
  )
  test('replace object with number', () => expect(
    deepMerge({ a: 1 }, 2)).toEqual({ a: 1 })
  )
  test('replace number with number', () => expect(
    deepMerge(1, 2)).toEqual({ })
  )

})
