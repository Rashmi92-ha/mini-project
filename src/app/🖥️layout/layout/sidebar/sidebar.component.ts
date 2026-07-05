import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [PanelMenuModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard',
    },
    {
      label: 'Employees',
      icon: 'pi pi-users',
      routerLink: '/employee',
    },
    {
      label: 'Users',
      icon: 'pi pi-user',
      routerLink: '/users',
    },
    {
      label: 'Departments',
      icon: 'pi pi-building',
      routerLink: '/departments',
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      routerLink: '/settings',
    },
  ];
}
