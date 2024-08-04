import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NgOptimizedImage, ReactiveFormsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit {
  apiService = inject(ApiService);
  modalService = inject(NgbModal);
  formBuilder = inject(FormBuilder);
  notificationService = inject(NotificationService);
  users: User[] = [];
  selectedUser: User | null = null;
  loadingView = false;
  loadingAddEdit = false;
  totalPages = 0;
  loadingUsersList = false;
  submitted = false;
  addEditForm: FormGroup = new FormGroup({});
  currentPage = 1;

  ngOnInit(): void {
    this.fetchUsers();
  }

  //#region Initialization
  initAddEditForm(): void {
    this.addEditForm = this.formBuilder.group({
      id: null,
      first_name: ['', Validators.required],
      last_name: '',
      email: '',
      avatar: '',
      job: '',
    });
  }
  //#endregion

  //#region Data Fetching
  fetchUsers(): void {
    this.loadingUsersList = true;
    this.apiService.getUsers(this.currentPage).subscribe(
      response => {
        this.users = [...this.users, ...response.data];
        this.totalPages = response.total_pages;
        this.loadingUsersList = false;
      },
      error => this.notificationService.showError('Users List', 'An error occurred in fetching users')
    );
  }

  loadMoreUsers(): void {
    this.currentPage++;
    this.fetchUsers();
  }
  //#endregion

  //#region User Actions
  ConfirmDeleteUser(userId: number): void {
    this.notificationService
      .showConfirmation('Are you sure?', "You won't be able to revert this!")
      .then(result => result.isConfirmed && this.deleteUser(userId));
  }

  deleteUser(id: number): void {
    this.apiService.deleteUser(id).subscribe(
      () => {
        this.updateUserList(id);
        this.notificationService.showSuccess('Users List', 'User deleted successfully.');
      },
      error => this.notificationService.showError('Users List', 'There was an error while deleting this user')
    );
  }

  updateUserList(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
    if (this.selectedUser?.id === id) {
      this.selectedUser = null;
    }
  }

  selectUser(id: number): void {
    if (this.selectedUser?.id !== id) {
      this.loadingView = true;
      this.selectedUser = null;
      this.apiService.getUser(id).subscribe(
        response => {
          this.loadingView = false;
          this.selectedUser = response.data;
        },
        error => {
          this.loadingView = false;
          this.notificationService.showError('Users List', 'There was an error while viewing this user');
        }
      );
    }
  }

  openModal(content: TemplateRef<NgbModalRef>, user?: User): void {
    this.initAddEditForm();
    if (user?.id) {
      this.addEditForm.patchValue(user);
    }
    this.modalService.open(content, { centered: true, size: 'md', backdrop: 'static' });
  }

  closeModel(): void {
    this.initAddEditForm();
    this.modalService.dismissAll();
  }

  updateUser(): void {
    this.submitted = true;
    if (this.addEditForm.valid) {
      this.loadingAddEdit = true;
      this.submitted = false;
      this.apiService.updateUser(this.addEditForm.value).subscribe(
        response => {
          this.loadingAddEdit = false;
          this.users = this.users.map(user => (user.id === this.addEditForm.get('id')?.value ? this.addEditForm.value : user));
          if (this.selectedUser?.id === this.addEditForm.get('id')?.value) {
            this.selectedUser = this.addEditForm.value;
          }

          this.notificationService.showSuccess('Users List', 'User updated successfully.');
          this.closeModel();
        },
        error => {
          this.loadingAddEdit = false;
          this.notificationService.showError('Users List', 'There was an error while updating this user');
        }
      );
    }
  }

  addUser(): void {
    this.submitted = true;
    if (this.addEditForm.valid) {
      this.loadingAddEdit = true;
      this.submitted = false;
      this.apiService.addUser(this.addEditForm.value).subscribe(
        response => {
          this.loadingAddEdit = false;
          if (response.id) {
            this.users.unshift({
              first_name: response.name,
              job: response.job,
              id: response.id,
              last_name: '',
              email: '',
              avatar: 'images/avatar.jpg',
            });

            this.notificationService.showSuccess('Users list', 'User added successfully.');
          }
          this.closeModel();
        },
        error => {
          this.loadingAddEdit = false;
          this.notificationService.showError('Users List', 'There was an error while adding this user');
        }
      );
    }
  }
  //#endregion
}
