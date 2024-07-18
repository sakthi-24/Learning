import { Component, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FacebookAuthService } from '../facebook.service';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [DataService]
})
export class LoginComponent implements OnDestroy {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  lockoutTime: number = 0;
  timerSubscription: Subscription | null = null;

  constructor(
    private dataService: DataService, 
    private router: Router, 
    private facebookService: FacebookAuthService,
  ) { }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  onLogin() {
    if (this.lockoutTime > 0) {
      return;
    }
    
    this.dataService.login({ email: this.email, password: this.password }).subscribe(
      (res) => {
        this.router.navigate(['/']);
      },
      (err) => {
        if (err.error && err.error.error) {
          this.errorMessage = err.error.error;
          const match = this.errorMessage.match(/try again after (\d+) seconds/i);
          if (match) {
            this.lockoutTime = parseInt(match[1], 10);
            this.startTimer();
          }
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    );
  }

  startTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.lockoutTime > 0) {
        this.lockoutTime -= 1;
      } else {
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
        }
      }
    });
  }

  loginWithFacebook(): void {
    this.facebookService.login().then((userInfo: any) => {
      this.dataService.login({ ...userInfo, isFacebookLogin: true }).subscribe(
        (res) => {
          this.router.navigate(['/']);
        },
        (err) => console.error(err)
      );
      console.log('Logged in with Facebook!', userInfo);
    }).catch((error: any) => {
      console.error('Error logging in with Facebook', error);
    });
  }
}
