import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighlightModule } from 'ngx-highlightjs';
import json from 'highlight.js/lib/languages/json';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
//import { MatDialogModule } from '@angular/material/dialog';




import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeContentComponent } from './components/home-content/home-content.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ModalComponent as ModalComponent } from './components/modal/modal.component';
import {FeedComponent} from './pages/feed/feed.component';
import { MakepostComponent } from './pages/makepost/makepost.component';
import {PostsApiService} from './pages/feed/posts-api.service';
import {BusinessApiService} from 'src/app/pages/profile/businessdetails-api.service';
import {UserApiService} from "./pages/profile/userdetails-api.service";
import {PostDetailComponent } from './components/post-detail/post-detail.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TypeofpostComponent } from './pages/typeofpost/typeofpost.component';
import {FoodApiService} from "./pages/makepost/food-api.service";
import { GaugeChartModule } from 'angular-gauge-chart';
import { RecyclepostComponent } from './pages/recyclepost/recyclepost.component';
import { MakeRecycledPostComponent } from './pages/make-recycled-post/make-recycled-post.component'
import {RecyclepostApiService} from "./pages/make-recycled-post/recyclepost-api.service";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';



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
    RecyclepostComponent,
    MakeRecycledPostComponent,
    ModalComponent,
    LeaderboardComponent,
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
    FormsModule,
    GaugeChartModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
  ],
  providers: [PostsApiService, BusinessApiService, UserApiService,FoodApiService,RecyclepostApiService],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})
export class AppModule { }
