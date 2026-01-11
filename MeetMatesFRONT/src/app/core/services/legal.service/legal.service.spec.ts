import { TestBed } from '@angular/core/testing';
import { LegalService } from './legal.service';

describe('LegalService', () => {
  let service: LegalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LegalService]
    });

    service = TestBed.inject(LegalService);
  });

  it('should return CGU content as HTML string', () => {
    const content = service.getCguContent();

    expect(typeof content).toBe('string');
    expect(content).toContain('Conditions Générales d’Utilisation');
    expect(content).toContain('Création de compte');
    expect(content).toContain('Responsabilité');
    expect(content).toContain('Données personnelles');
  });

  it('should return mentions legales content as HTML string', () => {
    const content = service.getMentionsLegales();

    expect(typeof content).toBe('string');
    expect(content).toContain('Mentions légales');
    expect(content).toContain('projet pédagogique'); 
    expect(content).toContain('Responsable de publication');
    expect(content).toContain('usage commercial');
  });
});
