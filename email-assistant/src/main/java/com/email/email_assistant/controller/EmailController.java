package com.email.email_assistant.controller;


import com.email.email_assistant.dto.EmailRequest;
import com.email.email_assistant.service.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins="*")
public class EmailController {
    private final EmailService emailService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest){
        String response = emailService.generateEmailReply(emailRequest);
        return ResponseEntity.ok(response);
    }
}
