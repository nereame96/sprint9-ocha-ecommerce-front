import { Component, inject, signal, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user-api';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-profile-info',
  imports: [UpperCasePipe],
  templateUrl: './profile-info.html',
  styleUrl: './profile-info.css',
})
export class ProfileInfoComponent implements OnInit {
  private usersService = inject(UsersService)
  private authService = inject(AuthService)

  profile = this.usersService.currentUserProfile
  loading = this.usersService.loading
  error = this.usersService.error


  ngOnInit(): void {
    const userId = this.authService.getUserId()

    if (userId) {
      this.usersService.loadUserProfile(userId)
    }
  }



}
