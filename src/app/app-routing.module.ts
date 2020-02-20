import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import {FeedComponent} from './pages/feed/feed.component';
import {MakepostComponent} from './pages/makepost/makepost.component';
import { PostDetailComponent }  from './components/post-detail/post-detail.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },

  {
    path: 'feed',
    component: FeedComponent,
    pathMatch: 'full'
  },
  {
    path: 'makepost',
    component:  MakepostComponent,
    pathMatch: 'full'
  },
  {
    path: 'detail/:id',
    component: PostDetailComponent
  },
  {
    path: 'businesses/:business_id',
    component: PostDetailComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
