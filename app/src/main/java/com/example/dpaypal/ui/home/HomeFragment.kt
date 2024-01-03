package com.example.dpaypal.ui.home

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageButton
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.dpaypal.History
import com.example.dpaypal.MainActivity
import com.example.dpaypal.ScanActivity
import com.example.dpaypal.databinding.FragmentHomeBinding

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {
        val homeViewModel =
                ViewModelProvider(this).get(HomeViewModel::class.java)

        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        val root: View = binding.root

        val scanButton:ImageButton = binding.scanButton
        scanButton.setOnClickListener {
            var intent = Intent(this.context , ScanActivity::class.java);
            startActivity(intent);
        }

        val showHistoryBtn:Button = binding.showHistory
        showHistoryBtn.setOnClickListener {
            val intent = Intent(this.context , History::class.java);
            startActivity(intent);

        }
        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}