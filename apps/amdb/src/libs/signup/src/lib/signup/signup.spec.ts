import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Signup } from './signup';
import { AuthService } from '@amdb/auth';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let authServiceMock: { register: jest.Mock };
  let routerMock: jest.Mocked<Partial<Router>>;

  beforeEach(async () => {
    authServiceMock = {
      register: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [Signup],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.formData.valid).toBeFalsy();
    });

    it('should validate required fields', () => {
      const controls = component.formData.controls;

      // Check all required fields are initially invalid
      expect(controls['firstName'].errors?.['required']).toBeTruthy();
      expect(controls['lastName'].errors?.['required']).toBeTruthy();
      expect(controls['email'].errors?.['required']).toBeTruthy();
      expect(controls['password'].errors?.['required']).toBeTruthy();
      expect(controls['confirmPassword'].errors?.['required']).toBeTruthy();
    });

    it('should validate email format', () => {
      const email = component.formData.controls['email'];

      email.setValue('invalid-email');
      expect(email.errors?.['email']).toBeTruthy();

      email.setValue('valid@email.com');
      expect(email.valid).toBeTruthy();
    });

    it('should validate password match', () => {
      const password = component.formData.controls['password'];
      const confirmPassword = component.formData.controls['confirmPassword'];

      password.setValue('password123');
      confirmPassword.setValue('password456');

      // Trigger validation
      component.formData.updateValueAndValidity();

      expect(confirmPassword.errors?.['passwordMismatch']).toBeTruthy();

      confirmPassword.setValue('password123');
      component.formData.updateValueAndValidity();
      expect(confirmPassword.errors?.['passwordMismatch']).toBeFalsy();
    });
  });

  describe('Registration Functionality', () => {
    it('should call auth service and navigate on successful registration', fakeAsync(() => {
      const testUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };

      authServiceMock.register.mockReturnValue(of({}));

      component.formData.patchValue(testUser);
      component.formData.updateValueAndValidity();

      component.onSubmit();
      tick();

      expect(authServiceMock.register).toHaveBeenCalledWith(
        testUser.firstName,
        testUser.lastName,
        testUser.email,
        testUser.password
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      expect(component.isLoading).toBeFalsy();
    }));

    it('should handle registration error', fakeAsync(() => {
      const testUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };

      authServiceMock.register.mockReturnValue(throwError(() => new Error('Registration failed')));

      component.formData.patchValue(testUser);
      component.formData.updateValueAndValidity();

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      component.onSubmit();
      tick();

      expect(authServiceMock.register).toHaveBeenCalled();
      expect(component.isLoading).toBeFalsy();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    }));
  });

  describe('Password Visibility', () => {
    it('should toggle password visibility', () => {
      expect(component.showPassword).toBeFalsy();
      expect(component.showConfirmPassword).toBeFalsy();

      component.togglePasswordVisibility();
      expect(component.showPassword).toBeTruthy();

      component.toggleConfirmPasswordVisibility();
      expect(component.showConfirmPassword).toBeTruthy();
    });
  });
});
