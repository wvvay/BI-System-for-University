package com.example.qrscanner

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.example.qrscanner.api.ApiService
import com.example.qrscanner.api.RetrofitClient
import com.example.qrscanner.databinding.ActivityLoginBinding
import com.example.qrscanner.model.AuthRequest
import com.example.qrscanner.model.DeviceSessionRequest
import com.example.qrscanner.utils.DeviceManager
import com.example.qrscanner.utils.SessionManager
import com.example.qrscanner.utils.SessionTimer
import com.example.qrscanner.utils.WifiManager
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private lateinit var sessionManager: SessionManager
    private lateinit var deviceManager: DeviceManager
    private lateinit var apiService: ApiService
    private lateinit var sessionTimer: SessionTimer
    private lateinit var wifiManager: WifiManager

    companion object {
        private const val TAG = "LoginActivity"
        private const val PERMISSION_REQUEST_CODE = 123
    }

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        Log.d(TAG, "Permission result: $permissions")
        val allGranted = permissions.entries.all { it.value }
        if (allGranted) {
            Log.d(TAG, "All permissions granted, proceeding with WiFi check")
            checkWifiAndProceed()
        } else {
            Log.d(TAG, "Some permissions were denied: ${permissions.filter { !it.value }.keys}")
            showPermissionDeniedDialog()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d(TAG, "onCreate called")
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)
        deviceManager = DeviceManager(this)
        apiService = RetrofitClient.apiService
        wifiManager = WifiManager(this)
        sessionTimer = SessionTimer(this, sessionManager) {
            Log.d(TAG, "Session expired")
            Toast.makeText(this, "Сессия истекла", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, LoginActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            })
            finish()
        }

        // Проверяем и запрашиваем разрешения
        checkAndRequestPermissions()

        binding.loginButton.setOnClickListener {
            val email = binding.emailEditText.text.toString()
            val password = binding.passwordEditText.text.toString()

            if (email.isNotEmpty() && password.isNotEmpty()) {
                login(email, password)
            } else {
                Toast.makeText(this, "Пожалуйста, заполните все поля", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showPermissionExplanationDialog() {
        Log.d(TAG, "Showing permission explanation dialog")
        AlertDialog.Builder(this)
            .setTitle("Необходимые разрешения")
            .setMessage("Для работы приложения необходимы следующие разрешения:\n\n" +
                    "• Доступ к местоположению - для определения подключенной WiFi сети\n" +
                    "• Доступ к WiFi - для проверки подключения к корпоративной сети\n\n" +
                    "Без этих разрешений приложение не сможет определить, подключены ли вы к нужной сети.")
            .setPositiveButton("Предоставить разрешения") { dialog, _ ->
                Log.d(TAG, "User clicked 'Provide Permissions' button")
                dialog.dismiss()
                requestPermissions()
            }
            .setNegativeButton("Отмена") { dialog, _ ->
                Log.d(TAG, "User clicked 'Cancel' button")
                dialog.dismiss()
                Toast.makeText(
                    this,
                    "Без разрешений приложение не может работать",
                    Toast.LENGTH_LONG
                ).show()
                finish()
            }
            .setCancelable(false)
            .show()
    }

    private fun showPermissionDeniedDialog() {
        Log.d(TAG, "Showing permission denied dialog")
        AlertDialog.Builder(this)
            .setTitle("Разрешения не предоставлены")
            .setMessage("Для работы приложения необходимы все запрошенные разрешения. " +
                    "Пожалуйста, предоставьте их в настройках приложения.")
            .setPositiveButton("Открыть настройки") { dialog, _ ->
                Log.d(TAG, "User clicked 'Open Settings' button")
                dialog.dismiss()
                openAppSettings()
            }
            .setNegativeButton("Выйти") { dialog, _ ->
                Log.d(TAG, "User clicked 'Exit' button")
                dialog.dismiss()
                finish()
            }
            .setCancelable(false)
            .show()
    }

    private fun openAppSettings() {
        Log.d(TAG, "Opening app settings")
        Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
            data = android.net.Uri.fromParts("package", packageName, null)
            startActivity(this)
        }
    }

    private fun checkAndRequestPermissions() {
        Log.d(TAG, "Checking permissions")
        val permissions = mutableListOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.ACCESS_WIFI_STATE,
            Manifest.permission.ACCESS_NETWORK_STATE
        )

        val permissionsToRequest = permissions.filter {
            val isGranted = ContextCompat.checkSelfPermission(this, it) == PackageManager.PERMISSION_GRANTED
            Log.d(TAG, "Permission $it is ${if (isGranted) "granted" else "not granted"}")
            !isGranted
        }.toTypedArray()

        if (permissionsToRequest.isEmpty()) {
            Log.d(TAG, "All permissions are already granted")
            checkWifiAndProceed()
        } else {
            Log.d(TAG, "Need to request permissions: ${permissionsToRequest.joinToString()}")
            requestPermissions()
        }
    }

    private fun requestPermissions() {
        Log.d(TAG, "Requesting permissions")
        val permissions = mutableListOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.ACCESS_WIFI_STATE,
            Manifest.permission.ACCESS_NETWORK_STATE
        )

        val permissionsToRequest = permissions.filter {
            val isGranted = ContextCompat.checkSelfPermission(this, it) == PackageManager.PERMISSION_GRANTED
            Log.d(TAG, "Permission $it is ${if (isGranted) "granted" else "not granted"}")
            !isGranted
        }.toTypedArray()

        if (permissionsToRequest.isNotEmpty()) {
            Log.d(TAG, "Launching permission request for: ${permissionsToRequest.joinToString()}")
            permissionLauncher.launch(permissionsToRequest)
        } else {
            Log.d(TAG, "All permissions are already granted")
            checkWifiAndProceed()
        }
    }

    private fun checkWifiAndProceed() {
        Log.d(TAG, "Starting WiFi check")
        
        // Проверяем, включен ли WiFi
        if (!wifiManager.isWifiEnabled()) {
            Log.d(TAG, "WiFi is disabled")
            showWifiDisabledDialog()
            return
        }

        // Проверяем подключение к WiFi
        val currentSsid = wifiManager.getCurrentWifiSSID()
        Log.d(TAG, "Current WiFi SSID: $currentSsid")

        if (currentSsid == null) {
            Log.d(TAG, "No WiFi connection detected")
            showNoWifiConnectionDialog()
            return
        }

        if (!wifiManager.isConnectedToAllowedWifi()) {
            Log.d(TAG, "Not connected to allowed WiFi network")
            showWrongWifiDialog()
            return
        }

        Log.d(TAG, "WiFi check passed, checking session")
        // Проверяем, есть ли сохраненный токен и не истекла ли сессия
        sessionManager.getToken()?.let { token ->
            if (!sessionTimer.isSessionExpired()) {
                Log.d(TAG, "Valid session found, starting ScannerActivity")
                startActivity(Intent(this, ScannerActivity::class.java))
                finish()
                return
            } else {
                Log.d(TAG, "Session expired, clearing session")
                sessionManager.clearSession()
            }
        }

        Log.d(TAG, "No valid session found, showing login screen")
    }

    private fun showWifiDisabledDialog() {
        AlertDialog.Builder(this)
            .setTitle("WiFi выключен")
            .setMessage("Для работы приложения необходимо включить WiFi")
            .setPositiveButton("Включить WiFi") { _, _ ->
                startActivity(Intent(android.provider.Settings.ACTION_WIFI_SETTINGS))
            }
            .setNegativeButton("Выйти") { _, _ ->
                finish()
            }
            .setCancelable(false)
            .show()
    }

    private fun showNoWifiConnectionDialog() {
        AlertDialog.Builder(this)
            .setTitle("Нет подключения к WiFi")
            .setMessage("Пожалуйста, подключитесь к WiFi сети")
            .setPositiveButton("Настройки WiFi") { _, _ ->
                startActivity(Intent(android.provider.Settings.ACTION_WIFI_SETTINGS))
            }
            .setNegativeButton("Выйти") { _, _ ->
                finish()
            }
            .setCancelable(false)
            .show()
    }

    private fun showWrongWifiDialog() {
        AlertDialog.Builder(this)
            .setTitle("Неверная WiFi сеть")
            .setMessage("Для работы приложения необходимо подключиться к корпоративной WiFi сети")
            .setPositiveButton("Настройки WiFi") { _, _ ->
                startActivity(Intent(android.provider.Settings.ACTION_WIFI_SETTINGS))
            }
            .setNegativeButton("Выйти") { _, _ ->
                finish()
            }
            .setCancelable(false)
            .show()
    }

    private fun login(email: String, password: String) {
        lifecycleScope.launch {
            try {
                // 1. Авторизация
                val response = apiService.login(AuthRequest(email, password))
                if (!response.isSuccessful) {
                    Toast.makeText(
                        this@LoginActivity,
                        "Неверный email или пароль",
                        Toast.LENGTH_SHORT
                    ).show()
                    return@launch
                }

                val token = response.body()?.token ?: return@launch
                val deviceId = deviceManager.getDeviceId()
                val authHeader = "Bearer $token"

                // 2. Проверка существования устройства
                val checkResponse = apiService.checkDeviceSession(
                    deviceId = deviceId,
                    token = authHeader
                )

                if (!checkResponse.isSuccessful) {
                    Toast.makeText(
                        this@LoginActivity,
                        "Ошибка при проверке устройства",
                        Toast.LENGTH_SHORT
                    ).show()
                    return@launch
                }

                val deviceExists = checkResponse.body() ?: false

                // 3. Если устройства нет, добавляем его
                if (!deviceExists) {
                    val deviceSession = DeviceSessionRequest.create(
                        email = email,
                        deviceId = deviceId,
                        latitude = 0.0,
                        longitude = 0.0
                    )

                    val addResponse = apiService.addDeviceSession(
                        request = deviceSession,
                        token = authHeader
                    )

                    if (!addResponse.isSuccessful) {
                        val errorMessage = when (addResponse.code()) {
                            400 -> "Сессия с этим устройством уже существует"
                            else -> "Ошибка при добавлении устройства"
                        }
                        Toast.makeText(
                            this@LoginActivity,
                            errorMessage,
                            Toast.LENGTH_SHORT
                        ).show()
                        return@launch
                    }

                    // 4. Повторная проверка после добавления
                    val finalCheckResponse = apiService.checkDeviceSession(
                        deviceId = deviceId,
                        token = authHeader
                    )

                    if (!finalCheckResponse.isSuccessful || finalCheckResponse.body() != true) {
                        Toast.makeText(
                            this@LoginActivity,
                            "Не удалось подтвердить добавление устройства",
                            Toast.LENGTH_SHORT
                        ).show()
                        return@launch
                    }
                }

                // 5. Если все проверки пройдены, сохраняем сессию и переходим к сканеру
                sessionManager.saveSession(token, email)
                startActivity(Intent(this@LoginActivity, ScannerActivity::class.java))
                finish()

            } catch (e: Exception) {
                Toast.makeText(
                    this@LoginActivity,
                    "Ошибка при входе: ${e.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }
} 