package com.codezack

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NavigationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NavigationModule"
    }

    @ReactMethod
    fun navigateToKotlinScreen(data: String) {
        val currentActivity = currentActivity
        if (currentActivity != null) {
            val intent = Intent(currentActivity, KotlinScreenActivity::class.java)
            intent.putExtra("dataKey", data)
            currentActivity.startActivity(intent)
        }
    }
}
