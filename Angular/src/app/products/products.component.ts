import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../_services/products.service';
import { trigger, state, style, animate, transition, stagger, keyframes, query, group } from '@angular/animations';
import swal from 'sweetalert2'
import { Product } from '../models/product';
import { interval } from 'rxjs/observable/interval';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({width: 120, transform: 'translateX(0)', opacity: 1})),
      transition('void => *', [
        style({width: 100, transform: 'translateX(1000px)', opacity: 0}),
        group([
          animate('0.3s 0.1s ease', style({
            transform: 'translateX(0)',
            width: 1000
          })),
          animate('0.3s ease', style({
            opacity: 1
          }))
        ])
      ]),

    ])
  ]
})
export class ProductsComponent implements OnInit {

  products = [];
  fetch$;
  update$;
  delete$;

  constructor(private _products: ProductsService) { }

  ngOnInit() { 
    this.fetchProducts();
  }

  ngOnDestroy() {
    this.destroy();
  }

  fetchProducts() {
    this.fetch$ = this._products.getProducts()
    .subscribe(res => {
      this.products = res["data"];
      this.products.reverse();
     });
  }

  updateProduct(model: Product) {

    swal.setDefaults({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2']
    })
    
    var steps = [
      {
        title: 'Name',
        text: `${model["Name"]}`
      },
      {
        title: 'Description',
        text: `${model["Description"]}`
      },

    ]
    
    swal.queue(steps).then((result) => {
      swal.resetDefaults()
    
      if (result.value) {
        const product = new Product(result.value[0], result.value[1]);
        const id = model["ProductId"];

        this.update$ = this._products.updateProduct(id, product).subscribe(res => {
          swal(
            'Success!',
            'The product got updated!',
            'success'
          )

          this.fetchProducts();
        }, err => {
        })
      }
    })
  }

  confirmDelete(model : Product) {
    const id = model["ProductId"];

    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.delete$ = this._products.deleteProduct(id).subscribe(res => {
        swal(
          'Deleted!',
          'The product has been deleted.',
          'success'
        )

        this.fetchProducts();
      }, err => {
        swal({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
     });
      }
    })
  }

  destroy() {
    //unsubscribe to prevent memory leaks
    if(this.fetch$ && this.fetch$ !== "undefined") {
      this.fetch$.unsubscribe();
    }

    if(this.update$ && this.update$ !== "undefined") {
      this.update$.unsubscribe();
    }

    if(this.delete$ && this.delete$ !== "undefined") {
      this.delete$.unsubscribe();
    }
  }
 


}
