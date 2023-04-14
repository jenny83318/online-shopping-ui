/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { JolService } from './JolService.service';

describe('Service: JolService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JolService]
    });
  });

  it('should ...', inject([JolService], (service: JolService) => {
    expect(service).toBeTruthy();
  }));
});
