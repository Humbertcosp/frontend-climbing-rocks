import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { PostService } from '../../../services/post.service';
import { Post } from '../../models/post.model'; // ajusta si tu modelo está en otra ruta

@Component({
  selector: 'app-edit-post-modal',
  templateUrl: './edit-post-modal.html',
  styleUrls: ['./edit-post-modal.scss'],
  standalone: false,
})
export class EditPostModal implements OnInit {
  @Input() post!: Post;

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private posts: PostService,
    private modalCtrl: ModalController,
    private toast: ToastController
  ) {
    this.form = this.fb.group({
      texto: ['', [Validators.required, Validators.minLength(2)]],
      disciplina: [''],
      grado: [''],
      ubicacion: [''],
    });
  }

  ngOnInit(): void {
    if (this.post) {
      this.form.patchValue({
        texto: (this.post as any).texto ?? (this.post as any).caption ?? '',
        disciplina: (this.post as any).disciplina ?? '',
        grado: (this.post as any).grado ?? '',
        ubicacion: (this.post as any).ubicacion ?? '',
      });
    }
  }

  close() { this.modalCtrl.dismiss(null, 'cancel'); }

  save() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    this.posts.updatePost(this.post.id, this.form.value).subscribe({
      next: async (updated) => {
        this.loading = false;
        (await this.toast.create({ message: 'Actualizado ✅', duration: 1200, color: 'success' })).present();
        this.modalCtrl.dismiss(updated, 'updated');
      },
      error: async (err) => {
        this.loading = false;
        (await this.toast.create({ message: err?.error?.message || 'Error', duration: 1500, color: 'danger' })).present();
      },
    });
  }
}
