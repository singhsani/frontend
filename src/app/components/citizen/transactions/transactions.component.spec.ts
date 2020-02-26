import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { TransactionsComponent } from './transactions.component';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { PaginationService } from '../../../core/services/citizen/data-services/pagination.service';
import { HttpService } from '../../../shared/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionStorageService } from 'angular-web-storage';

 describe('Component : TransactionsComponent', () => {
	let component: TransactionsComponent;
	let fixture: ComponentFixture<TransactionsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [MaterialModule,
				HttpClientTestingModule],
			declarations: [TransactionsComponent],
			providers: [PaginationService,
				HttpService,
				SessionStorageService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TransactionsComponent);
		component = fixture.componentInstance;
		//fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
