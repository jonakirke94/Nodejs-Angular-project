import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthdataService } from "../_services/authdata.service";
import { trigger, state, style, animate, transition, stagger, keyframes, query } from '@angular/animations';


@Component({
  selector: "app-verify-email",
  templateUrl: "./verify-email.component.html",
  styleUrls: ["./verify-email.component.css"],
  animations: [
    //main content
    trigger("flyInOut", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => *", [
        style({ transform: "translateX(100%)" }),
        animate(100)
      ]),
      transition("* => void", [
        animate(100, style({ transform: "translateX(100%)" }))
      ])
    ]),
    //alert bar
    trigger("flyUpDown", [
      state("in", style({ transform: "translateY(0)" })),
      transition("void => *", [
        style({ transform: "translateY(100%)" }),
        animate(100)
      ]),
      transition("* => void", [
        animate(100, style({ transform: "translateY(100%)" }))
      ])
    ])
  ]
})
export class VerifyEmailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _auth: AuthdataService
  ) {}
  verificationToken: string;
  showSpinner: boolean = false;
  showDanger: boolean = false;
  showSuccess: boolean = false;
  message: string;
  disableResend: boolean = false;
  
  routeParams$;
  verify$;
  login$;
  resend$;

  ngOnInit() {
    this.showNotVerified(true);
    this.verify();
  }

  ngOnDestroy() {
    this.destroy();
  } 

  verify() {
    this.routeParams$ = this.route.queryParams.subscribe(params => {
      this.verificationToken = params["verificationToken"];

      if (this.verificationToken) {
        this.showSpinner = true;

        this.verify$ = this._auth.verify(this.verificationToken).subscribe(
          () => {
            //set authinfo.isVerified to true

            const authInfo = JSON.parse(localStorage.getItem("authInfo"));
            authInfo.isVerified = true;
            localStorage.setItem("authInfo", JSON.stringify(authInfo));

            this.router.navigateByUrl('/');
          },
          err => {
            if (err.status === 410) {
              this.showNotVerified(false);

              //show alert
              this.showDanger = true;
              this.message =
                "The verification link has expired. Please click the button below to send a new one";

              //hide spinner
              this.showSpinner = false;
            }

            if (err.status === 401) {
              this.router.navigateByUrl("/");
            }
          }
        );
      }
    });
  }

  resend() {
    this.showSpinner = true;

    //check if user is logged in 
    this.login$ = this._auth.isLoggedIn().subscribe(loggedIn => {
      if(!loggedIn) {
        this.router.navigateByUrl('/login');
      }
    })

    this.resend$ = this._auth.sendVerificationEmail().subscribe(
      res => {
        this.showNotVerified(false);

        //show success message
        this.showSuccess = true;
        this.message = "Successfully sent a new verification email";

        //disable resend button
        this.disableResend = true;
        this.showSpinner = false;
      },
      err => {
        if (err.status === 401) {
          this.router.navigateByUrl("/");
        }
      }
    );
  }

  showNotVerified(show: boolean) {
    if(show) {
      this.showDanger = true;
      this.message = "Please verify your email address by clicking the link sent to your email";
    } else {
      this.showDanger = false;
    }
  }

  hideSuccess() {
    this.showNotVerified(true);
    this.showSuccess = false;
    this.disableResend = false;
  }

  destroy() {
    if(this.routeParams$ && this.routeParams$ !== "undefined") {
      this.routeParams$.unsubscribe();
    }

    if(this.verify$ && this.verify$ !== "undefined") {
      this.verify$.unsubscribe();
    }

    if(this.login$ && this.login$ !== "undefined") {
      this.login$.unsubscribe();
    }

    if(this.resend$ && this.resend$ !== "undefined") {
      this.resend$.unsubscribe();
    }
  }


}
