import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../../../core/⚙️services/toast.service';
import { DepartmentService } from '../../../../core/⚙️services/department.service';
import { AuthService } from '../../../../core/⚙️services/auth.service';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../../../../shared/constants/message.constants';
import { Department } from '../../models/department.model';

type DepartmentPayload = Pick<Department, 'name' | 'description'>;

/** Rejects values that are empty or only whitespace. */
export const notBlank: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null =>
  String(control.value ?? '').trim() ? null : { blank: true };

@Component({
  selector: 'app-department',
  standalone: true,
  providers: [ConfirmationService],
  imports: [
    CommonModule,
    FormsModule, // remove if the template has no ngModel (e.g. searchText)
    ReactiveFormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    DialogModule,
    ToastModule, // remove if <p-toast> already lives in AppComponent
    ConfirmDialogModule,
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
})
export class DepartmentComponent implements OnInit {
  searchText = '';
  departments: Department[] = [];

  loading = false;
  saving = false;

  showDepartmentDialog = false;
  selectedDepartmentId: string | null = null;

  showViewDialog = false;
  selectedDepartment: Department | null = null;

  private readonly formBuilder = inject(FormBuilder);
  private readonly departmentService = inject(DepartmentService);
  private readonly toastService = inject(ToastService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly authService = inject(AuthService);

  departmentForm = this.formBuilder.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        notBlank,
        Validators.minLength(2),
        Validators.maxLength(100),
      ],
    ],
    description: ['', [Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.loadDepartments();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  /** Derived from selectedDepartmentId so the two can never get out of sync. */
  get isEditMode(): boolean {
    return this.selectedDepartmentId !== null;
  }

  // ---------- Load ----------

  loadDepartments(): void {
    this.loading = true;

    this.departmentService
      .getDepartments()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (departments) => (this.departments = departments),
        error: (error: HttpErrorResponse) =>
          this.showError(error, ERROR_MESSAGES.LOAD_DEPARTMENTS),
      });
  }

  // ---------- Add / Edit dialog ----------

  openAddDepartmentDialog(): void {
    if (!this.isAdmin) return;

    this.selectedDepartmentId = null;
    this.departmentForm.reset();
    this.showDepartmentDialog = true;
  }

  openEditDepartmentDialog(department: Department): void {
    if (!this.isAdmin) return;

    this.selectedDepartmentId = department._id;
    this.departmentForm.reset({
      name: department.name,
      description: department.description ?? '',
    });
    this.showDepartmentDialog = true;
  }

  /**
   * Bind to (onHide) on the dialog so it also runs for the X button and ESC:
   * <p-dialog [(visible)]="showDepartmentDialog" (onHide)="closeDepartmentDialog()">
   */
  closeDepartmentDialog(): void {
    this.showDepartmentDialog = false;
    this.selectedDepartmentId = null;
    this.departmentForm.reset();
  }

  saveDepartment(): void {
    if (!this.isAdmin || this.saving) return;

    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const { name, description } = this.departmentForm.getRawValue();
    const payload: DepartmentPayload = {
      name: name.trim(),
      description: description.trim(),
    };

    const id = this.selectedDepartmentId;

    const request$ = id
      ? this.departmentService.updateDepartment(id, payload)
      : this.departmentService.createDepartment(payload);

    const successMessage = id
      ? SUCCESS_MESSAGES.DEPARTMENT_UPADATE
      : SUCCESS_MESSAGES.DEPARMENT_CREATED;

    const fallbackError = id
      ? ERROR_MESSAGES.DEPARTMENT_UPDATE
      : ERROR_MESSAGES.DEPARTMENT_CREATE;

    this.saving = true;

    request$.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.toastService.success(successMessage);
        this.closeDepartmentDialog();
        this.loadDepartments();
      },
      error: (error: HttpErrorResponse) => this.showError(error, fallbackError),
    });
  }

  // ---------- Delete ----------

  deleteDepartment(department: Department): void {
    if (!this.isAdmin) return;

    this.confirmationService.confirm({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete the department "${department.name}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.departmentService.deleteDepartment(department._id).subscribe({
          next: () => {
            this.toastService.success(SUCCESS_MESSAGES.DEPARTMENT_DELETE);
            this.loadDepartments();
          },
          error: (error: HttpErrorResponse) =>
            this.showError(error, ERROR_MESSAGES.DEPARTMENT_DELETE),
        });
      },
    });
  }

  // ---------- View dialog ----------

  viewDepartment(department: Department): void {
    this.selectedDepartment = department;
    this.showViewDialog = true;
  }

  /** Bind to (onHide) on the view dialog as well. */
  closeViewDialog(): void {
    this.showViewDialog = false;
    this.selectedDepartment = null;
  }

  // ---------- Helpers ----------

  private showError(error: HttpErrorResponse, fallback: string): void {
    this.toastService.error(error.error?.message || fallback);
  }
}
