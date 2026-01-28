import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CguDialogComponent } from './cgu-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalService } from '../../core/services/legal.service/legal.service';

describe('CguDialogComponent', () => {
  let component: CguDialogComponent;
  let fixture: ComponentFixture<CguDialogComponent>;
  let legalServiceSpy: jasmine.SpyObj<LegalService>;

  beforeEach(async () => {
    legalServiceSpy = jasmine.createSpyObj('LegalService', [
      'getCguContent',
      'getMentionsLegales'
    ]);

    legalServiceSpy.getCguContent.and.returnValue('<p>CGU</p>');
    legalServiceSpy.getMentionsLegales.and.returnValue('<p>Mentions</p>');

    await TestBed.configureTestingModule({
      imports: [CguDialogComponent],
      providers: [
        { provide: LegalService, useValue: legalServiceSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { type: 'cgu' } 
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CguDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load CGU content when type is "cgu"', () => {
    expect(legalServiceSpy.getCguContent).toHaveBeenCalled();
    expect(component.safeContent).toBeDefined();
  });

  it('should load mentions legales when type is "mentions"', async () => {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [CguDialogComponent],
      providers: [
        { provide: LegalService, useValue: legalServiceSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { type: 'mentions' }
        }
      ],
    }).compileComponents();

    const fixtureMentions = TestBed.createComponent(CguDialogComponent);
    const componentMentions = fixtureMentions.componentInstance;
    fixtureMentions.detectChanges();

    expect(legalServiceSpy.getMentionsLegales).toHaveBeenCalled();
    expect(componentMentions.safeContent).toBeDefined();
  });
});
