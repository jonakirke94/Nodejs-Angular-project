import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validator } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule,  } from './app-routing.module';
import { AuthInterceptor} from './_services/auth.interceptor';


import { AuthdataService} from './_services/authdata.service';
import { ProductsService } from "./_services/products.service";

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from "./_services/auth.guard";
import { ProductsComponent } from './products/products.component';
import { CreateComponent } from './create/create.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

@NgModule({

  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    LoadingSpinnerComponent,
    ProductsComponent,
    CreateComponent,
    VerifyEmailComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AuthdataService,
    ProductsService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
