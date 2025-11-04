<template>
    <div class="flex min-h-screen bg-gray-800 overflow-hidden" :class="{ 'LightMode': isLightMode }">
        <SideBar/>
        <div class="main-content flex-grow relative">
                <BackgroundVideo  />
            <div class="content-overlay" >
                <h2 class="cybertitle">{{ t('message.edit_profile') }}</h2>
                <div class="profile-form">
                    <div class="attribute-container" >
                        <label for="name" class="input-label">{{ t('message.username') }}</label>
                        <div class="w-full flex justify-center items-center">
                            <input v-model="name" type="text" id="name" name="name" class="input">
                            <button @click="updateField('name')" class="button">
                                {{ t('message.update') }}
                            </button>
                        </div>
                    </div>

                    <div class="attribute-container">
                        <label for="email" class="input-label">{{ t('message.email') }}</label>
                        <div class="w-full flex justify-center items-center">
                            <input v-model="email" type="email" id="email" name="email" class="input">
                            <button @click="updateField('email')" class="button">
                                {{ t('message.update') }}
                            </button>
                        </div>
                    </div>

                    <div class="attribute-container">
                        <label for="password" class="input-label">{{ t('message.password') }}</label>
                        <div class="w-full flex justify-center items-center">
                            <input v-model="password" type="password" id="password" name="password" class="input">
                            <button @click="updateField('password')" class="button">
                                {{ t('message.update') }}
                            </button>
                        </div>
                    </div>

                    <div class="attribute-container">
                        <label for="photo" class="input-label">{{ t('message.photo') }}</label>
                        <div class="w-full flex justify-center items-center">
            
                            <input type="file" id="photo" ref="photoInput"  @change="handleFileChange" class="input custom-file-input" accept=".jpg,.jpeg,.png,.gif">
                            <button @click="uploadPhoto" class="button">
                                {{ t('message.update') }}
                            </button>
                        </div>
                        <label for="photo" class="button select-file-button">
                            {{ t('message.select_file') }}
                        </label>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SideBar from '@/components/SideBar';
import BackgroundVideo from '@/components/BackgroundVideo';
import axiosInstance from '../methods/axiosService';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n'; 
import { useRouter } from 'vue-router'; 

