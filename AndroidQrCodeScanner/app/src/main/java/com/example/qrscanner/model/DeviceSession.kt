package com.example.qrscanner.model

import com.google.gson.annotations.SerializedName
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

data class DeviceSessionRequest(
    val email: String,
    val deviceId: String,
    val latitude: Double,
    val longitude: Double,
    @SerializedName("loginTime")
    val loginTime: String
) {
    companion object {
        fun create(email: String, deviceId: String, latitude: Double, longitude: Double): DeviceSessionRequest {
            val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US)
            dateFormat.timeZone = TimeZone.getTimeZone("UTC")
            val currentTime = dateFormat.format(Date())
            
            return DeviceSessionRequest(
                email = email,
                deviceId = deviceId,
                latitude = latitude,
                longitude = longitude,
                loginTime = currentTime
            )
        }
    }
} 