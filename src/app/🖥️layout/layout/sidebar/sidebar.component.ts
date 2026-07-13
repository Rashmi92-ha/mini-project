import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { APP_ROUTES } from '../../../shared/constants/routes.constants';
import { AuthService } from '../../../⚙️services/auth.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [PanelMenuModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  constructor(private authServices: AuthService) {}
  items: MenuItem[] = [];

  ngOnInit(): void {
    const isAdmin =
      this.authServices.isAdmin();
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: APP_ROUTES.DASHBOARD,
      },
      {
        label: 'Employees',
        icon: 'pi pi-users',
        routerLink: APP_ROUTES.EMPLOYEES,
      },
    ];
    if (isAdmin) {
      this.items.push({
        label: 'Users',
        icon: 'pi pi-user',
        routerLink: APP_ROUTES.USERS,
      });
    }
    this.items.push(
      {
        label: 'Departments',
        icon: 'pi pi-building',
        routerLink: APP_ROUTES.DEPARTMENTS,
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        routerLink: APP_ROUTES.SETTINGS,
      },
    );
  }
}
