package com.codezack

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class KotlinScreenActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_kotlin_screen)

        // Retrieve the data passed from React Native
        val data = intent.getStringExtra("dataKey")

        // Update the TextView with the data
        val textView = findViewById<TextView>(R.id.textViewData)
        textView.text = data ?: "No data received"
    }
}
