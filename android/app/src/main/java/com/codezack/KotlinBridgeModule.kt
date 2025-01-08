package com.codezack

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class KotlinBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "KotlinBridge"
    }

    @ReactMethod
    fun openKotlinScreen() {
        val currentActivity = currentActivity
        currentActivity?.let {
            val intent = Intent(it, MyKotlinScreen::class.java)
            it.startActivity(intent)
        }
    }
}
