import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthdataService } from '../_services/authdata.service';




@Injectable()
export class AuthGuard implements CanActivate {
  isLoggedIn : boolean;


  constructor(private _data : AuthdataService, private router : Router) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {


     this._data.isLoggedIn().subscribe(allowed => {
       if(!allowed) {
         this.router.navigateByUrl('/login');
       } else {

        //if user is logged in check if email is verified
        this._data.isVerified().subscribe(verified => {
          console.log('Verified? ' + verified);
          if(!verified) {
            this.router.navigateByUrl('/verify');
          } 
        })

         this.isLoggedIn = true;
       }
     });

     return this.isLoggedIn;

  }
}
