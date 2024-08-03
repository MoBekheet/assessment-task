import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule, NgbAlert, NgxSpinnerComponent, FaIconComponent],
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  submitted: boolean = false;
  formBuilder = inject(FormBuilder);
  spinner = inject(NgxSpinnerService);
  authService = inject(AuthService);
  router = inject(Router);

  errorMessage: string = '';
  @ViewChild('errorMessageAlert', { static: false }) errorMessageAlert?: NgbAlert;

  ngOnInit(): void {
    this.spinner.show();
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
      this.authService.login(this.form.value).subscribe(
        response => {
          this.router.navigateByUrl('/users-list');
          console.error(response);
        },
        ({ error }: HttpErrorResponse) => {
          this.errorMessage = error.error;
          setTimeout(() => {
            this.errorMessageAlert?.close();
          }, 5000);
        }
      );
    }
  }
}
