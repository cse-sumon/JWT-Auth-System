import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { fbind } from 'q';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly BaseURL = 'https://localhost:44365/api';
  constructor(private fb:FormBuilder, private http:HttpClient) { }

  formModel=this.fb.group({
    UserName:['',Validators.required],
    Email:['', Validators.email],
    FullName: [''],
    Passwords:this.fb.group({

      Password:['', [Validators.required,Validators.minLength(4)]],
      ConfirmPassword:['', Validators.required]
    },{validator : this.comparePasswords })


  });

  comparePasswords(fb:FormGroup){
    let confirmPswdCtrl = fb.get('ConfirmPassword');

    if(confirmPswdCtrl.errors==null || 'passwordMismatch' in confirmPswdCtrl.errors){
      if(fb.get('Password').value != confirmPswdCtrl.value)
      confirmPswdCtrl.setErrors({passwordMismatch: true});
      else
      confirmPswdCtrl.setErrors(null);

    }
  }

  register(){
    var body={
      UserName : this.formModel.value.UserName,
      Email : this.formModel.value.Email,
      FullName : this.formModel.value.FullName,
      Password : this.formModel.value.Passwords.Password,
    };
    return this.http.post(this.BaseURL+'/ApplicationUser/Register',body);
  }

  login(formData){
    return this.http.post(this.BaseURL+'/ApplicationUser/Login',formData);

  }

  getUserProfile(){
    return this.http.get(this.BaseURL+'/UserProfile');
  }


}
