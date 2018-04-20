import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthdataService } from '../_services/authdata.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  constructor(private route: ActivatedRoute, private _auth: AuthdataService,) { }
  verificationToken: string;

  ngOnInit() {
    this.route
    .queryParams
    .subscribe(params => {
        this.verificationToken = params['verificationToken'];

      
      this._auth.verify(this.verificationToken).subscribe(() => {
            this._auth.IsVerified.next(true);        
      }), err => {
        if(err.status === 410) {
          console.log('Token expired please resend a new email');
        }
      }

    });


  }

}
