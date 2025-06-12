package com.example.qrscanner.model

data class QRCodeRequest(
    val token: String,
    val latitude: Double? = null,
    val longitude: Double? = null
) 