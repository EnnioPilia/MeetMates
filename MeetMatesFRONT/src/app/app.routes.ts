import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { VerifyComponent } from './features/auth/verify/verify.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ProfileComponent } from './features/profile/profile.component';
import { EditProfileComponent } from './features/edit-profile/edit-profile.component';
import { EditEventComponent } from './features/edit-event/edit-event.component';
import { HomeComponent } from './features/home/home.component';
import { CategoryComponent } from './features/category-activity/category/category.component';
import { ActivityComponent } from './features/category-activity/activity/activity.component';
import { PostEventComponent } from './features/post-event/post-event.component';
import { EventListComponent } from './features/event/event-list/event-list.component';
import { EventParticipantComponent } from './features/event/event-participant/event-participant.component';
import { EventOrganizerComponent } from './features/event/event-organizer/event-organizer.component';
import { SearchEventsComponent } from './features/search-event/search-events.component'; 

// import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent, data: { title: 'ACCUEIL' } },
  { path: 'login', component: LoginComponent, data: { title: 'CONNEXION' } },
  { path: 'register', component: RegisterComponent, data: { title: 'INSCRIPTION' } },
  { path: 'verify', component: VerifyComponent, data: { title: 'Validation du compte' } },
  { path: 'reset-password', component: ResetPasswordComponent, data: { title: 'Reinisaliser le mot de passe' } },
  { path: 'forgot-password', component: ForgotPasswordComponent, data: { title: 'Mot de passe oublié' } },
  { path: 'profile', component: ProfileComponent, data: { title: 'MON PROFIL' } },
  { path: 'edit-profile', component: EditProfileComponent, data: { title: 'MODIFIER MON PROFIL' } },
  { path: 'edit-event/:id', component: EditEventComponent, data: { title: 'MODIFIER L\'ÉVÉNEMENT' } },
  { path: 'category', component: CategoryComponent, data: { title: 'CATEGORIES' } },
  { path: 'activity', component: ActivityComponent, data: { title: 'ACTIVITEES' } },
  { path: 'activity/:categoryId', component: ActivityComponent, data: { title: 'ACTIVITES' } },
  { path: 'post-event', component: PostEventComponent, data: { title: 'CRÉER UNE ACTIVITÉ' } },
  { path: 'events/:activityId', component: EventListComponent, data: { title: '' } },
  { path: 'event-details/:id', component: EventParticipantComponent, data: { title: 'DETAILS DE l\'ÉVÉNEMENT' } },
  { path: 'event-organizer/:eventId', component: EventOrganizerComponent, data: { title: 'ÉVÉNEMENT ORGANISATEUR' } },
  { path: 'search-events', component: SearchEventsComponent, data: { title: 'RECHERCHE' } },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
