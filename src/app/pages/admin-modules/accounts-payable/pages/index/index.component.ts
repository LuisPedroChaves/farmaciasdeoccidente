import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { PermissionItem } from 'src/app/core/models/Role';
import { AppState } from 'src/app/core/store/app.reducer';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  sessionSubscription: Subscription;
  modules: PermissionItem[] = [];

  constructor(
    public router: Router,
    public store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        this.modules = session.permissions.filter(pr => pr.parent === 'accountsPayable');

        const MODULE_TYPES = {
          'accountsPyabaleProviders': () => this.router.navigate(['/admin/accountsPayable']),
          'accountsPyabaleDocuments': () => this.router.navigate(['/admin/accountsPayable/documents']),
          'accountsPyabaleChecks': () => this.router.navigate(['/admin/accountsPayable/cheques']),
          'accountsPyabaleCheckDeliveries': () => this.router.navigate(['/admin/accountsPayable/checkDeliveries']),
        }

        if (this.modules.length > 0) {
          MODULE_TYPES[this.modules[0].name]();
        }

      }
    });
  }

  ngOnDestroy(): void {
    this.sessionSubscription?.unsubscribe();
  }

  searchModule(name: string): Boolean {
    return this.modules.find(m => m.name === name) ? true : false;
  }

}
