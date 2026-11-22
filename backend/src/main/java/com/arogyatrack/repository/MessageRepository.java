package com.arogyatrack.repository;

import com.arogyatrack.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByUserIdOrderBySentAtAsc(Long userId);

    @Modifying
    @Query("UPDATE Message m SET m.readStatus = true WHERE m.user.id = :userId AND m.receiver.id = :receiverId")
    void markConversationAsRead(Long userId, Long receiverId);

    Long countByReceiverIdAndReadStatusFalse(Long receiverId);
}
