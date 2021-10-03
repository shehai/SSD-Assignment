import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { compilePipeFromMetadata } from '@angular/compiler';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {

  title = 'imageUploader';
  images;
  url;

  constructor(private http: HttpClient, private route: ActivatedRoute,
    private router: Router,){}

  ngOnInit(){

  }
  selectImage(event){

    if (event.target.files.length>0){

      const file =event.target.files[0];
      this.images = file;
    }
  }

  onSubmit(){

    const formData = new FormData();
    formData.append('file', this.images);
    console.log(formData);

this.http.post<any>('http://localhost:5550/api/upload', formData).subscribe(
  data=>{
    console.log(data);

  },
  error=>console.log(error));



  }

}
