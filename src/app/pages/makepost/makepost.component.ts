import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {PostsApiService} from '../feed/posts-api.service';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-makepost',
  templateUrl: './makepost.component.html',
  styleUrls: ['./makepost.component.css']
})


export class MakepostComponent implements OnInit {
  post = {
    title: '',
    description: '',
    picture: '',
    business: '',

  };
  profileJson: string = null;



  constructor(private postsApi: PostsApiService, private router: Router,public auth: AuthService) {
  }

  ngOnInit() {
    this.auth.userProfile$.subscribe(
      profile => this.profileJson = JSON.stringify(profile, null, 2)
    );
    console.log("hello",this.profileJson);
  }
  updateTitle(event: any) {
    this.post.title = event.target.value;
  }

  updateDescription(event: any) {
    this.post.description = event.target.value;
  }

  updatePicture() {
    const files = (<HTMLInputElement>document.getElementById('file')).files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = function () {
        console.log(reader.result);
        if (typeof reader.result === "string") {
          document.getElementById('base64').innerHTML = reader.result;
        }


      };
    }
  }

  SavePost(sub: string) {

    this.post.picture = document.getElementById('base64').innerHTML;
    this.post.business=sub.replace(/\|/g, "");
    this.postsApi
      .savePost(this.post)
      .subscribe(
        () => this.router.navigate(['/feed']),
        error => alert(error.message)
      );

  }


}


function wait(ms){
  const start = new Date().getTime();
  let end = start;
  while(end < start + ms) {
    end = new Date().getTime();
  }
}
