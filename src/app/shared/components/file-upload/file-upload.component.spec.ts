import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { FileUploadComponent } from './file-upload.component';
import { MaterialModule } from '../../modules/material/material.module';
import { UploadFileService } from '../../upload-file.service';
import { HttpService } from '../../services/http.service';
import { SessionStorageService } from 'angular-web-storage';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { detectChanges } from '@angular/core/src/render3';

describe('Shared : FileUploadComponent', () => {
	let component: FileUploadComponent;
	let fixture: ComponentFixture<FileUploadComponent>;

	const createComponent = () => {
		fixture = TestBed.createComponent(FileUploadComponent);
		component = fixture.componentInstance;
	}

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [MaterialModule, HttpClientTestingModule], 
			declarations: [FileUploadComponent],
			providers: [UploadFileService,
				CommonService,
				SessionStorageService,
				HttpService]
		}).compileComponents().then(() => {
			createComponent();
			const attachment = new FormArray([])
			const form = new FormGroup({ attachments: attachment })
			component.form = form;
		})
	}));
	

	it('should create', () => {
		component.ngOnInit();
		expect(component.attachments.length).toBe(0);
	});
});
