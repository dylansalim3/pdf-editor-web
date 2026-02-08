import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';

interface ProtectOptions {
  userPassword: string;
  ownerPassword: string;
  allowPrinting: boolean;
  allowCopying: boolean;
  allowEditing: boolean;
  allowAnnotating: boolean;
  encryptionLevel: '128' | '256';
}

@Component({
  selector: 'app-protect',
  templateUrl: './protect.component.html',
  styleUrls: ['./protect.component.css']
})
export class ProtectComponent {
  fileList: NzUploadFile[] = [];
  protecting = false;
  protected = false;
  showPassword = false;

  options: ProtectOptions = {
    userPassword: '',
    ownerPassword: '',
    allowPrinting: true,
    allowCopying: false,
    allowEditing: false,
    allowAnnotating: false,
    encryptionLevel: '256'
  };

  passwordStrength = 0;
  passwordStrengthText = '';
  passwordStrengthColor = 'red';

  beforeUpload = (file: NzUploadFile): boolean => {
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    if (!isPdf) {
      return false;
    }

    this.fileList = [file];
    return false;
  }

  checkPasswordStrength(): void {
    const password = this.options.userPassword;
    let strength = 0;

    if (password.length >= 8) {
      strength += 25;
    }
    if (password.match(/[a-z]/)) {
      strength += 25;
    }
    if (password.match(/[A-Z]/)) {
      strength += 25;
    }
    if (password.match(/[0-9!@#$%^&*]/)) {
      strength += 25;
    }

    this.passwordStrength = strength;

    if (strength <= 25) {
      this.passwordStrengthText = 'Weak';
      this.passwordStrengthColor = 'red';
    } else if (strength <= 50) {
      this.passwordStrengthText = 'Fair';
      this.passwordStrengthColor = 'orange';
    } else if (strength <= 75) {
      this.passwordStrengthText = 'Good';
      this.passwordStrengthColor = 'yellow';
    } else {
      this.passwordStrengthText = 'Strong';
      this.passwordStrengthColor = 'green';
    }
  }

  onProtect(): void {
    if (this.fileList.length === 0) {
      return;
    }
    if (!this.options.userPassword) {
      alert('Please enter a password');
      return;
    }

    this.protecting = true;

    setTimeout(() => {
      this.protecting = false;
      this.protected = true;
    }, 2000);
  }

  onDownload(): void {
    const link = document.createElement('a');
    link.href = '#';
    link.download = this.fileList[0].name.replace('.pdf', '-protected.pdf');
    link.click();
  }

  onReset(): void {
    this.fileList = [];
    this.protected = false;
    this.options.userPassword = '';
    this.options.ownerPassword = '';
    this.passwordStrength = 0;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
