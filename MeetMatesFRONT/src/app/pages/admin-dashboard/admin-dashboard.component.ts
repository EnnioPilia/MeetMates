import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/users/user.service';
import { Users } from '../../core/models/users.model'; 
import { CommonModule,DatePipe  } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,DatePipe], 
  templateUrl: './admin-dashboard.component.html', 
  styleUrls: ['./admin-dashboard.component.scss']
})

export class AdminDashboardComponent implements OnInit {

  users: Users[] = [];
  loading = false;
  error: string | null = null;
  isLoading = true;

  constructor(private userService: UserService) { }

ngOnInit(): void {
  console.log('AdminDashboard init');
  this.loadUsers();
}

loadUsers(): void {
  console.log('loadUsers called');
  this.loading = true;
  this.error = null;

  this.userService.getAllUsers().subscribe({
    next: (data) => {
      console.log('Users received:', data);
      this.users = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Erreur dans subscribe:', err);
      this.error = 'Erreur lors du chargement des utilisateurs';
      this.loading = false;
    }
  });
}

deleteUser(userId: number) {
  console.log('Suppression user id:', userId);
  this.userService.deleteUser(userId).subscribe({
    next: () => {
      this.users = this.users.filter(u => u.id !== userId);
    },
    error: (err) => {
      console.error('Erreur suppression', err);
    }
  });
}

}
