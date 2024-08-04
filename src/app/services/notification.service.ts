import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  showError(title: string, message: string) {
    Swal.fire({
      title,
      icon: 'error',
      html: message,
    });
  }

  showSuccess(title: string, message: string) {
    Swal.fire({
      title,
      html: message,
      icon: 'success',
    });
  }

  showConfirmation(title: string, message: string): Promise<any> {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8449a8',
      confirmButtonText: 'Yes, delete it!',
    });
  }
}
