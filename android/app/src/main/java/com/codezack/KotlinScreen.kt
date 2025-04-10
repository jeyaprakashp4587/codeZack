package com.codezack

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.LinearLayout
import android.widget.TextView
import android.graphics.Color


class KotlinScreen : AppCompatActivity(){
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        var layout = LinearLayout(this).apply { 
            setPadding(15, 15, 15, 15)
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.blue(100))
         }

         var text = TextView(this).apply { 
            text = "hello"
          }
          layout.addView(text)
          setContentView(layout)
    }
}