export default {
    name: 'ProfileView',
    components: {
        SideBar,
        BackgroundVideo,
    },
    setup() {
        const isLightMode = ref(false);
        const epilepsyMode = ref(false);
        const { t, locale } = useI18n();
        const selectedFileName = ref(t('message.no_file'));
        const router = useRouter(); 

        const loadSettingsFromCache = () => {
            isLightMode.value = localStorage.getItem('Mode') === '1';
            epilepsyMode.value = localStorage.getItem('Epilepsy') === '1';
            locale.value = localStorage.getItem('Language') || 'en';
        };
           const checkTokenPreVideo = () => {
            const token = localStorage.getItem('authToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!token || !refreshToken) {
                console.log('No hay tokens disponibles, redirigiendo...');
                return 1;
            }else {
                return 0;
            }
    };

        onMounted(() => {
            loadSettingsFromCache();

            const check = checkTokenPreVideo();// Verifica nuevamente si los tokens están presentes
            //console.log("CHECK = ", check)
            if (check === 1)
            {
                router.push('/login'); 
                return;
            }
            const video = document.querySelector('.background-video');
            if (video) {
                if (epilepsyMode.value) {
                    video.pause();
                } else {
                    video.play();
                }
            }
        });

        

        return {
            isLightMode,
            loadSettingsFromCache,
            t,
            selectedFileName,
        };
    },
    data() {
        return {
            name: '',
            email: '',
            password: '',
            selectedFile: null,
            allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
        }
    },
    methods: {
        async updateField(field) {
            //console.log(`Actualizando ${field}: ${this[field]}`);
            
            try {
                let response;
                const baseURL = 'https://trascendence.tech:4242/api';
                switch(field) {
                    case 'name':
                        if (this.name.length > 15) {
                            alert('Tu nombre de usuario es demasiado largo'); 
                            return false;
                        }
                        response = await axiosInstance.post(`${baseURL}/update_username`, {
                            new_username: this.name
                        });
                        break;
                    case 'email':
                        if (!/[@]/.test(this.email)) {
                            alert('Este email no es valido'); 
                            return false;
                        }
                        if (!/[.]/.test(this.email)) {
                            alert('Este email no es valido'); 
                            return false;
                        }
                        response = await axiosInstance.post(`${baseURL}/update_email`, {
                            new_email: this.email
                        });
                        break;
                    case 'password':
                        if (!this.password) {
                            alert('La contraseña es obligatoria');
                            return false;
                        }
                        if (this.password.length < 8) {
                            alert('La contraseña debe tener al menos 8 caracteres'); 
                            return false;
                        }
                        if (this.password.length > 32) {
                            alert('La contraseña no debe exceder los 32 caracteres'); 
                            return false;
                        }
                        if (!/[0-9]/.test(this.password)) {
                            alert('La contraseña debe contener al menos un número'); 
                            return false;
                        }
                        if (!/[A-Z]/.test(this.password)) {
                            alert('La contraseña debe contener al menos una letra mayúscula'); 
                            return false;
                        }
                        if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) {
                            alert('La contraseña debe contener al menos un símbolo'); 
                            return false;
                        }
                        if (this.username && this.password.includes(this.username)) {
                            alert('La contraseña no puede contener el nombre de usuario'); 
                            return false;
                        }
                        response = await axiosInstance.post(`${baseURL}/update_password`, {
                            new_password: this.password
                        });
                        response;
                        break;
                    default:
                        console.log('Campo no reconocido');
                        return;
                }
                //console.log(response);
                alert(`${field} ${this.t('message.updated_field')}`);
            } catch (error) {
                //console.log('Error al actualizar el campo:', error);
                alert(`${this.t('message.err_update')} ${field}: ${error.response?.data?.message || error.message}`);
            }
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                if (!this.allowedFileTypes.includes(file.type)) {
                    alert(this.t('message.err_file'));
                    this.$refs.photoInput.value = '';
                    return;
                }
                this.selectedFile = file;
                this.selectedFileName = file.name;
            } else {
                this.selectedFileName = this.t('message.no_file');
            }
        },
        async uploadPhoto() {
            if (!this.selectedFile) {
                alert(this.t('message.err_file'));
                return;
            }

            const formData = new FormData();
            formData.append('file', this.selectedFile);

            try {
                const response = await axiosInstance.post('https://trascendence.tech:4242/api/upload_profile_photo', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                response;
                //console.log('Respuesta del servidor:', response.data);
                localStorage.removeItem('profilePhotoData');
                localStorage.removeItem('profilePhotoTimestamp');
                alert(this.t('message.updated_photo'));
            } catch (error) {
                console.log('Error al subir la foto de perfil:', error);
                alert(`${this.t('message.err_photo')} ${error.response?.data?.message || error.message}`);
            }
        }
    },
    async mounted() {
        try {
            const response = await axiosInstance.post('https://trascendence.tech:4242/api/user_profile');
            const userData = response.data;
            this.name = userData.username;
            this.email = userData.email;
        } catch (error) {
            console.log('Error al cargar los datos del usuario:', error);
        }
    }
}
</script>

<style scoped>
.main-content {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: auto;
}

.video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.background-video {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translateX(-50%) translateY(-50%);
    object-fit: cover;
    z-index: 0;
}

.content-overlay {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    background-color: rgba(0, 0, 0, 0.5);
    position: relative;
    box-sizing: border-box;
    margin: auto;
    overflow-y: auto;
}

.cybertitle {
    font-family: 'krona', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1rem;
    text-align: center;
}

.profile-form {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-sizing: border-box;
}

