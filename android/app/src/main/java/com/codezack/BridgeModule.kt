package com.codezack

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.content.Intent

class BridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BridgeModule"
    }
    @ReactMethod
    fun getNativeString(promise: Promise) {
        val myString = "Hello from Kotlin!"
        promise.resolve(myString)
    }
    @ReactMethod
    fun navigateToSecondScreen() {
        val intent = Intent(this, KotlinScreen::class.java)
            startActivity(intent)
    }

}
