import { Component, OnInit, Optional} from '@angular/core';
import { ProductsService } from '../_services/products.service';
import { trigger, state, style, animate, transition, stagger, keyframes, query } from '@angular/animations';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('flyInRight', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(100%)'}),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({transform: 'translateX(100%)'}))
      ])
    ]),

    trigger('flyInLeft', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {


  constructor(private router : Router) { }

  ngOnInit() {
  }

  routeAll() {
    this.router.navigateByUrl('/products');
  }

  routeCreate() {
    this.router.navigateByUrl('/products/create');
  }



 


  

}
