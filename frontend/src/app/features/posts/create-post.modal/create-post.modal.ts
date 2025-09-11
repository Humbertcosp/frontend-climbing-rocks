import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post.modal.html',
  styleUrls: ['./create-post.modal.scss'],
  standalone: false,
})
export class CreatePostModal {
  form: FormGroup;
  loading = false;

  // preview
  preview: string | null = null;

  // imagen a enviar
  private imageFile: File | null = null;
  private imageDataUrl: string | null = null;

  disciplinas = ['Boulder', 'Deportiva', 'Trad', 'Mixta', 'Psicobloc'];

  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private posts: PostService,
    private modalCtrl: ModalController,
    private toast: ToastController
  ) {
    this.form = this.fb.group({
      texto: ['', [Validators.required, Validators.minLength(2)]],
      disciplina: ['Boulder'],
      grado: [''],
      ubicacion: [''],
    });
  }

  // ---------- UI ----------
  close() { this.modalCtrl.dismiss(null, 'cancel'); }
  selectDisciplina(d: string) { this.form.patchValue({ disciplina: d }); }

  // ---------- IMAGEN ----------
  async pickFromCamera() {
    try {
      const photo = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.DataUrl,
        quality: 80,
        correctOrientation: true,
      });
      this.setImage({ dataUrl: photo.dataUrl || null, file: null });
    } catch {}
  }

  async pickFromGallery() {
    try {
      const photo = await Camera.getPhoto({
        source: CameraSource.Photos,
        resultType: CameraResultType.DataUrl,
        quality: 80,
      });
      this.setImage({ dataUrl: photo.dataUrl || null, file: null });
    } catch {
      // fallback web
      this.fileInput?.nativeElement.click();
    }
  }

  pickFromFile(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.setImage({ dataUrl: reader.result as string, file });
    reader.readAsDataURL(file);
  }

  private setImage({ dataUrl, file }: { dataUrl: string | null; file: File | null }) {
    this.preview = dataUrl;
    this.imageDataUrl = dataUrl;
    this.imageFile = file;
  }

  // ---------- ENVIAR ----------
  async submit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    this.posts.createPost({
      texto: (this.form.value.texto || '').trim(),
      imageFile: this.imageFile || undefined,
      imageDataUrl: this.imageFile ? undefined : (this.imageDataUrl ?? undefined),
      disciplina: this.form.value.disciplina,
      grado: (this.form.value.grado || '').trim(),
      ubicacion: (this.form.value.ubicacion || '').trim(),
    }).subscribe({
      next: async (post) => {
        this.loading = false;
        (await this.toast.create({ message: 'Publicado ✅', duration: 1200, color: 'success' })).present();
        this.modalCtrl.dismiss(post, 'created');
      },
      error: async (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'Error creando publicación';
        (await this.toast.create({ message: msg, duration: 1800, color: 'danger' })).present();
      }
    });
  }
}
