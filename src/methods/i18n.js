import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    message: {
      //LANDINGVIEW
      access: 'Access',
      register: 'Register',
      //LOGINVIEW
      login: 'Log in',
      err_login:'An error occurred during log in. Please, try again.',
      err_method:'This account is already authenticated with another method. Please use the original login method.',
      //username y password estan en profile
      username_req: 'Username is required',
      pass_req: 'Password is required',
      log_intra: 'Log in with Intra 42',
      log_google: 'Log in with Google',
      //SINGINVIEW
      sign_in: 'Sign in',
      confirm_pass: 'Confirm password',
      err_register:'An error occurred during register. Please, try again.',
      //OTPVIEW
      //DASHBOARDVIEW
      top_scorers: 'Top Scorers',
      daily_quote: 'Daily Quote',
      match_history: 'Cyber-Ñapong Match History',
      no_history: 'No match history found',
      friends: 'Friends',
      no_friends:'No friends found',
      online: 'online',
      offline: 'offline',
      //DASHBOARD-historic
      wins: ' win',
      recent_matches: 'Recent matches',
      win:'WIN',
      loss:'LOSS',
      //PROFILECARD
      score: 'Score',
      title1: 'Unlocked with ',
      title2:' points',
      updated_field:' updated successfully.',
      err_update:'Error updating ',
      err_file:'Please, select a JPG, PNG or GIF file.',
      updated_photo:'Profile photo updated successfully.',
      err_photo:'Error updating profile photo: ',
      //PROFILEVIEW
      edit_profile: 'Edit profile',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      photo: 'Profile photo',
      update: 'Update',
      select_file: 'Select file',
      no_file: 'No file selected',
      //SOCIALVIEW
      search: 'Search',
      search_user: 'Search username',
      add_friend: 'Add friend',
      rm_friend: 'Remove friend',
      search_res: 'Search results',
      friend_req_ok:'Friend request sent successfully!',
      err_friend_req:'Failed to send friend request',
      err_req_repeat:'Friend request already sent',
      //GAMESIEW
      //SETTINGSVIEW
      settings: 'Settings',
      mode: 'Mode',
      dark: 'Dark',
      light:'Light',
      language: 'Language',
      background: 'Background',
      loop: 'Loop',
      epilepsy: 'Epilepsy-friendly',
      credits1: 'All rights reserved.',
      credits_legal: 'Privacy policy and rights.',
      credits2: 'If you have any questions or need assistance, don\'t hesitate to',
      contact: 'contact us',
      credits3: 'Remember that by deleting your account, all your data and settings will be erased. This action is irreversible.',
      erase_acc: 'Delete account',
      confirm_delete:'Please confirm account deletion.',
      delete_ok:'Account deleted successfully! Ciao',
      err_delete:'A problem occurred while deleting your account. Please try again later.',
      //MONITORINGVIEW
      sys_metrics: 'System metrics',
      logs_monitor: 'Logs monitoring',
      //NOTIFICATIONS
      notifications: 'Notifications',
      no_noti:'You have not notifications',
      load_noti:'Loading notifications...',
      acc_noti:'Accept',
      rej_noti:'Reject',
    }
  },
  es: {
    message: {
       //LANDINGVIEW
       access: 'Acceder',
       register: 'Registro',
       //LOGINVIEW
       login: 'Iniciar sesión',
       err_login:'Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo.',
       err_method:'Esta cuenta ya está autenticada con otro método. Por favor, utiliza el método original de inicio de sesión.',
       
       //username y password estan en profile
       username_req: 'El nombre de usuario es obligatorio',
       pass_req: 'La contraseña es obligatoria',
       log_intra: 'Entrar con Intra 42',
       log_google: 'Entrar con Google',
       //SINGINVIEW
       sign_in: 'Registro',
       confirm_pass: 'Confirmar contraseña',
       err_register:'Se produjo un error durante el registro. Por favor, inténtalo de nuevo.',
       //OTPVIEW
       //DASHBOARDVIEW
       top_scorers: 'Top de jugadores',
       daily_quote: 'Cita del dia',
       match_history: 'Historial de Cyber-Ñapong',
       no_history:'No existe el historial de partidas',
       no_friends:'Amigos no encontrados',
       friends: 'Amigos',
       online: 'en linea',
       offline: 'desconectado',
       //DASHBOARD-historic
       wins: ' victorias',
       recent_matches: 'Partidas recientes',
       win:'VICTORIA',
       loss:'DERROTA',
       //PROFILECARD
       score: 'Puntuación',
       title1: 'Se desbloquea con ',
       title2:' puntos',
       updated_field:' actualizado con éxito.',
       err_update:'Error al actualizar ',
       err_file:'Por favor, seleccione un archivo de imagen en formato JPG, PNG o GIF.',
       updated_photo:'Foto de perfil actualizada con éxito',
       err_photo:'Error al subir la foto de perfil: ',
       //PROFILEVIEW
       edit_profile: 'Editar perfil',
       username: 'Usuario',
       email: 'Correo electrónico',
       password: 'Contraseña',
       photo: 'Foto de perfil',
       update: 'Actualizar',
       //subir foto se cambia por actualizar 
       select_file: 'Seleccionar archivo',
       no_file: 'Ningun archivo seleccionado',
       //SOCIALVIEW
       search: 'Buscar',
       search_user: 'Buscar usuario',
       add_friend: 'Añadir amigo',
       rm_friend: 'Eliminar amigo',
       search_res: 'Resultados de la búsqueda',
       friend_req_ok:'Solicitud de amistad enviada!',
       err_friend_req:'Error al enviar solicitud de amistad',
       err_req_repeat:'Peticion de amistad ya enviada',
       //GAMESIEW
       //SETTINGSVIEW
       settings: 'Configuración',
       mode: 'Modo',
       dark: 'Oscuro',
       light:'Claro',
       language: 'Idioma',
       //los idiomas se mantienen en su idioma
       background: 'Fondo',
       loop: 'Loco',
       epilepsy: 'Seguro para Epilepsia',
       credits1: 'Todos los derechos reservados.',
       credits_legal: 'Aviso legal y derechos de privacidad.',
       credits2: 'Si tienes alguna pregunta o necesitas asistencia, no dudes en',
       contact: 'contactarnos',
       credits3: 'Recuerda que al borrar tu cuenta, se eliminarán todos tus datos y configuraciones. Esta acción es irreversible.',
       erase_acc: 'Borrar cuenta',
       confirm_delete:'Por favor, confirma la eliminación de la cuenta.',
       delete_ok:'Tu cuenta ha sido borrada con éxito. Ciao',
       err_delete:'Ha ocurrido un problema al borrar tu cuenta. Prueba de nuevo más tarde.',
       //MONITORINGVIEW
       sys_metrics: 'Métricas de sistema',
       logs_monitor: 'Monitoreo de Logs',
       //NOTIFICATIONS
       notifications: 'Notificaciones',
       no_noti:'No tienes notificaciones',
      load_noti:'Cargando notificaciones...',
      acc_noti:'Aceptar',
      rej_noti:'Rechazar',
      }
  }, 
  eu: {
    message: {
    //LANDINGVIEW
    access: 'Sartu',
    register: 'Erregistratu',
    //LOGINVIEW
    login: 'Saioa hasi',
    err_login:'Errore bat gertatu da saioa hastean. Mesedez, saiatu berriro.',
    err_method:'Kontu hau dagoeneko beste metodo batekin autentifikatu da. Mesedez, erabili hasierako saio-hasteko metodoa.',
    
    //username y password estan en profile
    username_req: 'Erabiltzaile izena beharrezkoa da',
    pass_req: 'Pasahitza beharrezkoa da',
    log_intra: 'Sartu Intra 42-rekin',
    log_google: 'Sartu Google-rekin',
    //SINGINVIEW
    sign_in: 'Erregistroa',
    confirm_pass: 'Pasahitza berretsi',
    err_register:'Errore bat gertatu da erregistroan. Mesedez, saiatu berriro.',
    //OTPVIEW
    //DASHBOARDVIEW
    top_scorers: 'Jokalari onenak',
    daily_quote: 'Eguneko esaldia',
    match_history: 'Cyber-Ñapong historia',
    no_history:'Partiden historia ez dago',
    no_friends:'Lagunak ez aurkitu',
    friends: 'Lagunak',
    online: 'online',
    offline: 'deskonektatuta',
    //DASHBOARD-historic
    wins: ' garaipenak',
    recent_matches: 'Azken partidak',
    win:'GARAIPENA',
    loss:'GALERA',
    //PROFILECARD
    score: 'Puntuazioa',
    title1: 'Desblokeatzen da ',
    title2:' punturekin',
    updated_field:' arrakastaz eguneratua.',
    err_update:'Errorea eguneratzean ',
    err_file:'Mesedez, hautatu JPG, PNG edo GIF formatuan irudi fitxategi bat.',
    updated_photo:'Profil-argazkia arrakastaz eguneratua',
    err_photo:'Profil-argazkia igotzean errorea: ',
    //PROFILEVIEW
    edit_profile: 'Profila editatu',
    username: 'Erabiltzailea',
    email: 'Posta elektronikoa',
    password: 'Pasahitza',
    photo: 'Profil-argazkia',
    update: 'Eguneratu',
    //subir foto se cambia por actualizar 
    select_file: 'Fitxategia aukeratu',
    no_file: 'Ez da fitxategirik aukeratu',
    //SOCIALVIEW
    search: 'Bilatu',
    search_user: 'Erabiltzailea bilatu',
    add_friend: 'Lagun bat gehitu',
    rm_friend: 'Lagun bat ezabatu',
    search_res: 'Bilaketa-emaitzak',
    friend_req_ok:'Lagun-eskaera bidalita!',
    err_friend_req:'Errorea lagun-eskaera bidaltzean',
    err_req_repeat:'Lagun-eskaera jadanik bidalita',
    //GAMESIEW
    //SETTINGSVIEW
    settings: 'Ezarpenak',
    mode: 'Modua',
    dark: 'Iluna',
    light:'Argia',
    language: 'Hizkuntza',
    //los idiomas se mantienen en su idioma
    background: 'Atzeko planoa',
    loop: 'Bizia',
    epilepsy: 'Epilepsiarako segurua',
    credits1: 'Eskubide guztiak erreserbatuta.',
    credits_legal: 'Lege-oharra eta pribatutasun-eskubideak.',
    credits2: 'Galderarik baduzu edo laguntza behar baduzu, mesedez, ez izan zalantzarik',
    contact: 'gurekin harremanetan jartzeko',
    credits3: 'Gogoratu zure kontua ezabatzen duzunean, zure datu eta ezarpen guztiak ezabatuko direla. Ekintza hau atzeraezina da.',
    erase_acc: 'Kontua ezabatu',
    confirm_delete:'Mesedez, baieztatu kontua ezabatzea.',
    delete_ok:'Zure kontua arrakastaz ezabatua izan da. Agur',
    err_delete:'Arazo bat gertatu da zure kontua ezabatzean. Saiatu berriro beranduago.',
    //MONITORINGVIEW
    sys_metrics: 'Sistema metrikoak',
    logs_monitor: 'Log-en monitorizazioa',
    //NOTIFICATIONS
    notifications: 'Jakinarazpenak',
    no_noti:'Ez duzu jakinarazpenik',
   load_noti:'Jakinarazpenak kargatzen...',
   acc_noti:'Onartu',
   rej_noti:'Ezeztatu',
  }
},
}

const i18n = createI18n({
  legacy: false,
  locale: 'es', // establece el idioma por defecto
  fallbackLocale: 'en', // establece el idioma de respaldo
  messages,
})

export default i18n

//import { createApp } from 'vue'
//import App from './App.vue'
//import i18n from './i18n'

//const app = createApp(App)
//app.use(i18n)
//app.mount('#app')

// <template>
//   <p>{{ $t('message.hello') }}</p>
// </template>

// Cambiar el idioma dinámicamente
// this.$i18n.locale = 'en'