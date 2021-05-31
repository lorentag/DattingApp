import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { PrecenseService } from './_services/precense.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'The Dating App';

  users: any;

  constructor(private accountService: AccountService, private precense: PrecenseService){

  }

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse( localStorage.getItem("user") );
    if (user) {
      this.accountService.setCurrentUser(user);
      this.precense.createHubConnection(user);
    }
    
  }

 


}
