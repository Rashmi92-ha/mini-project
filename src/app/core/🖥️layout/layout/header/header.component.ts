import { Component, inject } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../⚙️services/auth.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-header',
  standalone: true,
  providers: [ConfirmationService],
  imports: [MenubarModule, AvatarModule, ButtonModule, ConfirmDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private confirmationSevice = inject(ConfirmationService);
  private authService = inject(AuthService);

  confirmLogout(): void {
    this.confirmationSevice.confirm({
      key: 'logoutConfirm',
      header: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Logout',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.authService.logout();
      },
    });
  }
}
