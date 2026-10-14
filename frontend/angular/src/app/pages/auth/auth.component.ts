import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  isLogin = signal<boolean>(true);
  username = signal<string>('');
  password = signal<string>('');
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return;
    }

    this.route.data.subscribe(data => {
      this.isLogin.set(data['mode'] !== 'register');
      this.errorMessage.set(null);
    });
  }

  onSubmit(): void {
    const u = this.username().trim();
    const p = this.password();
    if (!u || !p) return;

    this.errorMessage.set(null);

    const credentials = { username: u, password: p };
    const req$ = this.isLogin()
      ? this.authService.login(credentials)
      : this.authService.register(credentials);

    req$.subscribe({
      next: (res) => {
        if (res?.data) {
          this.authService.saveAuth(res.data);
          this.toastr.success(this.isLogin() ? 'Logged in successfully!' : 'Account created successfully!');
          this.router.navigate(['/']);
        }
      },
      error: (err: any) => {
        const message = typeof err === 'string' ? err : (err?.message || 'Authentication failed');
        this.errorMessage.set(message);
        this.toastr.error(message);
      }
    });
  }
}
