import { Component,OnInit  } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { SharedButtonComponent } from '../../../shared/components/shared-button/shared-button.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [SharedButtonComponent],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  message = "Activation en cours...";
  success = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.http.get<{message: string}>('http://localhost:8080/auth/verify?token=' + token)
        .subscribe({
          next: (res: any) => {
            this.message = res;
            this.success = true;
          },
          error: err => {
            this.message = "Erreur d'activation : " + err.error.message || err.message;
          }
        });
    } else {
      this.message = "Token manquant";
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}