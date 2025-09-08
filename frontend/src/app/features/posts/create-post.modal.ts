import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, GalleryImageOptions } from '@capacitor/camera';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post.modal.html',
  styleUrls: ['./create-post.modal.scss'],
  standalone: false,
})
export class CreatePostModal {
  form: FormGroup;
  loading = false;

  // preview de la imagen seleccionada
  preview: string | null = null;

  // chips de disciplinas
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
      imageUrl: [''],           // aquí guardaremos el base64
      disciplina: ['Boulder'],
      grado: [''],
      ubicacion: [''],
    });
  }

  // ---------- UI helpers ----------
  close() { this.modalCtrl.dismiss(null, 'cancel'); }

  selectDisciplina(d: string) { this.form.patchValue({ disciplina: d }); }

  // ---------- CÁMARA / GALERÍA ----------
  async pickFromCamera() {
    try {
      const photo = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.DataUrl,
        quality: 80,
        correctOrientation: true,
      });
      this.setPreview(photo.dataUrl || null);
    } catch (e) {
      // usuario canceló
    }
  }

  async pickFromGallery() {
    try {
      // Para iOS/Android vale con Photos; en web funciona pero a veces es más fiable el input file
      const photo = await Camera.getPhoto({
        source: CameraSource.Photos,
        resultType: CameraResultType.DataUrl,
        quality: 80,
      });
      this.setPreview(photo.dataUrl || null);
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
    reader.onload = () => this.setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  private setPreview(dataUrl: string | null) {
    this.preview = dataUrl;
    this.form.patchValue({ imageUrl: dataUrl || '' });
  }

  // ---------- ENVIAR ----------
  async submit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    // payload limpio
    const payload = {
      texto: this.form.value.texto.trim(),
      imageUrl: this.form.value.imageUrl || this.preview || '',
      disciplina: this.form.value.disciplina,
      grado: (this.form.value.grado || '').trim(),
      ubicacion: (this.form.value.ubicacion || '').trim(),
    };

    this.posts.createPost(payload).subscribe({
      next: async (post) => {
        this.loading = false;
        (await this.toast.create({ message: 'Publicado ✅', duration: 1200, color: 'success' })).present();
        this.modalCtrl.dismiss(post, 'created');
      },
      error: async (err) => {
        this.loading = false;
        (await this.toast.create({ message: err?.error?.message || 'Error', duration: 1800, color: 'danger' })).present();
      }
    });
  }
}
