package com.example.qrscanner.utils

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {
    private var prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private var editor: SharedPreferences.Editor = prefs.edit()

    fun saveSession(token: String, email: String) {
        editor.putString(KEY_TOKEN, token)
        editor.putString(KEY_EMAIL, email)
        editor.putLong(KEY_LAST_LOGIN, System.currentTimeMillis())
        editor.apply()
    }

    fun getToken(): String? {
        return prefs.getString(KEY_TOKEN, null)
    }

    fun getEmail(): String? {
        return prefs.getString(KEY_EMAIL, null)
    }

    fun getLastLoginTime(): Long {
        return prefs.getLong(KEY_LAST_LOGIN, 0)
    }

    fun saveSessionExpirationTime(expirationTime: Long) {
        editor.putLong(KEY_SESSION_EXPIRATION, expirationTime)
        editor.apply()
    }

    fun getSessionExpirationTime(): Long {
        return prefs.getLong(KEY_SESSION_EXPIRATION, 0)
    }

    fun clearSession() {
        editor.clear()
        editor.apply()
    }

    companion object {
        private const val PREF_NAME = "QRScannerPrefs"
        private const val KEY_TOKEN = "token"
        private const val KEY_EMAIL = "email"
        private const val KEY_LAST_LOGIN = "last_login"
        private const val KEY_SESSION_EXPIRATION = "session_expiration"
    }
} 