package com.example.qrscanner.utils

import android.content.Context
import android.net.wifi.WifiManager
import android.net.wifi.WifiNetworkSuggestion
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.net.wifi.WifiInfo

class WifiManager(private val context: Context) {
    private val wifiManager: WifiManager = context.getSystemService(Context.WIFI_SERVICE) as WifiManager
    private val connectivityManager: ConnectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    companion object {
        const val ALLOWED_SSID = "iPhone (Алмаз)" // Замените на SSID вашей WiFi сети
        const val ALLOWED_BSSID = "fe:77:b2:c9:d4:c4" // MAC-адрес разрешенной точки доступа
        private const val TAG = "WifiManager"
    }

    fun isConnectedToAllowedWifi(): Boolean {
        Log.d(TAG, "Checking if connected to allowed WiFi")
        if (!wifiManager.isWifiEnabled) {
            Log.d(TAG, "WiFi is disabled")
            return false
        }

        // Для Android 10 и выше используем ConnectivityManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            Log.d(TAG, "Using ConnectivityManager for Android Q and above")
            val network = connectivityManager.activeNetwork
            if (network == null) {
                Log.d(TAG, "No active network found")
                return false
            }

            val capabilities = connectivityManager.getNetworkCapabilities(network)
            if (capabilities == null) {
                Log.d(TAG, "No network capabilities found")
                return false
            }

            if (!capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
                Log.d(TAG, "Not connected to WiFi network")
                return false
            }

            // Получаем информацию о WiFi
            val wifiInfo = wifiManager.connectionInfo
            val ssid = getCurrentWifiSSID()
            val bssid = wifiInfo.bssid
            
            Log.d(TAG, "Current SSID: $ssid, BSSID: $bssid, Allowed BSSID: $ALLOWED_BSSID")
            
            // Проверяем BSSID
            return bssid?.equals(ALLOWED_BSSID, ignoreCase = true) ?: false
        } else {
            Log.d(TAG, "Using old method for Android below Q")
            val connectionInfo = wifiManager.connectionInfo
            val bssid = connectionInfo.bssid

            if (bssid == null) {
                Log.d(TAG, "BSSID is null")
                return false
            }

            Log.d(TAG, "Current BSSID: $bssid, Allowed BSSID: $ALLOWED_BSSID")
            return bssid.equals(ALLOWED_BSSID, ignoreCase = true)
        }
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    fun connectToAllowedWifi(password: String) {
        Log.d(TAG, "Attempting to connect to allowed WiFi")
        val suggestion = WifiNetworkSuggestion.Builder()
            .setSsid(ALLOWED_SSID)
            .setBssid(android.net.MacAddress.fromString(ALLOWED_BSSID))
            .setWpa2Passphrase(password)
            .build()

        val suggestions = listOf(suggestion)
        val status = wifiManager.addNetworkSuggestions(suggestions)

        if (status == WifiManager.STATUS_NETWORK_SUGGESTIONS_SUCCESS) {
            Log.d(TAG, "WiFi network suggestion added successfully")
        } else {
            Log.e(TAG, "Failed to add WiFi network suggestion")
        }
    }

    fun getCurrentWifiSSID(): String? {
        Log.d(TAG, "Getting current WiFi SSID")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val network = connectivityManager.activeNetwork
            if (network == null) {
                Log.d(TAG, "No active network found")
                return null
            }

            val capabilities = connectivityManager.getNetworkCapabilities(network)
            if (capabilities == null) {
                Log.d(TAG, "No network capabilities found")
                return null
            }

            if (!capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
                Log.d(TAG, "Not connected to WiFi network")
                return null
            }

            // Получаем информацию о WiFi
            val wifiInfo = wifiManager.connectionInfo
            if (wifiInfo == null) {
                Log.d(TAG, "WifiInfo is null")
                return null
            }

            // Пробуем получить SSID
            var ssid = wifiInfo.ssid
            if (ssid == null || ssid == "<unknown ssid>") {
                // Если SSID недоступен, пробуем получить через WifiManager
                val configuredNetworks = wifiManager.configuredNetworks
                if (configuredNetworks != null) {
                    for (network in configuredNetworks) {
                        if (network.networkId == wifiInfo.networkId) {
                            ssid = network.SSID
                            break
                        }
                    }
                }
            }

            Log.d(TAG, "Raw SSID: $ssid")
            return ssid?.replace("\"", "")
        } else {
            val connectionInfo = wifiManager.connectionInfo
            val ssid = connectionInfo.ssid
            Log.d(TAG, "Raw SSID: $ssid")
            return ssid?.replace("\"", "")
        }
    }

    fun isWifiEnabled(): Boolean {
        val isEnabled = wifiManager.isWifiEnabled
        Log.d(TAG, "WiFi is ${if (isEnabled) "enabled" else "disabled"}")
        return isEnabled
    }
} 