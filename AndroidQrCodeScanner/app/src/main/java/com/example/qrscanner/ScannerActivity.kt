package com.example.qrscanner

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.example.qrscanner.api.RetrofitClient
import com.example.qrscanner.databinding.ActivityScannerBinding
import com.example.qrscanner.model.QRCodeRequest
import com.example.qrscanner.utils.SessionManager
import com.example.qrscanner.utils.SessionTimer
import com.example.qrscanner.utils.WifiManager
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationToken
import com.google.android.gms.tasks.CancellationTokenSource
import com.google.android.gms.tasks.OnTokenCanceledListener
import com.google.zxing.integration.android.IntentIntegrator
import kotlinx.coroutines.launch

class ScannerActivity : AppCompatActivity() {
    private lateinit var binding: ActivityScannerBinding
    private lateinit var sessionManager: SessionManager
    private lateinit var sessionTimer: SessionTimer
    private lateinit var wifiManager: WifiManager
    private var currentLatitude: Double? = null
    private var currentLongitude: Double? = null

    private val locationPermissionRequest = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        when {
            permissions.getOrDefault(Manifest.permission.ACCESS_FINE_LOCATION, false) -> {
                startLocationUpdates()
            }
            permissions.getOrDefault(Manifest.permission.ACCESS_COARSE_LOCATION, false) -> {
                startLocationUpdates()
            }
            else -> {
                Toast.makeText(this, "Для работы приложения необходим доступ к геолокации", Toast.LENGTH_LONG).show()
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityScannerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)
        wifiManager = WifiManager(this)
        sessionTimer = SessionTimer(this, sessionManager) {
            // Callback при истечении сессии
            Toast.makeText(this, "Сессия истекла", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, LoginActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            })
            finish()
        }

        // Запускаем таймер сессии
        sessionTimer.startTimer(binding.sessionTimerTextView)

        // Проверяем разрешения на геолокацию
        checkLocationPermission()

        binding.scanButton.setOnClickListener {
            startQRScanner()
        }
    }

    override fun onResume() {
        super.onResume()
        // Проверяем истечение сессии при возобновлении активности
        if (sessionTimer.isSessionExpired()) {
            Toast.makeText(this, "Сессия истекла", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, LoginActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            })
            finish()
            return
        }

        // Проверяем подключение к WiFi
        if (!wifiManager.isConnectedToAllowedWifi()) {
            Toast.makeText(
                this,
                "Для работы приложения необходимо подключиться к корпоративной WiFi сети",
                Toast.LENGTH_LONG
            ).show()
            startActivity(Intent(this, LoginActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            })
            finish()
            return
        }
    }

    private fun checkLocationPermission() {
        when {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED -> {
                startLocationUpdates()
            }
            else -> {
                locationPermissionRequest.launch(
                    arrayOf(
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                    )
                )
            }
        }
    }

    private fun startLocationUpdates() {
        val fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            fusedLocationClient.getCurrentLocation(
                Priority.PRIORITY_HIGH_ACCURACY,
                object : CancellationToken() {
                    override fun onCanceledRequested(listener: OnTokenCanceledListener) = CancellationTokenSource().token

                    override fun isCancellationRequested() = false
                }
            ).addOnSuccessListener { location ->
                location?.let {
                    currentLatitude = it.latitude
                    currentLongitude = it.longitude
                }
            }
        }
    }

    private fun startQRScanner() {
        val integrator = IntentIntegrator(this)
        integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE)
        integrator.setPrompt("Наведите камеру на QR-код")
        integrator.setCameraId(0)
        integrator.setBeepEnabled(false)
        integrator.setBarcodeImageEnabled(false)
        integrator.initiateScan()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        val result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data)
        if (result != null) {
            if (result.contents == null) {
                Toast.makeText(this, "Сканирование отменено", Toast.LENGTH_SHORT).show()
            } else {
                sendQRCode(result.contents)
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data)
        }
    }

    private fun sendQRCode(token: String) {
        lifecycleScope.launch {
            try {
                val authToken = sessionManager.getToken()
                if (authToken != null) {
                    val request = QRCodeRequest(
                        token = token,
                        latitude = currentLatitude,
                        longitude = currentLongitude
                    )
                    val response = RetrofitClient.apiService.markQRCode("Bearer $authToken", request)
                    if (response.isSuccessful) {
                        Toast.makeText(this@ScannerActivity, "QR-код успешно отправлен", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(this@ScannerActivity, "Ошибка отправки QR-кода", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(this@ScannerActivity, "Ошибка авторизации", Toast.LENGTH_SHORT).show()
                    startActivity(Intent(this@ScannerActivity, LoginActivity::class.java))
                    finish()
                }
            } catch (e: Exception) {
                Toast.makeText(this@ScannerActivity, "Ошибка сети", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        sessionTimer.stopTimer()
    }
} 