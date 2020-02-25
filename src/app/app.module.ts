import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighlightModule } from 'ngx-highlightjs';
import json from 'highlight.js/lib/languages/json';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {HttpClientModule} from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeContentComponent } from './components/home-content/home-content.component';
import { LoadingComponent } from './components/loading/loading.component';
import {FeedComponent} from './pages/feed/feed.component';
import { MakepostComponent } from './pages/makepost/makepost.component';
import {PostsApiService} from './pages/feed/posts-api.service';
import {BusinessApiService} from 'src/app/pages/profile/businessdetails-api.service';
import {UserApiService} from "./pages/profile/userdetails-api.service";
import {PostDetailComponent } from './components/post-detail/post-detail.component';
import {FormsModule} from "@angular/forms";
import { TypeofpostComponent } from './pages//typeofpost/typeofpost.component';
import {FoodApiService} from "./pages/makepost/food-api.service";

export function hljsLanguages() {
  return [{ name: 'json', func: json }];
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    NavBarComponent,
    FooterComponent,
    HomeContentComponent,
    LoadingComponent,
    FeedComponent,
    MakepostComponent,
    PostDetailComponent,
    TypeofpostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    HighlightModule.forRoot({
      languages: hljsLanguages
    }),
    FontAwesomeModule,
    FormsModule
  ],
  providers: [PostsApiService, BusinessApiService, UserApiService,FoodApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
