import { parseLocalDate, formatLocalDate } from './date.utils';

describe('Date utils', () => {

  describe('parseLocalDate', () => {

    it('should parse YYYY-MM-DD into a local Date', () => {
      const date = parseLocalDate('2025-03-15');

      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(2);
      expect(date.getDate()).toBe(15);
    });

    it('should not shift the day due to timezone', () => {
      const date = parseLocalDate('2024-01-01');

      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(1);
    });
  });

  describe('formatLocalDate', () => {

    it('should format a Date into YYYY-MM-DD', () => {
      const date = new Date(2025, 4, 9); 

      const result = formatLocalDate(date);

      expect(result).toBe('2025-05-09');
    });

    it('should pad month and day with leading zeros', () => {
      const date = new Date(2023, 0, 3);

      const result = formatLocalDate(date);

      expect(result).toBe('2023-01-03');
    });
  });

  describe('round-trip conversion', () => {

    it('should preserve date when parsing then formatting', () => {
      const original = '2026-12-25';

      const parsed = parseLocalDate(original);
      const formatted = formatLocalDate(parsed);

      expect(formatted).toBe(original);
    });
  });
});
