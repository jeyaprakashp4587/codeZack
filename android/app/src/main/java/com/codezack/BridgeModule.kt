package com.codezack

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import androidx.appcompat.app.AppCompatActivity
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
fun navigateNative() {
    val intent = Intent(reactApplicationContext, KotlinScreen::class.java)
    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
    reactApplicationContext.startActivity(intent)
}

}

