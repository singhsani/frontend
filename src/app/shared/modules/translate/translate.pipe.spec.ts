import { TranslatePipe } from './translate.pipe';
import { TestBed, inject } from '@angular/core/testing';
import { TranslateService } from './translate.service';
import { HttpService } from '../../services/http.service';
import { SessionStorageService } from 'angular-web-storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';

 describe('Shared Pipes : TranslatePipe', () => {
  let  pipe : TranslatePipe;
  let service : TranslateService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TranslateService, HttpService, SessionStorageService]
    });
  });

  it('should be created', ()=> {
    pipe = new TranslatePipe(service)
    expect(pipe).toBeTruthy();
  });
});
