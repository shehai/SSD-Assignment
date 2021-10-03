import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { compilePipeFromMetadata } from '@angular/compiler';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  url;

  constructor(private http: HttpClient, private route: ActivatedRoute,
    private router: Router,){}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:5550/').subscribe(
      data=>{
        console.log(data);

        this.url = data;
        
      },
      error=>console.log(error));
  }

}
