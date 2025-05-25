import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  credentials = {
    email: '',
    password: ''
  };

  registerData = {
    email: '',
    password: '',
    username: '',
    steamId: '',
    phone: '',
    country: ''
  };

  showRegisterModal = false;

  constructor(private router: Router) {}

  onLogin() {
    // TODO: Connect to authentication service
    console.log('Login attempt:', this.credentials);
    this.router.navigate(['/profile']);
  }

  openRegisterModal() {
    // Pre-fill email/password from login form
    this.registerData.email = this.credentials.email;
    this.registerData.password = this.credentials.password;
    this.showRegisterModal = true;
  }

  onRegister() {
    // TODO: Connect to registration service
    console.log('Registration data:', this.registerData);
    this.showRegisterModal = false;
    this.router.navigate(['/profile']);
  }
}