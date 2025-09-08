import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { FollowService } from '../../services/follow.service';
import { Post } from '../../features/models/post.model';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: false,
})
export class ExplorePage implements OnInit {
  tab: 'posts'|'people' = 'posts';
  posts: Post[] = [];
  people: any[] = [];
  loading = false;
  query = '';


  constructor(private postsSvc: PostService, private followSvc: FollowService) {}

  ngOnInit() { this.loadPosts(); }

  segmentChanged(v: any){ this.tab = v.detail.value; if (this.tab==='people' && !this.people.length) this.loadPeople(); }

  loadPosts(){
    this.loading = true;
    this.postsSvc.getPosts().subscribe({ next: r => { this.posts = r; this.loading = false; }, error: _ => this.loading=false });
  }

  loadPeople(){
    // usa tu UserService existente que lista usuarios:
    // this.userSvc.getUsers().subscribe(u => this.people = u);
    // (si no lo tienes a mano, lo dejamos como TODO)
  }

  toggleFollow(u: any) {
    const req$ = u.following ? this.followSvc.unfollow(u._id) : this.followSvc.follow(u._id);
    req$.subscribe(() => u.following = !u.following);
  }
}
