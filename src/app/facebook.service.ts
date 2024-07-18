import { Injectable } from '@angular/core';
import { FacebookService, InitParams, LoginOptions, LoginResponse } from 'ngx-facebook';

@Injectable({
  providedIn: 'root'
})
export class FacebookAuthService {

  constructor(private fb: FacebookService) {
    this.initFacebookService();
  }

  private initFacebookService(): void {
    const initParams: InitParams = {
      appId: '880354460777330',
      xfbml: true,
      version: 'v12.0'
    };

    this.fb.init(initParams);
  }

  login(): Promise<any> {
    const loginOptions: LoginOptions = {
      scope: 'email'
    };

    return this.fb.login(loginOptions)
      .then((response: LoginResponse) => {
        return this.fb.api('/me?fields=id,name,email');
      });
  }

  logout(): void {
    this.fb.logout().catch(err => console.error(err));
  }
}
