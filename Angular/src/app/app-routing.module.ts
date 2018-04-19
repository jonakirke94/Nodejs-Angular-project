import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import { AuthGuard } from "./_services/auth.guard";
import { ProductsComponent } from './products/products.component';
import { CreateComponent } from './create/create.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'verify',
    component: VerifyEmailComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    component: ProductsComponent
  },
  {
    path: 'products/create',
    canActivate: [AuthGuard],
    component: CreateComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
