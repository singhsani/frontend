import { TestBed, inject } from '@angular/core/testing';

import { UploadFileService } from './upload-file.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionStorageService } from 'angular-web-storage';
import { HttpService } from './services/http.service';

 describe('Shared Services : UploadFileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UploadFileService, HttpService, SessionStorageService]
    });
  });

  it('should be created', inject([UploadFileService], (service: UploadFileService) => {
    expect(service).toBeTruthy();
  }));
});
