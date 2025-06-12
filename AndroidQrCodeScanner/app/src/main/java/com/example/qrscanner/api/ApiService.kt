package com.example.qrscanner.api

import com.example.qrscanner.model.AuthRequest
import com.example.qrscanner.model.AuthResponse
import com.example.qrscanner.model.DeviceSessionRequest
import com.example.qrscanner.model.DeviceSessionResponse
import com.example.qrscanner.model.QRCodeRequest
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    @POST("api/Auth/login")
    suspend fun login(@Body request: AuthRequest): Response<AuthResponse>

    @GET("api/DeviceSession/CheckSession")
    suspend fun checkDeviceSession(
        @Query("deviceId") deviceId: String,
        @Header("Authorization") token: String
    ): Response<Boolean>

    @POST("api/DeviceSession/AddDevice")
    suspend fun addDeviceSession(
        @Body request: DeviceSessionRequest,
        @Header("Authorization") token: String
    ): Response<DeviceSessionResponse>

    @POST("api/QRcode/mark")
    suspend fun markQRCode(
        @Header("Authorization") token: String,
        @Body request: QRCodeRequest
    ): Response<Unit>
} 