import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth/auth.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let authServiceMock: any;
  let toastrMock: any;

  beforeEach(async () => {
    authServiceMock = {
      currentUser: signal({ id: 1, username: 'tester' }),
      isLoggedIn: signal(true),
      getUser: vi.fn().mockReturnValue({ id: 1, username: 'tester' }),
      isAuthenticated: vi.fn().mockReturnValue(true),
      logout: vi.fn()
    };

    toastrMock = {
      info: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastrService, useValue: toastrMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create the navbar component', () => {
    expect(component).toBeTruthy();
  });

  it('should return currentUser from authService', () => {
    expect(component.currentUser()?.username).toBe('tester');
  });

  it('should call authService.logout and toastr on logout', () => {
    component.onLogout();
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(toastrMock.info).toHaveBeenCalledWith('Logged out successfully');
  });
});
