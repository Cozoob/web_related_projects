import {Input, NgModule, Output, ViewChild, APP_INITIALIZER} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DishesComponent } from './components/dishes/dishes.component';
import {DishesService} from "./services/dishes.service";
import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormComponent } from './components/form/form.component';
import { BasketComponent } from './components/basket/basket.component';
import {ReactiveFormsModule} from "@angular/forms";
import { RatingComponent } from './components/rating/rating.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DishDetailsComponent } from './components/dish-details/dish-details.component';
import { DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

import { AngularFireModule } from "@angular/fire/compat";
import { environment } from '../environments/environment';
import { LoggingComponent } from './components/logging/logging.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AdminToolsComponent } from './components/admin-tools/admin-tools.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminModifyDishComponent } from './components/admin-modify-dish/admin-modify-dish.component';

@NgModule({
  declarations: [
    AppComponent,
    DishesComponent,
    NavigationComponent,
    FooterComponent,
    FormComponent,
    BasketComponent,
    RatingComponent,
    HomeComponent,
    PageNotFoundComponent,
    DishDetailsComponent,
    LoggingComponent,
    RegistrationComponent,
    AdminToolsComponent,
    AdminMenuComponent,
    AdminUsersComponent,
    AdminModifyDishComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [DishesService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {

}
