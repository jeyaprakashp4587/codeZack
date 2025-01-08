package com.codezack

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MyKotlinScreen : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val textView = TextView(this)
        textView.text = "Hello from Kotlin!"
        textView.textSize = 20f
        setContentView(textView)
    }
}
