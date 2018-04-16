import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Product } from "../models/product";

@Injectable()
export class ProductsService {
  /*   private productsList = new BehaviorSubject<any>('');
  products = this.productsList.asObservable(); */

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get("http://localhost:3000/products/")
    .map(res => res);
  }

  createProduct(model: Product) {
    return this.http
      .post("http://localhost:3000/products/", model)
      .map(res => res);
  }

  deleteProduct(id) {
    return this.http
    .delete(`http://localhost:3000/products/${id}`)
    .map(res => res);
  }

  updateProduct(id, model) {
    return this.http
    .put(`http://localhost:3000/products/${id}`, model)
    .map(res => res);
  }
}
