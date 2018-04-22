import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition, stagger, keyframes, query, group } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../_services/products.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: [
    trigger('flyInRight', [
      state('in', style({width: 120, transform: 'translateX(0)', opacity: 1})),
      transition('void => *', [
        style({width: 1000, transform: 'translateX(300px)', opacity: 0}),
        group([
          animate('0.3s 0.1s ease', style({
            transform: 'translateX(30px)',
            width: 400
          })),
          animate('0.3s ease', style({
            opacity: 1
          }))
        ])
      ]),

    ])
  ]
})
export class CreateComponent implements OnInit {

  createForm: FormGroup;
  name: FormControl;
  description: FormControl;
  showSpinner: boolean = false;
  error = "";
  create$;

  constructor(
    
    private http: HttpClient,
    private router: Router,
    private _products : ProductsService
  ) {}

  ngOnInit() {
    this.createFormControls();
    this.createFormGroup();
  }

  ngOnDestroy() {
    //unsubscribe to prevent memory leaks
    if(this.create$ && this.create$ !== "undefined") {
      this.create$.unsubscribe();
    }
  }


  createFormControls() {
    (this.name = new FormControl("", [
      Validators.required,
      Validators.minLength(3)
    ])),
      (this.description = new FormControl("", [
        Validators.required,
        Validators.minLength(10)
      ]));
  }

  createFormGroup() {
    this.createForm = new FormGroup({
      name: this.name,
      description: this.description
    });
  }

  createProduct() {
    const name = this.name.value;
    const description = this.description.value;
    const product = new Product(name, description)

    this.showSpinner = true;
    this.create$ = this._products.createProduct(product).subscribe(() => {
      this.router.navigateByUrl("/products");
  }, err => {
    this.error = "Something went wrong.. Please try again!";
    this.showSpinner = false;
 });


    
  }

  

  

}
