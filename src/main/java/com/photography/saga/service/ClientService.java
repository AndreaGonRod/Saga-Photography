package com.photography.saga.service;

import com.photography.saga.dto.request.ClientRequest;
import com.photography.saga.dto.response.ClientResponse;
import com.photography.saga.exception.ErrorHandler;
import com.photography.saga.model.Client;
import com.photography.saga.repository.ClientRepository;
import com.photography.saga.controller.ResponseMapper;
import com.photography.saga.util.TextFormatter;
import com.photography.saga.repository.PhotoshootRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Transactional
@RequiredArgsConstructor
@Service
public class ClientService implements ErrorHandler {

    private final ClientRepository clientRepository;
    private final PhotoshootRepository photoshootRepository;
    private final ResponseMapper responseMapper;

    private void checkMandatoryFields(ClientRequest request) {
        if (request.name() == null || request.phone() == null) {
            throw badRequest();
        }
    }

    private void validateAvailability(Client client) {
        clientRepository.findByPhone(client.getPhone()).ifPresent(found -> {
            if (!Objects.equals(found.getId(), client.getId())) {
                throw conflict();
            }
        });
    }

    private String format(String text) {
        return TextFormatter.textFormatter(text);
    }

    private String formatPhone(String phone) {
        return TextFormatter.phoneFormatter(phone);
    }

    public List<ClientResponse> findAll() {
        return clientRepository.findAll().stream().map(responseMapper::toResponse).toList();
    }

    public ClientResponse findById(Integer id) {
        return clientRepository.findById(id)
                .map(responseMapper::toResponse)
                .orElseThrow(this::notFound);
    }

    public List<ClientResponse> searchByFullName(String fullName) {
        if (fullName == null || fullName.isBlank())
            return findAll();

        return clientRepository.searchByFullName(format(fullName))
                .stream()
                .map(responseMapper::toResponse)
                .toList();
    }

    public List<ClientResponse> searchByPhone(String phone) {
        return clientRepository.searchByPhone(formatPhone(phone))
                .stream()
                .map(responseMapper::toResponse)
                .toList();
    }

    public ClientResponse save(ClientRequest request) {
        checkMandatoryFields(request);
        Client client = new Client();
        client.fillDetails(request);
        validateAvailability(client);
        return responseMapper.toResponse(clientRepository.save(client));
    }

    public ClientResponse update(Integer id, ClientRequest request) {
        checkMandatoryFields(request);

        Client existingClient = clientRepository.findById(id)
                .orElseThrow(this::notFound);

        existingClient.fillDetails(request);
        validateAvailability(existingClient);

        return responseMapper.toResponse(clientRepository.save(existingClient));
    }

    public void deleteById(Integer id) {
        if (!clientRepository.existsById(id)) {
            throw notFound();
        }
        clientRepository.deleteById(id);
    }

    public Client getOrCreateEntity(ClientRequest request) {
        if (request.id() != null) {
            return clientRepository.findById(request.id())
                    .orElseThrow(this::notFound);
        }

        return clientRepository.findByPhone(TextFormatter.phoneFormatter(request.phone()))
                .orElseGet(() -> {
                    Client client = new Client();
                    client.fillDetails(request);
                    return clientRepository.save(client);
                });
    }

    public void deleteIfOrphan(Integer clientId) {
        if (photoshootRepository.countTotalSessionsByClientId(clientId) == 0) {
            this.deleteById(clientId);
        }
    }

}
