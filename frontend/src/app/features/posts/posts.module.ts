import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CreatePostModal } from './create-post.modal/create-post.modal';
import { EditPostModal } from './edit-post-modal/edit-post-modal';

@NgModule({
  declarations: [CreatePostModal, EditPostModal],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule],
  exports: [CreatePostModal, EditPostModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostsModule {}