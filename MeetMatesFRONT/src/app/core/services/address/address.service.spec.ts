import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AddressService, AddressSuggestion } from './address.service';

describe('AddressService', () => {
  let service: AddressService;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://api-adresse.data.gouv.fr/search/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AddressService]
    });

    service = TestBed.inject(AddressService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  // ----------------------------------
  // Query trop courte
  // ----------------------------------
  it('should return empty array if query length < 3', () => {
    service.getAddressSuggestions('pa').subscribe(result => {
      expect(result).toEqual([]);
    });

    // AUCUN appel HTTP attendu
    httpMock.expectNone(apiUrl);
  });

  // ----------------------------------
  // Appel HTTP + mapping
  // ----------------------------------
  it('should fetch and map address suggestions', () => {
    const apiResponse = {
      features: [
        {
          properties: {
            label: '10 Rue de Rivoli, Paris',
            name: 'Rue de Rivoli',
            city: 'Paris',
            postcode: '75001'
          }
        }
      ]
    };

    const expected: AddressSuggestion[] = [
      {
        label: '10 Rue de Rivoli, Paris',
        street: 'Rue de Rivoli',
        city: 'Paris',
        postalCode: '75001'
      }
    ];

    service.getAddressSuggestions('rue').subscribe(result => {
      expect(result).toEqual(expected);
    });

    const req = httpMock.expectOne(req =>
      req.method === 'GET' &&
      req.url === apiUrl &&
      req.params.get('q') === 'rue' &&
      req.params.get('limit') === '5'
    );

    req.flush(apiResponse);
  });

  // ----------------------------------
  // Gestion d’erreur
  // ----------------------------------
it('should return empty array on HTTP error', () => {
  service.getAddressSuggestions('paris').subscribe(result => {
    expect(result).toEqual([]);
  });

  const req = httpMock.expectOne(req =>
    req.method === 'GET' &&
    req.url === apiUrl &&
    req.params.get('q') === 'paris' &&
    req.params.get('limit') === '5'
  );

  req.flush('Error', { status: 500, statusText: 'Server Error' });
});

});
