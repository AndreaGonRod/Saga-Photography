package com.photography.saga.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.photography.saga.dto.request.TaskRequest;
import com.photography.saga.model.enums.TaskStatus;
import com.photography.saga.util.TextFormatter;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter @Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @NotNull
    private Client client;

    @ManyToOne
    private Event event;

    @ManyToOne
    private Photoshoot photoshoot;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDate dueDate;

    @ElementCollection
    private List<TaskItem> itemList;


    @Embeddable
    @NoArgsConstructor
    @AllArgsConstructor
    @Getter @Setter
    public static class TaskItem {
        private String taskName;
        @JsonIgnore
        private String searchTaskName;
        @Column(length = 2000)
        private String taskDescription;
        @Enumerated(EnumType.STRING)
        private TaskStatus status;
    }


    public void setCreatedAt() {
        this.createdAt = LocalDateTime.now();
    }

    public void setUpdatedAt(){
        this.updatedAt = LocalDateTime.now();
    }

    public void fillDetails(TaskRequest request) {
        if (request == null) return;

        this.dueDate = request.dueDate();

        if (request.itemList() != null) {
            this.itemList = request.itemList().stream()
                    .map(req -> new TaskItem(
                            req.taskName(),
                            null, // El searchTaskName se generará en prepareData
                            req.taskDescription(),
                            req.status()
                    ))
                    .collect(Collectors.toList());
        }

        this.prepareData();
    }

    @PrePersist
    @PreUpdate
    public void prepareData() {
        if (this.itemList != null) {
            for (TaskItem item : this.itemList) {
                item.setSearchTaskName(TextFormatter.textFormatter(item.getTaskName()));
            }
        }
    }
}
