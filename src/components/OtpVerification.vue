<template>
  <div class="otp-container">
    <form class="otp" @submit.prevent="verifyCode" @paste="handlePaste">
      <p class="heading">Verificar</p>
      <div class="check">
        <svg class="check" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="60px" height="60px" viewBox="0 0 60 60" xml:space="preserve">
          <image id="image0" width="60" height="60" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAQAAACQ9RH5AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
            AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ
            cwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0NDzN/r+StAAACR0lEQVRYw+3Yy2sTURTH8W+bNgVf
            aGhFaxNiAoJou3FVEUQE1yL031BEROjCnf4PLlxILZSGYncuiiC48AEKxghaNGiliAojiBWZNnNd
            xDza3pl77jyCyPzO8ubcT85wmUkG0qT539In+MwgoxQoUqDAKDn2kSNLlp3AGi4uDt9xWOUTK3xg
            hVU2wsIZSkxwnHHGKZOxHKfBe6rUqFGlTkPaVmKGn6iYao1ZyhK2zJfY0FZ9ldBzsbMKxZwZjn/e
            5szGw6UsD5I0W6T+hBhjUjiF7bNInjz37Ruj3igGABjbtpIo3GIh30u4ww5wr3fwfJvNcFeznhBs
            YgXw70TYX2bY/ulkZhWfzfBbTdtrzjPFsvFI+T/L35jhp5q2owDs51VIVvHYDM9sa/LY8XdtKy1l
            FXfM8FVN2/X2ajctZxVXzPA5TZvHpfb6CFXxkerUWTOcY11LX9w0tc20inX2mmF4qG3upnNWrOKB
            hIXLPu3dF1x+kRWq6ysHpkjDl+7eQjatYoOCDIZF3006U0unVSxIWTgTsI3HNP3soSJkFaflMDwL
            3OoHrph9YsPCJJ5466DyOGUHY3Epg2rWloUxnMjsNw7aw3AhMjwVhgW4HYm9FZaFQZ/bp6QeMRQe
            hhHehWKXGY7CAuSpW7MfKUZlAUqWdJ3DcbAAB3guZl9yKC4WYLfmT4muFtgVJwvQx7T2t0mnXK6J
            XlGGyAQvfNkaJ5JBmxnipubJ5HKDbJJsM0eY38QucSx5tJWTVHBwqDDZOzRNmn87fwDoyM4J2hRz
            NgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMi0xM1QxMzoxNTo1MCswMDowMKC8JaoAAAAldEVY
            dGRhdGU6bW9kaWZ5ADIwMjMtMDItMTNUMTM6MTU6NTArMDA6MDDR4Z0WAAAAKHRFWHRkYXRlOnRp
            bWVzdGFtcAAyMDIzLTAyLTEzVDEzOjE1OjUxKzAwOjAwIIO3fQAAAABJRU5ErkJggg=="></image>
        </svg>
      </div>
      <div class="box">
        <input class="input" type="text" maxlength="1" v-model="otp[0]" @input="focusNext(0)" ref="input0">
        <input class="input" type="text" maxlength="1" v-model="otp[1]" @input="focusNext(1)" ref="input1">
        <input class="input" type="text" maxlength="1" v-model="otp[2]" @input="focusNext(2)" ref="input2">
        <input class="input" type="text" maxlength="1" v-model="otp[3]" @input="focusNext(3)" ref="input3">
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p> <!-- Elemento para mostrar el mensaje de error -->
      <button class="btn1" type="submit" :disabled="isSubmitting">Enviar</button>
    </form>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue';
import { backendOTPVerification } from '@/methods/api/login.js';

export default {
  name: 'OTPVerification',
  props: {
    email: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const otp = ref(['', '', '', '']);
    const isSubmitting = ref(false);
    const errorMessage = ref('');  
    const input0 = ref(null);
    const input1 = ref(null);
    const input2 = ref(null);
    const input3 = ref(null);

    const verifyCode = async () => {
      const otpCode = otp.value.join('');
      if (otpCode && !isSubmitting.value) {
        isSubmitting.value = true;
        errorMessage.value = ''; 
        try {
          const result  = await backendOTPVerification(otpCode, props.email, props.username, props.password);
          console.log("Resultado : " , result.success)
          if (result.success) {
            emit('otp-verified', result);
          } else {
            errorMessage.value = result.error || 'Error verificando OTP';
          }
        } catch (error) {
          errorMessage.value = 'Error durante la verificación del OTP';
        } finally {
          isSubmitting.value = false;
        }
      }
    };

    const focusNext = (index) => {
      if (otp.value[index].length === 1 && index < 3) {
        nextTick(() => {
          const nextInput = getInputRef(index + 1);
          if (nextInput) {
            nextInput.focus();
          }
        });
      }
    };

    const getInputRef = (index) => {
      switch (index) {
        case 0: return input0.value;
        case 1: return input1.value;
        case 2: return input2.value;
        case 3: return input3.value;
        default: return null;
      }
    };

    const handlePaste = (event) => {
      const paste = event.clipboardData.getData('text');
      if (paste.length === 4 && /^\d+$/.test(paste)) {
        otp.value = paste.split('');
        nextTick(() => {
          otp.value.forEach((digit, idx) => {
            const input = getInputRef(idx);
            if (input) {
              input.value = digit;
            }
          });
          const lastInput = getInputRef(3);
          if (lastInput) {
            lastInput.focus();
          }
        });
      }
    };

    return {
      otp,
      isSubmitting,
      errorMessage, // Incluir la variable en el return
      verifyCode,
      focusNext,
      handlePaste,
      input0,
      input1,
      input2,
      input3
    };
  }
};
</script>

<style scoped>
.otp-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  z-index: 2;
}

.otp {
  width: 300px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.heading {
  margin-bottom: 20px;
  font-weight: bold;
}

.box {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.input {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #ddd;
  text-align: center;
}

.btn1, .btn2 {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: none;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
}

.btn1:hover, .btn2:hover {
  background-color: #45a049;
}
.error {  
  color: rgb(128, 128, 129);
  margin-top: 10px;
  font-size: 14px;
}
</style>
