import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilePage } from './profile/profile.page';
import { AboutPage } from './about/about.page';
import { AccountPage } from './account-Settings/account.page';
import { ChangePasswordPage } from './change-password/change-password.page';
import { HelpPage } from './help/help.page';
import { LanguagePage } from './language/language.page';
import { PrivacyPolicyPage } from './privacy-policy/privacy-policy.page';
import { ProfileDetailsPage } from './profile-details/profile-details.page';
import { TermsPage } from './terms/terms.page';


const routes: Routes = [
  
    {path: '', component: ProfilePage}, 
  
  
  {
    path: 'profile',
    component: ProfilePage
  },
  {
    path: 'about',
    component: AboutPage
  },
    {
    path: 'account',
    component: AccountPage
  },
  {
    path: 'change-password',
    component: ChangePasswordPage
  },
  {
    path: 'help',
    component: HelpPage
  },
  {
    path: 'language',
    component: LanguagePage
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyPage
  },
    {
    path: 'profile-details',
    component: ProfileDetailsPage
  },
  {
    path: 'terms',
    component: TermsPage
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
