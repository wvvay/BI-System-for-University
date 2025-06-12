package com.example.qrscanner.utils

import android.content.Context
import android.os.CountDownTimer
import android.widget.TextView

class SessionTimer(
    private val context: Context,
    private val sessionManager: SessionManager,
    private val onSessionExpired: () -> Unit
) {
    private var countDownTimer: CountDownTimer? = null
    private val sessionTimeout = 5 * 60 * 1000L // 5 минут в миллисекундах
    private var timerTextView: TextView? = null

    fun startTimer(textView: TextView) {
        timerTextView = textView
        
        // Получаем сохраненное время истечения сессии или создаем новое
        val expirationTime = sessionManager.getSessionExpirationTime()
        val currentTime = System.currentTimeMillis()
        
        val timeLeft = if (expirationTime > currentTime) {
            expirationTime - currentTime
        } else {
            sessionTimeout
        }

        // Сохраняем новое время истечения сессии
        sessionManager.saveSessionExpirationTime(currentTime + timeLeft)

        countDownTimer?.cancel()
        countDownTimer = object : CountDownTimer(timeLeft, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val minutes = millisUntilFinished / (60 * 1000)
                val seconds = (millisUntilFinished % (60 * 1000)) / 1000
                timerTextView?.text = String.format("Осталось времени: %02d:%02d", minutes, seconds)
                
                // Обновляем время истечения сессии при каждом тике
                sessionManager.saveSessionExpirationTime(System.currentTimeMillis() + millisUntilFinished)
            }

            override fun onFinish() {
                timerTextView?.text = "Сессия истекла"
                sessionManager.clearSession()
                onSessionExpired()
            }
        }.start()
    }

    fun stopTimer() {
        countDownTimer?.cancel()
        countDownTimer = null
        timerTextView = null
    }

    fun isSessionExpired(): Boolean {
        val expirationTime = sessionManager.getSessionExpirationTime()
        return System.currentTimeMillis() >= expirationTime
    }
} 