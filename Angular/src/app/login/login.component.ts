import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthdataService } from '../_services/authdata.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { trigger, state, style, animate, transition, stagger, keyframes, query } from '@angular/animations';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(100%)'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  showSpinner: boolean = false;
  error = "";

  constructor(
    
    private http: HttpClient,
    private _auth: AuthdataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {
    (this.email = new FormControl("", [
      Validators.required,
      Validators.pattern("[^ @]*@[^ *]*")
    ])),
      (this.password = new FormControl("", [
        Validators.required,
        Validators.minLength(3)
      ]));
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  loginUser() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      //set loading to true and then false if error
      this.showSpinner = true;
      this._auth.login(email, password).subscribe(() => {
          this.router.navigateByUrl("/");
      }, err => {
        this.error = "Incorrect email or password";
        this.showSpinner = false;
     });
    }

    //may not want to reset form
    this.loginForm.reset();
  }
}
