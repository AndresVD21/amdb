import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Eye, EyeOff, Mail, Lock, User, Heart } from 'lucide-angular';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@amdb/auth';

@Component({
  selector: 'lib-login',
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  showPassword = false;
  isLoading = false;

  formData = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  // Lucide icons
  eyeIcon = Eye;
  eyeOffIcon = EyeOff;
  mailIcon = Mail;
  lockIcon = Lock;
  userIcon = User;
  heartIcon = Heart;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.isLoading = true;

    if (!this.formData.valid) {
      return;
    }

    const email = this.formData.value.email as string;
    const password = this.formData.value.password as string;

    this.auth.login(email, password).subscribe({
      next: (response) => {
        this.auth.saveToken(response.accessToken);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login failed:', error);
      },
    });

    console.log('Login submitted:', this.formData.value);
  }
}
