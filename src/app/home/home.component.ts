import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DataService } from '../data.service';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers:[DataService]
})
export class HomeComponent implements OnInit {

  message: string = '';
  constructor(private dataService: DataService, private router: Router, private cookieService: CookieService){}

  ngOnInit(): void {
      this.dataService.getMessage().subscribe((data)=>{
        this.message = data.message;
      },(err)=>{
        this.router.navigate(['/login'])
      })
  }

  logout() {
    this.cookieService.delete('refreshToken');
    this.cookieService.delete('accessToken')
    this.router.navigate(['/login']);
  }
  
}
