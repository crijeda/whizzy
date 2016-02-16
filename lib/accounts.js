AccountsTemplates.configure({
  showForgotPasswordLink: true
});

AccountsTemplates.configureRoute('resetPwd', {
  name: 'reset-password',
  path: 'reset-password',
  layoutTemplate: 'resetPasswordLayout'
});

if (Meteor.isServer) {
  Accounts.emailTemplates.siteName = 'Whizzy';
  Accounts.emailTemplates.from = "Whizzy <bils@lopezjullian.com>";

  Accounts.emailTemplates.resetPassword.subject = function() {
    return 'Recuperar contraseña';
  }
  Accounts.emailTemplates.resetPassword.text = function(user, url) {
    var name = user && user.profile && user.profile.name
    return 'Hola, ' + name + '\n\nPara recuperar tu contraseña, haz click en el siguente link.\n\n' + url + '\n\nGracias.\n'
  }
}
