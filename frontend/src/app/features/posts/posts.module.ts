// src/app/features/posts/posts.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CreatePostModal } from './create-post.modal';

@NgModule({
  declarations: [CreatePostModal],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  exports: [CreatePostModal],
})
export class PostsModule {}
