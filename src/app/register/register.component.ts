import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FacebookAuthService } from '../facebook.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,HttpClientModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [DataService]
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private dataService: DataService,
    private router: Router,
    private facebookService: FacebookAuthService) { }

  register() {
    this.dataService.register({ username: this.username,email: this.email, password: this.password }).subscribe(
      res => {
        this.router.navigate(['/otp'], { queryParams: { email: this.email } });
      },
      err => console.error(err)
    );
  }

  loginWithFacebook(): void {
    this.facebookService.login().then((userInfo: any) => {
      this.dataService.register( {...userInfo, isFacebookLogin: true } ).subscribe(
        res =>{
          this.router.navigate(['/login']);
        },
        err => console.error(err)
      );
      console.log('Logged in with Facebook!', userInfo);
    }).catch((error: any) => {
      console.error('Error logging in with Facebook', error);
    });
  }
}
