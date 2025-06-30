import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Eye, EyeOff, Mail, Lock, User, Heart, UserPlus, Calendar, Shield } from 'lucide-angular';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@amdb/auth';
import { tap } from 'rxjs';

@Component({
  selector: 'lib-signup',
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  formData = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    confirmPassword: ['', [Validators.required]],
  });

  // Lucide icons
  eyeIcon = Eye;
  eyeOffIcon = EyeOff;
  mailIcon = Mail;
  lockIcon = Lock;
  userIcon = User;
  heartIcon = Heart;
  userPlusIcon = UserPlus;
  calendarIcon = Calendar;
  shieldIcon = Shield;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordStrength(): number {
    const password = this.formData.get('password')?.value;
    let strength = 0;

    if (!password) return strength;

    if (password.length >= 5) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    return strength;
  }

  getPasswordStrengthColor(index: number): string {
    const strength = this.getPasswordStrength();
    if (index < strength) {
      switch (strength) {
        case 1: return 'bg-red-500';
        case 2: return 'bg-yellow-500';
        case 3: return 'bg-blue-500';
        case 4: return 'bg-green-500';
        default: return 'bg-gray-600';
      }
    }
    return 'bg-gray-600';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 0: return 'Very weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  }

  checkConfirmPassword(): boolean {
    if (this.formData.get('password')?.value !== this.formData.get('confirmPassword')?.value) {
      this.formData.get('confirmPassword')?.setErrors({ notMatch: true });
      return true
    } else {
      this.formData.get('confirmPassword')?.setErrors(null);
      return false
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.formData.valid) {
      return;
    }

    this.isLoading = true;

    const { firstName, lastName, email, password } = this.formData.value;

    if (!firstName || !lastName || !email || !password) {
      return;
    }

    this.auth.register(firstName, lastName, email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      }
    });

    console.log('Signup submitted:', this.formData);
  }
}
