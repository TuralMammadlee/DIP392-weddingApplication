package com.wedding.manager.repository;

import com.wedding.manager.model.Task;
import com.wedding.manager.model.Task.TaskStatus;
import com.wedding.manager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByWeddingId(Long weddingId);
    
    List<Task> findByWeddingIdAndStatus(Long weddingId, TaskStatus status);
    
    List<Task> findByWeddingIdAndDueDateBefore(Long weddingId, LocalDate date);
    
    List<Task> findByWeddingIdAndDueDateBeforeAndStatusNot(Long weddingId, LocalDate date, TaskStatus status);
    
    List<Task> findByAssignedTo(User user);
    
    List<Task> findByWeddingIdAndAssignedTo(Long weddingId, User user);
} 