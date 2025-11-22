import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component')
        .then(m => m.HomeComponent),
    data: { title: 'ACCUEIL' }
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent),
    data: { title: 'CONNEXION' }
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component')
      .then(m => m.RegisterComponent),
    data: { title: 'INSCRIPTION' }
  },
  {
    path: 'verify',
    loadComponent: () => import('./features/auth/verify/verify.component')
      .then(m => m.VerifyComponent),
    data: { title: 'VALIDATION DU COMPTE' }
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/auth/reset-password/reset-password.component')
      .then(m => m.ResetPasswordComponent),
    data: { title: 'RÉINITIALISER LE MOT DE PASSE' }
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component')
      .then(m => m.ForgotPasswordComponent),
    data: { title: 'MOT DE PASSE OUBLIÉ' }
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component')
      .then(m => m.ProfileComponent),
    data: { title: 'MON PROFIL' }
  },
  {
    path: 'edit-profile',
    loadComponent: () => import('./features/edit-profile/edit-profile.component')
      .then(m => m.EditProfileComponent),
    data: { title: 'MODIFIER MON PROFIL' }
  },
  {
    path: 'edit-event/:id',
    loadComponent: () => import('./features/edit-event/edit-event.component')
      .then(m => m.EditEventComponent),
    data: { title: 'MODIFIER L’ÉVÉNEMENT' }
  },
  {
    path: 'category',
    loadComponent: () => import('./features/category-activity/category/category.component')
      .then(m => m.CategoryComponent),
    data: { title: 'CATÉGORIES' }
  },
  {
    path: 'activity',
    loadComponent: () => import('./features/category-activity/activity/activity.component')
      .then(m => m.ActivityComponent),
    data: { title: 'ACTIVITÉS' }
  },
  {
    path: 'activity/:categoryId',
    loadComponent: () => import('./features/category-activity/activity/activity.component')
      .then(m => m.ActivityComponent),
    data: { title: 'ACTIVITÉS' }
  },
  {
    path: 'post-event',
    loadComponent: () => import('./features/post-event/post-event.component')
      .then(m => m.PostEventComponent),
    data: { title: 'CRÉER UNE ACTIVITÉ' }
  },
  {
    path: 'events/:activityId',
    loadComponent: () => import('./features/event-list/event-list.component')
      .then(m => m.EventListComponent)
  },
  {
    path: 'event-participant/:eventId',
    loadComponent: () => import('./features/event-participant/event-participant.component')
      .then(m => m.EventParticipantComponent),
    data: { title: 'DÉTAILS DE L’ÉVÉNEMENT' }
  },
  {
    path: 'event-organizer/:eventId',
    loadComponent: () => import('./features/event-organizer/event-organizer.component')
      .then(m => m.EventOrganizerComponent),
    data: { title: 'ÉVÉNEMENT ORGANISATEUR' }
  },
  {
    path: 'search-events',
    loadComponent: () => import('./features/search-event/search-events.component')
      .then(m => m.SearchEventsComponent),
    data: { title: 'RECHERCHE' }
  },
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./features/admin/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    data: { title: 'ADMIN DASHBOARD' }
  },

  { path: '**', redirectTo: 'home' }
];
