import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Post } from '../post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  public postsUpdated = new Subject<Post[]>();

  constructor( private http: HttpClient) { }

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
        .subscribe((postsData) =>{
          this.posts = postsData.posts;
          console.dir(postsData);
          this.postsUpdated.next([...this.posts]);
        });
  }

  getUpdatedPost(){
    return this.postsUpdated.asObservable();
  }
  addPost( title: string, content: string ){
    console.log("Called addPost from the service!");
    const post: Post = {
      id: null,
      title: title,
      content: content
    };
    this.http
      .post<{message: string}>('http://localhost:3000/api/post', post)
      .subscribe((response) => {
        console.log(response.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
