package com.photography.saga.controller;
import com.photography.saga.dto.request.ClientRequest;
import com.photography.saga.dto.response.ClientResponse;
import com.photography.saga.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    public List<ClientResponse> getAll(){
        return clientService.findAll();
    }

    @GetMapping("/{id}")
    public ClientResponse getById(@PathVariable Integer id){ // Cambio a ClientResponse
        return clientService.findById(id);
    }

    @GetMapping("/search")
    public List<ClientResponse> getByFullName(@RequestParam String searchFullName){
        return clientService.searchByFullName(searchFullName);
    }

    @GetMapping("/search/phone")
    public List<ClientResponse> getByPhone(@RequestParam String phone){
        return clientService.searchByPhone(phone);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClientResponse post(@Valid @RequestBody ClientRequest request) {
        return clientService.save(request);
    }

    @PutMapping("/{id}")
    public ClientResponse update(@PathVariable Integer id, @Valid @RequestBody ClientRequest request){
        return clientService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id){
        clientService.deleteById(id);
    }
}

