import { NativeBiometric, BiometryType, AccessControl } from '@capgo/capacitor-native-biometric'

const SERVER_NAME = 'gestaofinanceira'

interface Credentials {
  email: string
  senha: string
}

export const biometricService = {
  async isAvailable() {
    try {
      const result = await NativeBiometric.isAvailable({
        useFallback: false
      })
      return result
    } catch {
      return { isAvailable: false, biometryType: BiometryType.NONE }
    }
  },

  async hasStoredCredentials() {
    try {
      const result = await NativeBiometric.isCredentialsSaved({
        server: SERVER_NAME
      })
      return result.isSaved
    } catch {
      return false
    }
  },

  async storeCredentials(email: string, senha: string) {
    await NativeBiometric.setCredentials({
      username: email,
      password: senha,
      server: SERVER_NAME,
      accessControl: AccessControl.BIOMETRY_ANY
    })
  },

  async authenticateAndGetCredentials() {
    try {
      const creds = await NativeBiometric.getSecureCredentials({
        server: SERVER_NAME,
        reason: 'Autenticar para entrar no app'
      })
      return {
        email: creds.username,
        senha: creds.password
      }
    } catch {
      return null
    }
  },

  async deleteCredentials() {
    try {
      await NativeBiometric.deleteCredentials({
        server: SERVER_NAME
      })
    } catch {
      // silent fail
    }
  },

  getBiometryName(type: BiometryType) {
    switch (type) {
      case BiometryType.FINGERPRINT:
        return 'Impressão Digital'
      case BiometryType.FACE_ID:
        return 'Face ID'
      case BiometryType.FACE_AUTHENTICATION:
        return 'Reconhecimento Facial'
      case BiometryType.IRIS_AUTHENTICATION:
        return 'Iris'
      default:
        return 'Biometria'
    }
  }
}