.attribute-container {
    width: 100%;
    background-color: rgba(7, 24, 43, 0.8);
    background-image: linear-gradient(92deg, #0d001d 0%, #01615494 60%);
    border-radius: 0.5rem;
    padding: 0.75rem;
    margin-bottom: 0.75rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 10px rgba(229, 27, 111, 0.5);
}

.attribute-container > div {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: space-between;
    align-items: center;
}

.input-label {
    width: 100%;
    display: block;
    color: #ffffff;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
}

.input {
    flex: 1 1 60%;
    min-width: 0;
    padding: 0.375rem 0.75rem;
    background-color: #091833;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    border-radius: 0.375rem;
    color: #ffffff;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    height: 2.5rem;
}

.input:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.custom-file-input {
    flex: 1 1 60%;
    min-width: 0;
    padding: 0.375rem 0.75rem;
    background-color: #091833;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    border-radius: 0.375rem;
    color: #ffffff;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    height: 2.5rem;
    margin:10px;

}

.custom-file-input::-webkit-file-upload-button {
    display: none;
}


.button {
    flex: 0 0 auto;
    background-color: #3b82f6;
    color: white;
    font-weight: bold;
    font-family: "krona";
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    transition: background-color 150ms ease-in-out;
    outline: none;
    white-space: nowrap;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 100px;
}

.select-file-button {
    width: auto;
    margin: 0 auto;
}

.button:hover {
    background-color: #2563eb;
}

.file-select-button {
    display: inline-block;
    padding: 0.375rem 0.75rem;
    background-color: #4b5563;
    color: white;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    height: 2.5rem;
}

.file-select-button:hover {
    background-color: #374151;
}

/* Estilos para modo claro */
.LightMode .inner-content {
    background-color: rgba(255, 255, 255, 0.9);
}

.LightMode .cybertitle,  
.LightMode .input-label {
    color: #1F2E49;
}
.LightMode .container-gradient {
    background-image: linear-gradient(92deg, #80E0FF 0%, #C585FF  100%);
}

.LightMode .content-overlay {
    background-color: rgba(255, 255, 255, 0.5);
}
.LightMode .attribute-container {
    background-image: linear-gradient(92deg, #80E0FF 0%, #C585FF  100%);
    box-shadow: 0 0 20px rgba(229, 27, 111, 0.8);
}

.LightMode .footer-text {
    background-color: rgba(255, 255, 255, 0.8);
}

.LightMode .footer-text p {
    color: #091833;
}

.LightMode .button {
    background-color: #2563eb;
    color: white;
}

.LightMode .button:hover {
    background-color: #1d4ed8;
}

.LightMode .input{
  background-color: white;
  color:#1F2E49;
}



@media (max-width: 768px) {
    .attribute-container > div {
        flex-direction: column;
        align-items: stretch;
    }
    .content-overlay {
        width: 95%;
        padding: 1rem;
    }

    .cybertitle {
        font-size: 1.25rem;
    }

    .attribute-container > div {
        flex-direction: column;
        align-items: stretch;
    }

    .input, .custom-file-input, .button {
        width: 100%;
        margin: 0.25rem 0;
    }
    .select-file-button {
        width: auto;
    }
}

@media (max-width: 480px) {
    .content-overlay {
        width: 100%;
        padding: 0.75rem;
    }

    .cybertitle {
        font-size: 1rem;
    }

    .attribute-container {
        padding: 0.5rem;
    }

    .input, .custom-file-input, .button {
        font-size: 0.75rem;
    }
}

@media (max-height: 600px) {
    .content-overlay {
        max-height: 90vh;
        padding: 0.75rem;
    }

    .attribute-container {
        margin-bottom: 0.5rem;
    }
}

@media (max-width: 360px) {
    .content-overlay {
        padding: 0.5rem;
    }

    .cybertitle {
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
    }

    .attribute-container {
        padding: 0.375rem;
        margin-bottom: 0.375rem;
    }

    .input-label {
        font-size: 0.75rem;
    }

    .input,.custom-file-input, .button {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        height: 2rem;
    }
}

@media (max-height: 500px) {
    .content-overlay {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }

    .cybertitle {
        font-size: 1rem;
        margin-bottom: 0.5rem;
    }

    .attribute-container {
        padding: 0.375rem;
        margin-bottom: 0.375rem;
    }

    .input-group {
        flex-direction: row;
        align-items: center;
    }

    .input, .custom-file-input {
        flex: 1;
    }

    .button {
        width: auto;
        padding: 0.25rem 0.5rem;
    }
}
</style>