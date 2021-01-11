import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  configSubscription: Subscription;
  sessionSubscription: Subscription;
  smallScreen = window.innerWidth < 960 ? true : false;
  visible = false;
  loginNow = false;
  loading = false;
  loaded = false;
  errormsg: any;
  showError = false;

  public form: FormGroup;
  error: string;

  type: string;

  constructor(
    //TODO: public store: Store<AppState>,
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService
  ) {
  //   this.configSubscription = this.store.select('config').pipe(filter( config => config !== null)).subscribe( config => {
  //     this.smallScreen = config.deviceConfig.smallScreen;
  // });
   }

  ngOnInit(): void {
    // this.sessionSubscription = this.store.select('session').subscribe( session => {
    //   this.loading = session.loading;
    //   this.errormsg = null;
    //   this.showError = false;
    //   if (session.error !== null) {
    //     this.error = session.error.errorMessage;
    //     this.showError = true;
    //   }
    //   this.loaded = session.loaded;
    //   if (session.token && session.error === null && session.loaded === true) {
    //     this.type = session.currentUser.type;
    //     if (this.type === 'ADMIN') {
    //       this.router.navigate(['/admin']);
    //     } else {
    //       this.router.navigate(['/']);
    //     }
    //   }
    // });
    // FORM
    this.form = this.fb.group ( {
      user: ['', Validators.compose([Validators.required] )],
      password: ['' , Validators.compose ( [ Validators.required ] )]
    });
  }

}
