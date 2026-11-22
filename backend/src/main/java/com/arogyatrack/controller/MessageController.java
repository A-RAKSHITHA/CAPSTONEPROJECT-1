package com.arogyatrack.controller;

import com.arogyatrack.dto.MessageRequest;
import com.arogyatrack.entity.Message;
import com.arogyatrack.security.UserDetailsImpl;
import com.arogyatrack.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<Message> sendMessage(
            @Valid @RequestBody MessageRequest request,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        if (principal == null) throw new AccessDeniedException("Not authenticated");
        Message msg = messageService.sendMessage(request, principal.getId());
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Message>> getConversation(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        if (principal == null) throw new AccessDeniedException("Not authenticated");
        String role = principal.getAuthorities().iterator().next().getAuthority();
        List<Message> messages = messageService.getConversation(userId, principal.getId(), role);
        return ResponseEntity.ok(messages);
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<Message> markAsRead(@PathVariable Long messageId) {
        Message msg = messageService.markSingleAsRead(messageId);
        return ResponseEntity.ok(msg);
    }

    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markConversationAsRead(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        if (principal == null) throw new AccessDeniedException("Not authenticated");
        messageService.markAsRead(userId, principal.getId());
        return ResponseEntity.ok().build();
    }
}
