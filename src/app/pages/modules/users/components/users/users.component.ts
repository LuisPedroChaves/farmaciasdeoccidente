import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
const SMALL_WIDTH_BREAKPOINT = 200;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  public mediaMatcher: MediaQueryList = window.matchMedia(
    `(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`
  );
  newRoleVisible = false;
  roleDetailsVisible = false;
  newUserVisible = false;
  userDetailsVisible = false;
  mediaSub: Subscription;
  devicesXs: boolean;
  constructor(zone: NgZone, public mediaObserver: MediaObserver) {
    // tslint:disable-next-line: deprecation
    this.mediaMatcher.addListener((mql) =>
      zone.run(() => {
        this.mediaMatcher = matchMedia(
          `(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`
        );
      })
    );
  }

  ngOnInit(): void {
    this.mediaSub = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.devicesXs = result.mqAlias === 'xs' ? true : false;
      }
    );
  }

  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
  }

  editUser(): void {
    this.openPanel('editUser');
  }

  editRole(): void {
    this.openPanel('editRole');
  }

  openPanel(panel: string): void {
    this.newRoleVisible = false;
    this.roleDetailsVisible = false;
    this.newUserVisible = false;
    this.userDetailsVisible = false;

    switch (panel) {
      case 'newRole':
        this.newRoleVisible = true;
        break;
      case 'editRole':
        this.roleDetailsVisible = true;
        break;
      case 'newUser':
        this.newUserVisible = true;
        break;
      case 'editUser':
        this.userDetailsVisible = true;
        break;
    }
  }

  // handleEvent(e: ControlEvent) {
  //   switch (e.Event) {
  //     case this.config.EVENT_CLOSE_WINDOWS:
  //       this.newRoleVisible = false;
  //       this.roleDetailsVisible = false;
  //       this.newUserVisible = false;
  //       this.userDetailsVisible = false;
  //       break;
  //   }
  // }
}
