import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '@amdb/auth';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

type MockAuthService = {
  login: jest.Mock;
  saveToken: jest.Mock;
};

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: jest.Mocked<MockAuthService>;
  let routerMock: jest.Mocked<Partial<Router>>;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
      saveToken: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [Login],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
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

    it('should validate email format', () => {
      const email = component.formData.controls['email'];
      email.setValue('invalid-email');
      expect(email.valid).toBeFalsy();

      email.setValue('valid@email.com');
      expect(email.valid).toBeTruthy();
    });

    it('should require password', () => {
      const password = component.formData.controls['password'];
      expect(password.valid).toBeFalsy();
      expect(password.errors?.['required']).toBeTruthy();

      password.setValue('password123');
      expect(password.valid).toBeTruthy();
    });
  });

  describe('Login Functionality', () => {
    it('should call auth service and navigate on successful login', fakeAsync(() => {
      const testEmail = 'test@example.com';
      const testPassword = 'password123';
      const mockResponse = { accessToken: 'token123', name: 'Test User' };

      authServiceMock.login.mockReturnValue(of(mockResponse));

      component.formData.patchValue({
        email: testEmail,
        password: testPassword,
      });

      component.onSubmit();
      tick();

      expect(authServiceMock.login).toHaveBeenCalledWith(testEmail, testPassword);
      expect(authServiceMock.saveToken).toHaveBeenCalledWith(mockResponse.accessToken);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      expect(component.isLoading).toBeFalsy();
    }));

    it('should handle login error', fakeAsync(() => {
      const testEmail = 'test@example.com';
      const testPassword = 'password123';

      authServiceMock.login.mockReturnValue(throwError(() => new Error('Login failed')));

      component.formData.patchValue({
        email: testEmail,
        password: testPassword,
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      component.onSubmit();
      tick();

      expect(authServiceMock.login).toHaveBeenCalledWith(testEmail, testPassword);
      expect(component.isLoading).toBeFalsy();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    }));
  });

  describe('Password Visibility', () => {
    it('should toggle password visibility', () => {
      expect(component.showPassword).toBeFalsy();

      component.togglePasswordVisibility();
      expect(component.showPassword).toBeTruthy();

      component.togglePasswordVisibility();
      expect(component.showPassword).toBeFalsy();
    });
  });
});
