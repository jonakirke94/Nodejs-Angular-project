import { Injectable, Output, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/do";
import "rxjs/add/operator/shareReplay";
import { AuthInfo } from "../models/authInfo";
import { tokenNotExpired,JwtHelper } from 'angular2-jwt';
import { IfObservable } from "rxjs/observable/IfObservable";
import { Observable } from "rxjs/Observable";


@Injectable()
export class AuthdataService {
  private jwtHelper = new JwtHelper();

  private email: string;
  loggedIn = new BehaviorSubject<boolean>(false);
  LoggedInName = new BehaviorSubject<string>("");
  IsVerified = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    this.logout();

    return this.http
      .post("http://localhost:3000/user/login", {
        email,
        password
      })
      .do(res => {
        this.setSession(res, email);
        this.loggedIn.next(true);
        this.LoggedInName.next(email);
      })
      .shareReplay();
  }

  signup(email: string, password: string) {
    return this.http
      .post("http://localhost:3000/user/signup", {
        email,
        password
      })
      .do(res => {
        this.login(email, password);
      })
      .shareReplay();
  }

  verify(token: string) {
    return this.http
      .post("http://localhost:3000/user/verify", {
        "veriToken": token
      })
      .do(res => console.log(res))
      .shareReplay();
  }

  private setSession(authResult, email) {

    //the user is logged in as long as a valid refreshtoken exists on the sever
    const expiresAt = moment().add(authResult.data.refreshExp, "seconds");
    localStorage.setItem("accesstoken", authResult.data.accesstoken);
    localStorage.setItem("refresh_expiresAt", JSON.stringify(expiresAt.valueOf()));

    let authInfo = new AuthInfo(email, authResult.data.isVerified);
    localStorage.setItem("authInfo", JSON.stringify(authInfo));
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refresh_expiresAt");
    localStorage.removeItem("authInfo");
  }

  public isLoggedIn() {
    const IsValid = moment().isBefore(this.getExpiration());
    IsValid ? this.loggedIn.next(true) : this.loggedIn.next(false);
    return this.loggedIn.asObservable();
  }

  public isVerified() {
    const authInfo = JSON.parse(localStorage.getItem("authInfo"));
    authInfo.isVerified ? this.IsVerified.next(true) : this.IsVerified.next(false);
    return this.IsVerified.asObservable();
  }
  
  public getLoggedInName() {
    this.loggedIn.subscribe(res => {
      if (res === true) {
        const authInfo = JSON.parse(localStorage.getItem("authInfo"));
        this.LoggedInName.next(authInfo.email);
      }
    });
    return this.LoggedInName.asObservable();
  }

    getExpiration() {
    const expiration = localStorage.getItem("refresh_expiresAt");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
