import { Component } from '@angular/core';
import { UserService } from '../../⚙️services/user.service';
import { ToastService } from '../../⚙️services/toast.service';
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from '../../shared/constants/message.constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import {
  USER_ROLES,
  USER_ROLE_OPTIONS,
} from '../../shared/constants/userRole.constants';
@Component({
  selector: 'app-user',
  standalone: true,
  providers: [ConfirmationService],
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    ReactiveFormsModule,
    CommonModule,
    TooltipModule,
    DropdownModule,
    FloatLabelModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  constructor(
    private userService: UserService,
    private confirmMessage: ConfirmationService,
    private toastService: ToastService,
  ) {}
  userList: User[] = [];
  filteredUser: User[] = [];
  loading = false;
  displayDialog = false;
  editId: string | null = null;
  searchText = '';
  role = USER_ROLE_OPTIONS;

  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    role: new FormControl('', Validators.required),
  });

  private refreshUsers(): void {
    this.resetDialog();
    this.loadUsers();
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.userList = data;
        this.filteredUser = data;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  filteredUsers(): void {
    const search = this.searchText.toLowerCase().trim();

    this.filteredUser = this.userList.filter(
      (user) =>
        user.username.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search),
    );
  }

  openDialog(): void {
    this.editId = null;

    this.userForm.reset({
      role: USER_ROLES.USER,
    });

    this.userForm
      .get('password')
      ?.setValidators([Validators.required, Validators.minLength(6)]);

    this.userForm.get('password')?.updateValueAndValidity();

    this.displayDialog = true;
  }

  closeDialog(): void {
    this.displayDialog = false;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.editId) {
      this.updateUser();
    } else {
      this.addUser();
    }
  }

  private addUser(): void {
    const userData = this.getUserData();

    this.userService.addUsers(userData).subscribe({
      next: () => {
        this.toastService.success(SUCCESS_MESSAGES.USER_CREATED);
        this.refreshUsers();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error(
          err.error?.message || ERROR_MESSAGES.USER_CREATE,
        );
      },
    });
  }

  private updateUser(): void {
    const formValue = this.userForm.value;

    const updatedUser: User = {
      _id: this.editId!,
      username: formValue.username ?? '',
      role: formValue.role ?? USER_ROLES.USER,
    };

    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        this.toastService.success(SUCCESS_MESSAGES.USER_UPDATED);
        this.refreshUsers();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error(
          err.error?.message || ERROR_MESSAGES.USER_UPDATE,
        );
      },
    });
  }

  private getUserData(): User {
    const formValue = this.userForm.value;

    return {
      username: formValue.username ?? '',
      password: formValue.password ?? '',
      role: formValue.role ?? USER_ROLES.USER,
    };
  }

  private resetDialog(): void {
    this.editId = null;
    this.displayDialog = false;
    this.userForm.reset({
      role: USER_ROLES.USER,
    });
  }

  editUser(user: User): void {
    this.editId = user._id ?? null;

    this.userForm.patchValue({
      username: user.username,
      role: user.role,
    });
    // Password isn't used during edit
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();

    this.displayDialog = true;
  }

  deleteUser(id: string): void {
    this.confirmMessage.confirm({
      header: 'Delete User',
      message: 'Are you sure you want to delete the user?',
      icon: 'pi pi-exclamation-triangle',

      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.toastService.success(SUCCESS_MESSAGES.USER_DELETED);
            this.loadUsers();
          },
          error: (err) => {
            console.error(err);

            this.toastService.error(
              err.error?.message || ERROR_MESSAGES.USER_DELETE,
            );
          },
        });
      },
    });
  }
}
