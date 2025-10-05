import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { VerifyComponent } from './features/auth/verify/verify.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ProfileComponent } from './features/profile/profile.component';
import { HomeComponent } from './features/home/home.component';
import { CategoryComponent } from './features/event/category/category.component';
import { ActivityComponent } from './features/event/activity/activity.component';
import { PostEventComponent } from './features/post-event/post-event.component';

// import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'activity', component: ActivityComponent },
  { path: 'activity/:categoryId', component: ActivityComponent },
  { path: 'post-event', component: PostEventComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
