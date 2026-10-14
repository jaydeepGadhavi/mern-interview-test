import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  currentUser = this.authService.currentUser;
  isLoggedIn = this.authService.isLoggedIn;

  onLogout(): void {
    this.authService.logout();
    this.toastr.info('Logged out successfully');
  }
}

