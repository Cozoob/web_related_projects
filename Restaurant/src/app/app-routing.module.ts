import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormComponent} from "./components/form/form.component";
import {BasketComponent} from "./components/basket/basket.component";
import {DishesComponent} from "./components/dishes/dishes.component";
import {HomeComponent} from "./components/home/home.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {DishDetailsComponent} from "./components/dish-details/dish-details.component";
import {LoggingComponent} from "./components/logging/logging.component";
import {RegistrationComponent} from "./components/registration/registration.component";
import { AuthGuard } from "./guard/auth.guard";
import {AdminToolsComponent} from "./components/admin-tools/admin-tools.component";
import {IsSignedInGuardGuard} from "./guard/is-signed-in-guard.guard";
import {AdminMenuComponent} from "./components/admin-menu/admin-menu.component";
import {AdminUsersComponent} from "./components/admin-users/admin-users.component";
import {AdminModifyDishComponent} from "./components/admin-modify-dish/admin-modify-dish.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch:'full' },
  { path: 'home' , component: HomeComponent },
  { path: 'menu' , component: DishesComponent },
  { path: 'form' , component: FormComponent, canActivate: [AuthGuard] },
  { path: 'basket' , component: BasketComponent, canActivate: [AuthGuard] },
  { path: 'dish/:id', component: DishDetailsComponent, canActivate: [AuthGuard] },
  { path: 'admin-tools', component: AdminToolsComponent, canActivate: [AuthGuard] },
  { path: 'admin-menu', component: AdminMenuComponent, canActivate: [AuthGuard] },
  { path: 'admin-users', component: AdminUsersComponent, canActivate: [AuthGuard] },
  { path: 'admin-modify-dish/:id', component: AdminModifyDishComponent, canActivate: [AuthGuard] },
  { path: 'logging', component: LoggingComponent, canActivate: [IsSignedInGuardGuard]},
  { path: 'registration', component: RegistrationComponent, canActivate: [IsSignedInGuardGuard] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
