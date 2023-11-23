import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    loadChildren: () => import('./pages/signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'forgotpass',
    loadChildren: () => import('./pages/forgotpass/forgotpass.module').then( m => m.ForgotpassPageModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./pages/crud/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'update/:id',
    loadChildren: () => import('./pages/crud/update/update.module').then( m => m.UpdatePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./pages/crud/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'subcreate',
    loadChildren: () => import('./pages/subject-crud/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'sublist',
    loadChildren: () => import('./pages/subject-crud/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'subupdate/:id',
    loadChildren: () => import('./pages/subject-crud/update/update.module').then( m => m.UpdatePageModule)
  }, 
  {
    path: 'qr/:id',
    loadChildren: () => import('./pages/qr/qr.module').then( m => m.QrPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
