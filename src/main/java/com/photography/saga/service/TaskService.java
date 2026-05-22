package com.photography.saga.service;

import com.photography.saga.controller.ResponseMapper;
import com.photography.saga.dto.request.TaskRequest;

import com.photography.saga.dto.response.TaskResponse;
import com.photography.saga.exception.ErrorHandler;
import com.photography.saga.model.Client;
import com.photography.saga.model.Task;
import com.photography.saga.model.enums.TaskStatus;
import com.photography.saga.repository.EventRepository;
import com.photography.saga.repository.PhotoshootRepository;
import com.photography.saga.repository.TaskRepository;
import com.photography.saga.util.TextFormatter;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Getter  @Setter
@Transactional
public class TaskService implements ErrorHandler {

    private final TaskRepository taskRepository;
    private final ClientService clientService;
    private final PhotoshootRepository photoshootRepository;
    private final EventRepository eventRepository;
    private final ResponseMapper responseMapper;

    private String formatTaskName(String taskName) {
        return TextFormatter.textFormatter(taskName);
    }

    private void checkMandatoryFields(TaskRequest request) {
        if (request == null || request.client() == null) {
            throw badRequest();
        }

        if (request.client().id() == null) {
            if (request.client().name() == null || request.client().name().isBlank()
                    || request.client().phone() == null || request.client().phone().isBlank()) {
                throw badRequest();
            }
        }

        if (request.dueDate() != null && request.dueDate().isBefore(LocalDate.now())) {
            throw badRequest();
        }

        if (request.itemList() == null || request.itemList().isEmpty()) {
            throw badRequest();
        }
    }

    public void attachEntities(Task task, TaskRequest request) {
        task.setClient(clientService.getOrCreateEntity(request.client()));

        if (request.photoshootId() != null) {
            task.setPhotoshoot(photoshootRepository.findById(request.photoshootId())
                    .orElseThrow(this::notFound));
        } else {
            task.setPhotoshoot(null);
        }

        if (request.eventId() != null) {
            task.setEvent(eventRepository.findById(request.eventId())
                    .orElseThrow(this::notFound));
        } else {
            task.setEvent(null);
        }
    }

    public List<TaskResponse> findAll() {
        return taskRepository.findAll().stream().map(responseMapper::toResponse).toList();
    }

    public TaskResponse findById(Integer id) {
        Task task = taskRepository.findById(id).orElseThrow(this::notFound);
        return responseMapper.toResponse(task);
    }

    public List<TaskResponse> findByTaskName(String taskName){
        return taskRepository.searchByTaskName(formatTaskName(taskName)).stream().map(responseMapper::toResponse).toList();
    }

    public List<TaskResponse> findByDueDate(LocalDate dueDate){
        return taskRepository.searchByDueDate(dueDate).stream().map(responseMapper::toResponse).toList();
    }

    // Añadir esto a TaskService.java
    public List<TaskResponse> findByDueDateBetween(LocalDate start, LocalDate end) {
        return taskRepository.searchByDueDateBetween(start, end).stream()
                .map(responseMapper::toResponse).toList();
    }

    public List<TaskResponse> findByClientId(Integer clientId){
        return taskRepository.searchByClientId(clientId).stream().map(responseMapper::toResponse).toList();
    }

    public List<TaskResponse> findByPhotoshootId(Integer photoshootId){
        return taskRepository.searchByPhotoshootId(photoshootId).stream().map(responseMapper::toResponse).toList();
    }

    public List<TaskResponse> findByStatus(TaskStatus status){
        return taskRepository.searchByStatus(status).stream().map(responseMapper::toResponse).toList();
    }

    public TaskResponse save(TaskRequest request){
        checkMandatoryFields(request);
        Task task = new Task();
        attachEntities(task,request);
        task.fillDetails(request);
        task.setCreatedAt();
        return responseMapper.toResponse(taskRepository.save(task));
    }

    public TaskResponse update(Integer id, TaskRequest request){
        checkMandatoryFields(request);
        Task exisitingTask = taskRepository.findById(id).orElseThrow(this::notFound);
        attachEntities(exisitingTask,request);
        exisitingTask.fillDetails(request);
        exisitingTask.setUpdatedAt();
        return responseMapper.toResponse(taskRepository.save(exisitingTask));
    }

    public void delete(Integer id) {
        Task task = taskRepository.findById(id).orElseThrow(this::notFound);
        Client client = task.getClient();

        taskRepository.delete(task);

        // Comprobación directa: ¿Es un cliente totalmente huérfano?
        boolean hasMoreTasks = taskRepository.countTotalTasksByClientId(client.getId()) > 0;
        boolean hasPhotoshoots = photoshootRepository.countPhotoshootsByClientId(client.getId()) > 0;

        if (!hasMoreTasks && !hasPhotoshoots) {
            clientService.deleteById(client.getId());
        }
    }

}
