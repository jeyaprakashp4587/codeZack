package com.codezack

import android.graphics.Color
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ListView
import android.widget.ScrollView
import android.widget.TextView
import androidx.activity.compose.setContent
import androidx.appcompat.app.AppCompatActivity



class KotlinScreen : AppCompatActivity(){
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.kotlin_screen)
        val listData = listOf("jp","pp","kp")
        val listView = findViewById<ListView>(R.id.listView)
        val adapter = ArrayAdapter(this,R.layout.kotlin_screen,R.id.textListView,listData)
        listView.adapter=adapter
        val Text = findViewById<TextView>(R.id.textView)

    }
}
