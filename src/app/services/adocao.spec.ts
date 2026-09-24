import { TestBed } from '@angular/core/testing';

import { Adocao } from './adocao';

describe('Adocao', () => {
  let service: Adocao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Adocao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
