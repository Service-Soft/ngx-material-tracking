import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GdprGuard } from 'ngx-material-tracking';
import { HomeComponent } from './pages/home/home.component';
import { Page1Component } from './pages/page1/page1.component';

const routes: Routes = [
    {
        path: 'page-1',
        loadComponent: () => Page1Component,
        canActivate: [GdprGuard]
    },
    {
        path: '',
        loadComponent: () => HomeComponent,
        canActivate: [GdprGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }