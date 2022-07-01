import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<any> | undefined;
  confirmValidator = (control: FormControl): { [k: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.registerForm.controls.password.value) {
      return { error: true, confirm: true };
    }
    return {};
  };

  registerForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [this.confirmValidator]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private afs: AngularFirestore,
    private toastr: ToastrService
  ) {
    this.itemsCollection = afs.collection<any>('users');
  }

  ngOnInit() {}

  registerUser() {
    const data = {
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value,
    };
    this.itemsCollection?.add(data);
    this.toastr.success('User added successfully, Please Login!');
    this.router.navigateByUrl('/auth/login');
  }
}
