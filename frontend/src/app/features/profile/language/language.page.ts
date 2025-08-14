import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
interface LangOption { code: string; label: string; }

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
  standalone: false
})
export class LanguagePage implements OnInit {

  options: LangOption[] = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'cat', label: 'Català' },
   
  ];
  selected = 'es';

  constructor(private settings: SettingsService) {}

  async ngOnInit() {
    const current = await this.settings.getLanguage();
    const opt = this.options.find(o => o.label === current);
    this.selected = opt ? opt.code : this.options[0].code;
  }

  async onChange(event: any) {
    this.selected = event.detail.value;
    const label = this.options.find(o => o.code === this.selected)!.label;
    await this.settings.setLanguage(label);

    
    
  }
}
