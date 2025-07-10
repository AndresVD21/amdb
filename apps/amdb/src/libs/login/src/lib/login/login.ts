import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Eye, EyeOff, Mail, Lock, User, Heart } from 'lucide-angular';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@amdb/auth';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-login',
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnDestroy {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  private destroy$ = new Subject<void>();

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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

    this.auth.login(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.auth.saveToken(response.accessToken);
          localStorage.setItem('name', response.name);
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
