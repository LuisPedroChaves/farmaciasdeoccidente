import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CellarItem } from 'src/app/core/models/Cellar';
import { AppState } from 'src/app/store/app.reducer';
import { AuthService } from '../../../../core/auth/auth.service';
import * as actions from '../../../../store/actions';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy {

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
    public store: Store<AppState>,
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.sessionSubscription = this.store.select('session').subscribe(session => {
      this.loading = session.loading;
      this.errormsg = null;
      this.showError = false;
      if (session.error !== null) {
        this.error = session.error.errorMsg;
        this.showError = true;
      }
      this.loaded = session.loaded;
      if (session.token && session.error === null && session.loaded === true) {
        this.type = session.currentUser.type;
        switch (this.type) {
          case 'ADMIN':
            this.router.navigate(['/admin']);
            break;
          case 'FACTORY':
            localStorage.setItem('currentstore', JSON.stringify(session.currentUser.user._cellar));
            this.router.navigate(['/']);
            break;
          case 'PHARMA':
            localStorage.setItem('currentstore', JSON.stringify(session.currentUser.user._cellar));
            this.router.navigate(['/']);
            break;
          case 'DELIVERY':
            this.router.navigate(['/delivery']);
            break;
          case 'SELLER':
            this.router.navigate(['/seller']);
            break;
        }
      }
    });
    // FORM
    this.form = this.fb.group({
      user: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnDestroy() {
    this.sessionSubscription?.unsubscribe();
  }

  onSubmit() {
    this.error = undefined;
    if (this.form.invalid) { return; }
    const { user, password } = this.form.value;
    this.store.dispatch(actions.login({ u: user, p: password }));

    // this.loginNow = true;
    // this.authService.login(user, password).subscribe(data => {
    //   this.loginNow = false;
    //   const r = {...data};
    //   this.company = r.company;
    //   localStorage.setItem('iea-session', JSON.stringify(r));
    //   if (this.company === 'admin') {
    //     this.router.navigate(['/admin']);
    //   } else {
    //     this.router.navigate(['/']);
    //   }
    // }, error => {
    //   this.loginNow = false;
    //   this.error = 'El usuario o contraseña no es válido';
    // });

  }

}
