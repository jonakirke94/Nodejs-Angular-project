import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, stagger, keyframes, query } from '@angular/animations';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { HttpClient } from '@angular/common/http';
import { AuthdataService } from '../_services/authdata.service';
import { Router } from '@angular/router';
import {AbstractControl, FormControl, Validators, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
  animations: [
    trigger("flyInOut", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => *", [
        style({ transform: "translateX(100%)" }),
        animate(100)
      ]),
      transition("* => void", [
        animate(100, style({ transform: "translateX(100%)" }))
      ])
    ])
  ]
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  passwords: FormGroup;
  email: FormControl;
  password: FormControl;
  confirm: FormControl; 
  showSpinner: boolean = false;
  error = "";
  showForm: string;
  showSignup = "hide";

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
    this.email = new FormControl("", [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
    ]),
      this.password = new FormControl("", [
        Validators.required,
        Validators.minLength(3) 
      ]),
      this.confirm = new FormControl("", [
         Validators.required,    
      ])
  }

  createForm() {
    //creating the password group first so we can assign it to a variable
    //this makes validation expressions shorter
    this.passwords = new FormGroup({
      password: this.password,
      confirm: this.confirm
    }, this.areEqual)

    this.signupForm = new FormGroup({
      email: this.email,     
      passwords: this.passwords
    });

    
  }

  //used to determine whether the passwords match
  private areEqual(c: AbstractControl): ValidationErrors | null {
    const keys: string[] = Object.keys(c.value);
    for (const i in keys) {
      if (i !== "0" && c.value[keys[+i - 1]] !== c.value[keys[i]]) {
        return { areEqual: true };
      }
    }
  }

  signupUser() {
    if (this.signupForm.valid) {
      const email = this.signupForm.value.email;
      const password = this.passwords.value.password;

      //set loading to true and then false if error
      this.showSpinner = true;
      this._auth.signup(email, password).subscribe(
        () => {
          //logging the user in after we signed him up
          this._auth.login(email, password).subscribe(() => {
            this.router.navigateByUrl("/");
          }),
            err => {
              this.error = "Error logging in";
              this.showSpinner = false;
            };
        },
        err => {
          if(err.status === 409) {
            this.error = "Email already exists";
          } else {
            this.error = "Error";
          }         
          this.showSpinner = false;
        }
      );

      //may not want to reset form
      this.signupForm.reset();
    }
  }
}
