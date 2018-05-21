import { CommonService } from './../../services/common.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
	selector: 'loading-indicator',
	template: `  <div class="loading-shade" [hidden]="!(loading$ | async)?.loading">
                  <mat-spinner></mat-spinner>
                </div>
            `,
	styles: [`
				.loading-shade {
					position: absolute;
					top: 0;
					left: 0;
					bottom: 0;
					right: 0;
					background: rgba(0, 0, 0, 0.15);
					z-index: 1;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			`]
})
export class LoadingIndicatorComponent implements OnInit {

	loading$: Subject<{ loading: boolean }>;

	constructor(private commonService: CommonService) {
		this.loading$ = this.commonService.loading;
	}

	ngOnInit() { }

}
