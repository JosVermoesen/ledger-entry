import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  redis: boolean;
  redisKey: string;

  constructor() { }

  ngOnInit() {
    this.redisKey = localStorage.getItem('redisNotRunning')
    if (this.redisKey) {
      this.redis = false;
    } else {
      this.redis = true;
    }
  }
}
