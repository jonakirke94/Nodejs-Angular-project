import { Component } from "@angular/core";
import {
  HttpClient,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from "@angular/common/http";
import { AuthdataService } from "./_services/authdata.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AuthInfo } from "./models/authInfo";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})
export class AppComponent {
  apiRoot: string = "http://localhost:3000";
  toggleNav: false;
  isLoggedin$: Observable<boolean>;
  currentEmail: string;

  constructor(
    private http: HttpClient,
    private _data: AuthdataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setHeader();
  }

  private setHeader() {
    if (this._data.isLoggedIn()) {
      this.isLoggedin$ = this._data.isLoggedIn();
      this._data.getLoggedInName().subscribe(res => this.changeEmail(res));
    }
  }

  private changeEmail(email: string): void {
    this.currentEmail = email;
  }

  logout() {
    this._data.logout();
    this.router.navigateByUrl("/login");
  }
}
