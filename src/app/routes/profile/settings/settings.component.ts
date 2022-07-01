import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './settings.component.html',
})
export class ProfileSettingsComponent implements OnInit {
  reactiveForm: FormGroup;
  private itemsCollection: AngularFirestoreCollection<any> | undefined;
  id: any;

  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private toastr: ToastrService
  ) {
    this.itemsCollection = afs.collection<any>('users');
    this.reactiveForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      company: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      tele: ['', [Validators.required]],
      website: [''],
      date: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.id = localStorage.getItem('uid');
    this.getLoggedinUser();
  }

  getLoggedinUser() {
    const y = this.itemsCollection?.doc(this.id).ref;
    y?.get().then(res => {
      this.reactiveForm.get('username')?.setValue(res.data().username);
      this.reactiveForm.get('address')?.setValue(res.data().Address);
      this.reactiveForm.get('email')?.setValue(res.data().email);
      this.reactiveForm.get('gender')?.setValue(res.data().Gender);
      this.reactiveForm.get('tele')?.setValue(res.data().Tele);
      this.reactiveForm.get('city')?.setValue(res.data().City);
      this.reactiveForm.get('company')?.setValue(res.data().Company);
      this.reactiveForm.get('mobile')?.setValue(res.data().Mobile);
      this.reactiveForm.get('website')?.setValue(res.data().Website);
      this.reactiveForm.get('date')?.setValue(res.data().ResgisteredDate.toDate());
    });
  }

  updateUser() {
    const data = {
      Address: this.reactiveForm.get('address')?.value,
      email: this.reactiveForm.get('email')?.value,
      username: this.reactiveForm.get('username')?.value,
      Gender: this.reactiveForm.get('gender')?.value,
      Tele: this.reactiveForm.get('tele')?.value,
      City: this.reactiveForm.get('city')?.value,
      Company: this.reactiveForm.get('company')?.value,
      Mobile: this.reactiveForm.get('mobile')?.value,
      Website: this.reactiveForm.get('website')?.value,
      ResgisteredDate: new Date(this.reactiveForm.get('date')?.value),
    };
    const y = this.itemsCollection?.doc(this.id).ref;
    y?.update(data);
    this.toastr.success('User Details updated successfully!');
    this.getLoggedinUser();
  }
  getErrorMessage(form: FormGroup) {
    return form.get('email')?.hasError('required')
      ? 'You must enter a value'
      : form.get('email')?.hasError('email')
      ? 'Not a valid email'
      : '';
  }
}
