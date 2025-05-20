package com.wedding.manager.controller;

import com.wedding.manager.model.Task;
import com.wedding.manager.model.User;
import com.wedding.manager.model.Wedding;
import com.wedding.manager.payload.response.MessageResponse;
import com.wedding.manager.repository.TaskRepository;
import com.wedding.manager.repository.UserRepository;
import com.wedding.manager.repository.WeddingRepository;
import com.wedding.manager.security.service.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private WeddingRepository weddingRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/wedding/{weddingId}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getTasksByWeddingId(@PathVariable Long weddingId) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    if (!isAuthorized(wedding, currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to view tasks of this wedding"));
                    }
                    List<Task> tasks = taskRepository.findByWeddingId(weddingId);
                    return ResponseEntity.ok(tasks);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/wedding/{weddingId}/status/{status}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getTasksByStatus(@PathVariable Long weddingId, @PathVariable Task.TaskStatus status) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    if (!isAuthorized(wedding, currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to view tasks of this wedding"));
                    }
                    List<Task> tasks = taskRepository.findByWeddingIdAndStatus(weddingId, status);
                    return ResponseEntity.ok(tasks);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/wedding/{weddingId}/overdue")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getOverdueTasks(@PathVariable Long weddingId) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    if (!isAuthorized(wedding, currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to view tasks of this wedding"));
                    }
                    LocalDate today = LocalDate.now();
                    List<Task> tasks = taskRepository.findByWeddingIdAndDueDateBeforeAndStatusNot(
                            weddingId, today, Task.TaskStatus.COMPLETED);
                    return ResponseEntity.ok(tasks);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('USER') or hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<List<Task>> getTasksAssignedToMe() {
        User currentUser = getCurrentUser();
        List<Task> tasks = taskRepository.findByAssignedTo(currentUser);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/wedding/{weddingId}/assigned")
    @PreAuthorize("hasRole('USER') or hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getTasksAssignedToMeForWedding(@PathVariable Long weddingId) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    // Any user can view tasks assigned to them
                    List<Task> tasks = taskRepository.findByWeddingIdAndAssignedTo(weddingId, currentUser);
                    return ResponseEntity.ok(tasks);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        return taskRepository.findById(id)
                .map(task -> {
                    // Allow access if user is assigned to the task, is part of the wedding couple, or is an admin
                    if (task.getAssignedTo() != null && task.getAssignedTo().getId().equals(currentUser.getId()) ||
                        isAuthorized(task.getWedding(), currentUser)) {
                        return ResponseEntity.ok(task);
                    } else {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to view this task"));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/wedding/{weddingId}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> createTask(@PathVariable Long weddingId, @Valid @RequestBody Task task,
                                        @RequestParam(required = false) Long assignedToId) {
        User currentUser = getCurrentUser();
        return weddingRepository.findById(weddingId)
                .map(wedding -> {
                    if (!isAuthorized(wedding, currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to add tasks to this wedding"));
                    }
                    
                    task.setWedding(wedding);
                    
                    // Set assigned user if provided
                    if (assignedToId != null) {
                        User assignedUser = userRepository.findById(assignedToId)
                                .orElseThrow(() -> new RuntimeException("Error: User not found."));
                        task.setAssignedTo(assignedUser);
                    }
                    
                    Task savedTask = taskRepository.save(task);
                    return ResponseEntity.ok(savedTask);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @Valid @RequestBody Task taskDetails,
                                       @RequestParam(required = false) Long assignedToId) {
        User currentUser = getCurrentUser();
        return taskRepository.findById(id)
                .map(task -> {
                    if (!isAuthorized(task.getWedding(), currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to update this task"));
                    }
                    
                    task.setTitle(taskDetails.getTitle());
                    task.setDescription(taskDetails.getDescription());
                    task.setDueDate(taskDetails.getDueDate());
                    task.setStatus(taskDetails.getStatus());
                    
                    if (taskDetails.getStatus() == Task.TaskStatus.COMPLETED && task.getCompletedDate() == null) {
                        task.setCompletedDate(LocalDate.now());
                    } else if (taskDetails.getStatus() != Task.TaskStatus.COMPLETED) {
                        task.setCompletedDate(null);
                    }
                    
                    // Update assigned user if provided
                    if (assignedToId != null) {
                        User assignedUser = userRepository.findById(assignedToId)
                                .orElseThrow(() -> new RuntimeException("Error: User not found."));
                        task.setAssignedTo(assignedUser);
                    } else if (assignedToId == null && taskDetails.getAssignedTo() == null) {
                        // If explicitly set to null, remove assignment
                        task.setAssignedTo(null);
                    }
                    
                    Task updatedTask = taskRepository.save(task);
                    return ResponseEntity.ok(updatedTask);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status/{status}")
    @PreAuthorize("hasRole('USER') or hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long id, @PathVariable Task.TaskStatus status) {
        User currentUser = getCurrentUser();
        return taskRepository.findById(id)
                .map(task -> {
                    // Allow status update if user is assigned to the task, is part of the wedding couple, or is an admin
                    if ((task.getAssignedTo() != null && task.getAssignedTo().getId().equals(currentUser.getId())) ||
                        isAuthorized(task.getWedding(), currentUser)) {
                        
                        task.setStatus(status);
                        
                        if (status == Task.TaskStatus.COMPLETED && task.getCompletedDate() == null) {
                            task.setCompletedDate(LocalDate.now());
                        } else if (status != Task.TaskStatus.COMPLETED) {
                            task.setCompletedDate(null);
                        }
                        
                        Task updatedTask = taskRepository.save(task);
                        return ResponseEntity.ok(updatedTask);
                    } else {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to update this task"));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COUPLE') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        return taskRepository.findById(id)
                .map(task -> {
                    if (!isAuthorized(task.getWedding(), currentUser)) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Error: You are not authorized to delete this task"));
                    }
                    taskRepository.delete(task);
                    return ResponseEntity.ok(new MessageResponse("Task deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private boolean isAuthorized(Wedding wedding, User user) {
        return wedding.getCouples().contains(user) || 
               user.getRoles().stream().anyMatch(r -> r.getName().name().equals("ROLE_ADMIN"));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
    }
} 