package com.photography.saga.service;

import com.photography.saga.dto.request.ClientRequest;
import com.photography.saga.dto.request.PhotoshootRequest;
import com.photography.saga.dto.response.ClientResponse;
import com.photography.saga.dto.response.OfferResponse;
import com.photography.saga.dto.response.PhotoshootResponse;
import com.photography.saga.exception.ErrorHandler;
import com.photography.saga.model.Client;
import com.photography.saga.model.Offer;
import com.photography.saga.model.Photoshoot;
import com.photography.saga.repository.ClientRepository;
import com.photography.saga.repository.EventRepository;
import com.photography.saga.repository.OfferRepository;
import com.photography.saga.repository.PhotoshootRepository;
import com.photography.saga.controller.ResponseMapper;
import com.photography.saga.util.TextFormatter;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Setter
@Getter
@Transactional
@Service
@RequiredArgsConstructor
public class PhotoshootService implements ErrorHandler {

    private final PhotoshootRepository photoshootRepository;
    private final EventRepository eventRepository;
    private final ClientService clientService;
    private final OfferService offerService;
    private final ResponseMapper responseMapper;

    private String formatTitle(String title) {
        return TextFormatter.textFormatter(title);
    }

    private void checkMandatoryFields(PhotoshootRequest request) {
        // 1. Validamos los campos que ahora están en la superficie
        if (request.title() == null || request.title().isBlank() ||
                request.date() == null ||
                request.date().isBefore(LocalDate.now())||
                request.startTime() == null ||
                request.duration() == null ||
                request.clients() == null || request.clients().isEmpty() ||
                request.offer() == null) {
            throw badRequest();
        }

        // 2. Validación de la Oferta (Sigue igual porque ya era directa)
        if (request.offer().id() == null
                && (request.offer().category() == null || request.offer().category().isBlank() ||
                        request.offer().subCategory() == null || request.offer().subCategory().isBlank() ||
                        request.offer().price() == null ||
                        request.offer().defaultTurnAround() == null || request.offer().defaultTurnAround() < 1)) {
            throw badRequest();
        }

        // 3. Validación de Clientes
        for (ClientRequest client : request.clients()) {
            if (client.id() == null && (client.name() == null || client.name().isBlank() ||
                    client.phone() == null || client.phone().isBlank())) {
                throw badRequest();
            }
        }
    }

    public void attachEntities(Photoshoot photoshoot, PhotoshootRequest request) {
        photoshoot.setOffer(offerService.getOrCreateEntity(request.offer()));

        photoshoot.setClientsList(request.clients().stream()
                .map(clientService::getOrCreateEntity)
                .collect(Collectors.toCollection(ArrayList::new)));
    }

    private void validateAvailability(Photoshoot photoshoot) {
        for (Client client : photoshoot.getClientsList()) {
            photoshootRepository.findConflict(
                    client.getId(),
                    photoshoot.getDate()).ifPresent(found -> {
                        if (photoshoot.getId() == null || !found.getId().equals(photoshoot.getId())) {
                            throw conflict();
                        }
                    });
        }
    }

    public Integer countByClientsListId(Integer id) {
        return photoshootRepository.countTotalSessionsByClientId(id);
    }

    public List<PhotoshootResponse> findAll() {
        return photoshootRepository.findAll().stream().map(responseMapper::toResponse).toList();
    }

    public PhotoshootResponse findById(Integer id) {
        Photoshoot photoshoot = photoshootRepository.findById(id).orElseThrow(this::notFound);
        return responseMapper.toResponse(photoshoot);
    }

    public List<PhotoshootResponse> findBySearchTitle(String title) {
        return photoshootRepository.searchByTitle(formatTitle(title)).stream().map(responseMapper::toResponse).toList();
    }

    public List<PhotoshootResponse> findByDate(LocalDate date) {
        return photoshootRepository.searchByDate(date).stream()
                .map(responseMapper::toResponse)
                .toList();
    }

    public List<PhotoshootResponse> findByDateBetween(LocalDate start, LocalDate end) {
        return photoshootRepository.searchByDateBetween(start, end).stream().map(responseMapper::toResponse).toList();
    }

    public List<PhotoshootResponse> findByDateAndStartTime(LocalDate date, LocalTime startTime) {
        return photoshootRepository.searchByDateAndStartTime(date, startTime).stream().map(responseMapper::toResponse)
                .toList();
    }

    public List<PhotoshootResponse> findByDueDate(LocalDate date) {
        return photoshootRepository.searchByDueDate(date).stream()
                .map(responseMapper::toResponse).toList();
    }

    public List<PhotoshootResponse> findByDueDateBetween(LocalDate start, LocalDate end) {
        return photoshootRepository.searchByDueDateBetween(start, end).stream().map(responseMapper::toResponse).toList();
    }

    public List<PhotoshootResponse> findByEventDate(LocalDate date){
        return photoshootRepository.searchByEventDate(date).stream().map(responseMapper::toResponse).toList();
    }

    public List<PhotoshootResponse> findByEventDateBetween(LocalDate start, LocalDate end) {
        return photoshootRepository.searchByEventDateBetween(start, end)
                .stream().map(responseMapper::toResponse).toList();
    }


    public PhotoshootResponse save(PhotoshootRequest request) {
        checkMandatoryFields(request);

        Photoshoot photoshoot = new Photoshoot();
        attachEntities(photoshoot, request);
        photoshoot.fillDetails(request);
        validateAvailability(photoshoot);
        photoshoot.setCreatedAt();
        return responseMapper.toResponse(photoshootRepository.save(photoshoot));
    }

    public PhotoshootResponse update(Integer id, PhotoshootRequest request) {
        checkMandatoryFields(request);
        Photoshoot existingPhotoshoot = photoshootRepository.findById(id).orElseThrow(this::notFound);
        attachEntities(existingPhotoshoot, request);

        existingPhotoshoot.fillDetails(request);

        validateAvailability(existingPhotoshoot);

        existingPhotoshoot.setUpdatedAt();
        return responseMapper.toResponse(photoshootRepository.save(existingPhotoshoot));
    }

    public void delete(Integer id) {
        Photoshoot existingPhotoshoot = photoshootRepository.findById(id).orElseThrow(this::notFound);
        List<Client> assignedClients = new ArrayList<>(existingPhotoshoot.getClientsList());

        photoshootRepository.delete(existingPhotoshoot);
        photoshootRepository.flush();

        for (Client assignedClient : assignedClients) {
            // countTotalSessionsByClientId debe ser la query SIN 'TYPE(p) = Photoshoot'
            if (photoshootRepository.countTotalSessionsByClientId(assignedClient.getId()) == 0) {
                clientService.deleteById(assignedClient.getId());
            }
        }
    }

}
