package com.example.qrscanner.utils

import android.content.Context
import android.os.Build
import android.provider.Settings
import java.security.MessageDigest
import java.util.*

class DeviceManager(private val context: Context) {
    private val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private val editor = prefs.edit()

    companion object {
        private const val PREF_NAME = "DevicePrefs"
        private const val KEY_DEVICE_ID = "device_id"
    }

    fun getDeviceId(): String {
        var deviceId = prefs.getString(KEY_DEVICE_ID, null)
        
        if (deviceId == null) {
            // Создаем уникальный идентификатор на основе нескольких параметров устройства
            val androidId = Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
            val deviceInfo = StringBuilder().apply {
                append(androidId)
                append(Build.BOARD)
                append(Build.BRAND)
                append(Build.DEVICE)
                append(Build.HARDWARE)
                append(Build.MANUFACTURER)
                append(Build.MODEL)
                append(Build.PRODUCT)
                append(Build.SERIAL)
            }.toString()

            // Создаем SHA-256 хеш из информации об устройстве
            deviceId = createHash(deviceInfo)
            
            // Сохраняем идентификатор
            editor.putString(KEY_DEVICE_ID, deviceId)
            editor.apply()
        }
        
        return deviceId
    }

    fun resetDeviceId() {
        // Удаляем сохраненный идентификатор устройства
        editor.remove(KEY_DEVICE_ID)
        editor.apply()
    }

    private fun createHash(input: String): String {
        return try {
            val digest = MessageDigest.getInstance("SHA-256")
            val hash = digest.digest(input.toByteArray())
            Base64.getEncoder().encodeToString(hash)
        } catch (e: Exception) {
            // В случае ошибки создаем случайный UUID
            UUID.randomUUID().toString()
        }
    }
} 