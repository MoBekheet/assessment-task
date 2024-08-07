import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule, NgbAlert],
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  submitted: boolean = false;
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  loading = false;

  errorMessage: string = '';
  @ViewChild('errorMessageAlert', { static: false }) errorMessageAlert?: NgbAlert;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submitLogin() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      this.authService.login(this.form.value).subscribe(
        response => {
          this.router.navigateByUrl('/users-list');
        },
        ({ error }: HttpErrorResponse) => {
          this.errorMessage = error.error;
          this.loading = false;
          setTimeout(() => {
            this.errorMessageAlert?.close();
          }, 5000);
        }
      );
    }
  }
}
