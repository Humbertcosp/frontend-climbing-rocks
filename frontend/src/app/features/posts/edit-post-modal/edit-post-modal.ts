// src/app/features/posts/edit-post-modal/edit-post-modal.ts
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Post } from '../../models/post.model';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-edit-post-modal',
  templateUrl: './edit-post-modal.html',
  styleUrls: ['./edit-post-modal.scss'],
  standalone: false,
})
export class EditPostModal {
  @Input() post!: Post;

  form: FormGroup;
  loading = false;

  // imagen (opcional)
  preview: string | null = null;
  imageFile: File | null = null;
  removeImage = false;

  constructor(
    fb: FormBuilder,
    private posts: PostService,
    private modalCtrl: ModalController,
    private toast: ToastController
  ) {
    this.form = fb.group({
      texto: ['', [Validators.required, Validators.minLength(2)]],
      disciplina: [''],
      grado: [''],
      ubicacion: [''],
    });
  }

  ngOnInit() {
    this.form.patchValue({
      texto: this.post.caption || '',
      disciplina: (this.post as any).disciplina || '',
      grado: (this.post as any).grado || '',
      ubicacion: (this.post as any).ubicacion || '',
    });
    this.preview = this.post.imageUrl || null;
  }

  close() { this.modalCtrl.dismiss(null, 'cancel'); }

  onFileChange(evt: Event) {
    const f = (evt.target as HTMLInputElement).files?.[0];
    if (!f) return;
    this.imageFile = f;
    const reader = new FileReader();
    reader.onload = () => this.preview = reader.result as string;
    reader.readAsDataURL(f);
    this.removeImage = false;
  }

  clearImage() {
    this.preview = null;
    this.imageFile = null;
    this.removeImage = true;
  }

  async save() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    this.posts.updatePost(this.post.id, {
      texto: this.form.value.texto,
      disciplina: this.form.value.disciplina,
      grado: this.form.value.grado,
      ubicacion: this.form.value.ubicacion,
      imageFile: this.imageFile || undefined,
      removeImage: this.removeImage,
    })
    .subscribe({
      next: async (updated) => {
        this.loading = false;
        (await this.toast.create({ message: 'Guardado', duration: 1000 })).present();
        this.modalCtrl.dismiss(updated, 'updated');
      },
      error: async (err) => {
        this.loading = false;
        (await this.toast.create({ message: err?.error?.message || 'Error al guardar', duration: 1600, color: 'danger' })).present();
      }
    });
  }
}
