// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { EMPTY } from 'rxjs';
// import { NotificationService } from '../services/notification/notification.service';

// let locked = false;
// const BLOCK_TIME_MS = 2000; // 2 seconde

// export const antiSpamInterceptor: HttpInterceptorFn = (req, next) => {
//   const notification = inject(NotificationService);

//   if (locked) {
//     notification.showWarning('Veuillez patienter…');
//     return EMPTY;
//   }

//   locked = true;

//   setTimeout(() => {
//     locked = false;
//   }, BLOCK_TIME_MS);

//   return next(req);
// };
