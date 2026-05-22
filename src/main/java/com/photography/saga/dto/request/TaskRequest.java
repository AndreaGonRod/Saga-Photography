package com.photography.saga.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.photography.saga.model.Task;
import com.photography.saga.model.enums.TaskStatus;

import java.time.LocalDate;
import java.util.List;

public record TaskRequest(

        ClientRequest client,
        Integer photoshootId,
        Integer eventId,
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate dueDate,
        List<TaskItemRequest> itemList
) {
    public record TaskItemRequest(
            String taskName,
            String taskDescription,
            TaskStatus status
    ) {}
}
