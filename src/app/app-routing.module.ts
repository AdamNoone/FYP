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
    //canActivate: [AuthGuard]
  },
  {
    path: 'makepost',
    component:  MakepostComponent,
    pathMatch: 'full',
    //canActivate: [AuthGuard]
  },
  {
    path: 'detail/:id',
    component: PostDetailComponent
  },
  {
    path: 'businesses/:business_id',
    component: PostDetailComponent
  },
  {
    path: 'typeofpost',
    component: TypeofpostComponent
  },
  {
    path: 'recyclepost',
    component: RecyclepostComponent
  },
  {
    path: 'food/:food_group:',
    component: MakepostComponent,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
