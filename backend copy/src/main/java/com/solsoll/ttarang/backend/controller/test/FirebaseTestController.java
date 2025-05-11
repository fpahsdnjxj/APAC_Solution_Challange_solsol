package com.solsoll.ttarang.backend.controller.test;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class FirebaseTestController {

    @GetMapping("/test/firestore")
    public String testFirestore() throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        Map<String, Object> data = new HashMap<>();
        data.put("name", "홍길동");
        data.put("email", "hong@example.com");

        db.collection("users").document("hong@example.com").set(data);
        return "Firestore 저장 성공";
    }
}
