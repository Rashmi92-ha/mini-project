import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../⚙️services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule, AvatarModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})

export class HeaderComponent {
  constructor(private authService: AuthService){}
   logout() {
    this.authService.logout(); // ✅ uses real AuthService now, was localStorage.removeItem('isLoggedIn')
  }
}
