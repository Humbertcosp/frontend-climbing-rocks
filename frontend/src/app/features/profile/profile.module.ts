import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile/profile.page';
import { ProfilePageRoutingModule } from './profile-routing.module';

import { AboutPage } from './about/about.page';
import { AccountPage } from './account-Settings/account.page';
import { ChangePasswordPage } from './change-password/change-password.page';
import { HelpPage } from './help/help.page';
import { LanguagePage } from './language/language.page';
import { PrivacyPolicyPage } from './privacy-policy/privacy-policy.page';
import { ProfileDetailsPage } from './profile-details/profile-details.page';
import { TermsPage } from './terms/terms.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ProfilePageRoutingModule, ReactiveFormsModule],
  declarations: [
    ProfilePage,
    AboutPage,
    AccountPage,
    ChangePasswordPage,
    HelpPage,
    LanguagePage,
    PrivacyPolicyPage,
    ProfileDetailsPage,
    TermsPage,
    
  ],
})
export class ProfileModule {}
