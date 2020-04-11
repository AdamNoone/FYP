import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import {FeedComponent} from './pages/feed/feed.component';
import {MakepostComponent} from './pages/makepost/makepost.component';
import { PostDetailComponent }  from './components/post-detail/post-detail.component';
import { TypeofpostComponent } from './pages/typeofpost/typeofpost.component';
import {RecyclepostComponent} from "./pages/recyclepost/recyclepost.component";
import {MakeRecycledPostComponent} from "./pages/make-recycled-post/make-recycled-post.component";
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import {MypostsComponent} from "./pages/myposts/myposts.component";

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard], //used to make sure user is logged in when they click on profile component
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',

  },

  {
    path: 'feed',
    component: FeedComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard], //used to make sure user is logged in when they click on profile component
  },
  {
    path: 'makepost',
    component:  MakepostComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard], //used to make sure user is logged in when they click on profile component
  },
  {
    path: 'detail/:id',
    component: PostDetailComponent,
    canActivate: [AuthGuard], //used to make sure user is logged in when they click on profile component
  },
  {
    path: 'businesses/:business_id',
    component: PostDetailComponent,
    canActivate: [AuthGuard], //used to make sure user is logged in when they click on profile component
  },
  {
    path: 'typeofpost',
    component: TypeofpostComponent,
    canActivate: [AuthGuard], //used to make sure user is logged in when they click on profile component
  },
  {
    path: 'recyclepost',
    component: RecyclepostComponent,
    canActivate: [AuthGuard], //used to make sure user is logged in when they click on profile component
  },
  {
    path: 'recyclepost/:id',
    component: MakeRecycledPostComponent,
    canActivate: [AuthGuard], //used to make sure user is logged in when they click on profile component
  },
  {
    path: 'food/:food_group:',
    component: MakepostComponent,
    canActivate: [AuthGuard], //used to make sure user is logged in when they click on profile component
  },

  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    canActivate: [AuthGuard], //used to make sure user is logged in when they click on profile component
  },

  {
    path: 'myposts',
    component: MypostsComponent,
    canActivate: [AuthGuard], //used to make sure user is logged in when they click on profile component
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
