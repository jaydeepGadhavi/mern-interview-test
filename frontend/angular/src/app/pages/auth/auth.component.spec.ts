import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthComponent } from './auth.component';
import { AuthService } from '../../services/auth/auth.service';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let authServiceMock: any;
  let toastrMock: any;

  beforeEach(async () => {
    authServiceMock = {
      isAuthenticated: vi.fn().mockReturnValue(false),
      login: vi.fn().mockReturnValue(of({ success: true, data: { user: { id: 1, username: 'tester' }, token: 'xyz' } })),
      register: vi.fn().mockReturnValue(of({ success: true, data: { user: { id: 1, username: 'tester' }, token: 'xyz' } })),
      saveAuth: vi.fn()
    };

    toastrMock = {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AuthComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastrService, useValue: toastrMock },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ mode: 'login' })
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
  });

  it('should create the auth component', () => {
    expect(component).toBeTruthy();
  });

  it('should call login on submit when in login mode', () => {
    component.isLogin.set(true);
    component.username.set('testuser');
    component.password.set('Password@123');

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'Password@123'
    });
    expect(authServiceMock.saveAuth).toHaveBeenCalled();
    expect(toastrMock.success).toHaveBeenCalledWith('Logged in successfully!');
  });
});
