import { join } from './utils';
import { describe, it, expect } from 'vitest';

describe('join', () => {
	it('should work', () => {
		expect(join()).toStrictEqual(null);
		expect(join(null)).toStrictEqual(null);
		expect(join(undefined)).toStrictEqual(null);
		expect(join('foo', 'bar')).toStrictEqual('foo bar ');
		expect(join(null, 'foo', undefined, 'bar', null)).toStrictEqual('foo bar ');
		expect(join(null, undefined, null)).toStrictEqual(null);
	});
});
