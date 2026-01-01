import { parseLocalDate, formatLocalDate } from './date.utils';

describe('date.utils', () => {

  describe('parseLocalDate', () => {

    it('should convert YYYY-MM-DD string to local Date', () => {
      const date = parseLocalDate('2025-01-10');

      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(0); // janvier = 0
      expect(date.getDate()).toBe(10);
    });

  });

  describe('formatLocalDate', () => {

    it('should format Date to YYYY-MM-DD string', () => {
      const date = new Date(2025, 0, 10);

      const result = formatLocalDate(date);

      expect(result).toBe('2025-01-10');
    });

  });

  describe('round trip', () => {

    it('should keep same date after parse and format', () => {
      const original = '2024-12-25';

      const result = formatLocalDate(parseLocalDate(original));

      expect(result).toBe(original);
    });

  });

});
