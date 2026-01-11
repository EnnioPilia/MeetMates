import { StatusColorPipe } from './statusColor.pipe';

describe('StatusColorPipe', () => {
  let pipe: StatusColorPipe;

  beforeEach(() => {
    pipe = new StatusColorPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  describe('activity statuses', () => {
    it('should map "ouvert" to green', () => {
      expect(pipe.transform('ouvert')).toBe('text-green-600');
    });

    it('should map "complet" to orange', () => {
      expect(pipe.transform('complet')).toBe('text-orange-500');
    });

    it('should map "annulé" to red', () => {
      expect(pipe.transform('annulé')).toBe('text-red-600');
    });

    it('should map "terminé" to gray', () => {
      expect(pipe.transform('terminé')).toBe('text-gray-500');
    });
  });

  describe('participation statuses', () => {
    it('should map "accepté" to green', () => {
      expect(pipe.transform('accepté')).toBe('text-green-600');
    });

    it('should map "en attente" to orange', () => {
      expect(pipe.transform('en attente')).toBe('text-orange-500');
    });

    it('should map "refusé" to red', () => {
      expect(pipe.transform('refusé')).toBe('text-red-600');
    });
  });

  describe('edge cases', () => {
    it('should be case insensitive', () => {
      expect(pipe.transform('OUVERT')).toBe('text-green-600');
    });

    it('should return default color for unknown value', () => {
      expect(pipe.transform('foo')).toBe('text-black');
    });

    it('should return default color for null', () => {
      expect(pipe.transform(null)).toBe('text-black');
    });

    it('should return default color for undefined', () => {
      expect(pipe.transform(undefined)).toBe('text-black');
    });
  });
});
