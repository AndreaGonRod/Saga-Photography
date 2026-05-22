package com.photography.saga.service;

import com.photography.saga.dto.request.ClientRequest;
import com.photography.saga.dto.request.EventRequest;
import com.photography.saga.dto.response.*;
import com.photography.saga.exception.ErrorHandler;
import com.photography.saga.model.*;
import com.photography.saga.model.enums.DepositStatus;
import com.photography.saga.repository.ClientRepository;
import com.photography.saga.repository.EventRepository;
import com.photography.saga.repository.OfferRepository;
import com.photography.saga.repository.PhotoshootRepository;
import com.photography.saga.repository.StaffRepository;
import com.photography.saga.controller.ResponseMapper;
import com.photography.saga.model.Event.Entry;
import com.photography.saga.model.Event.Location;
import com.photography.saga.model.Event.Deposit;
import com.photography.saga.model.Event.AdditionalContact;
import com.photography.saga.dto.request.EventRequest.TimelineEntryRequest;
import com.photography.saga.util.TextFormatter;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
@AllArgsConstructor
public class EventService implements ErrorHandler {

    private final EventRepository eventRepository;
    private final StaffRepository staffRepository;
    private final ResponseMapper responseMapper;
    private final OfferService offerService;
    private final ClientService clientService;
    private final PhotoshootRepository photoshootRepository;
    public static final String NOT_PROVIDED = "No proporcionado";

    private void checkMandatoryFields(EventRequest request) {
        if (request.title() == null || request.title().isBlank() ||
                request.date() == null ||
                request.date().isBefore(LocalDate.now())||
                request.clients() == null || request.clients().isEmpty() ||
                request.offer() == null) {
            throw badRequest();
        }

        if (request.startTime() == null) {
            throw badRequest();
        }

        if (request.isFullDay() == (request.duration() != null && !request.duration().isZero())) {
            throw badRequest();
        }

        if (request.offer().id() == null
                && (request.offer().category() == null || request.offer().category().isBlank() ||
                        request.offer().subCategory() == null || request.offer().subCategory().isBlank() ||
                        request.offer().price() == null ||
                        request.offer().defaultTurnAround() == null || request.offer().defaultTurnAround() < 1)) {
            throw badRequest();
        }

        for (ClientRequest client : request.clients()) {
            if (client.id() == null && (client.name() == null || client.name().isBlank() ||
                    client.phone() == null || client.phone().isBlank())) {
                throw badRequest();
            }
        }
    }

    private String formatText(String text) {
        return TextFormatter.textFormatter(text);
    }

    private Location processLocation(Location requestLocation) {
        Location location = new Location();

        String ceremony = (requestLocation != null) ? requestLocation.getCeremony() : null;
        String reception = (requestLocation != null) ? requestLocation.getReception() : null;

        if (ceremony == null || ceremony.isBlank()) {
            location.setCeremony(NOT_PROVIDED);
            location.setSearchCeremony(formatText(NOT_PROVIDED));
        } else {
            location.setCeremony(ceremony.trim());
            location.setSearchCeremony(formatText(ceremony));
        }

        if (reception == null || reception.isBlank()) {
            location.setReception(NOT_PROVIDED);
            location.setSearchReception(formatText(NOT_PROVIDED));
        } else {
            location.setReception(reception.trim());
            location.setSearchReception(formatText(reception));
        }

        return location;
    }

    private Event.Deposit processDeposit(Event.Deposit requestDeposit) {
        Event.Deposit deposit = new Event.Deposit();

        if (requestDeposit == null || !requestDeposit.isRequired()) {
            deposit.setRequired(false);
            deposit.setAmount(BigDecimal.ZERO);
            deposit.setPaid(false);
            deposit.setStatus(null);
        } else {
            deposit.setRequired(true);
            if (requestDeposit.getAmount() != null && requestDeposit.getAmount().compareTo(BigDecimal.ZERO) < 0) {
                throw badRequest();
            }
            deposit.setAmount(requestDeposit.getAmount() != null ? requestDeposit.getAmount() : BigDecimal.ZERO);
            deposit.setPaid(requestDeposit.isPaid());
            deposit.setStatus(
                    requestDeposit.isPaid() ? DepositStatus.CONFIRMED : DepositStatus.AWAITING_DEPOSIT);
        }

        return deposit;
    }

    private Event.AdditionalContact processAdditionalContact(Event.AdditionalContact requestContact) {
        Event.AdditionalContact contact = new Event.AdditionalContact();

        if (requestContact == null ||
                requestContact.getName() == null || requestContact.getName().isBlank() ||
                requestContact.getPhone() == null || requestContact.getPhone().isBlank()) {

            contact.setName(NOT_PROVIDED);
            contact.setPhone(NOT_PROVIDED);
        } else {
            contact.setName(requestContact.getName().trim());
            contact.setPhone(TextFormatter.phoneFormatter(requestContact.getPhone()));
        }

        return contact;
    }

    private List<Entry> processTimeline(List<TimelineEntryRequest> requestTimeline) {
        if (requestTimeline == null || requestTimeline.isEmpty()) {
            return new ArrayList<>();
        }

        return requestTimeline.stream()
                .map(request -> {
                    // La clase interna es Event.Entry
                    Event.Entry entry = new Event.Entry();
                    entry.setStartTime(request.startTime());
                    entry.setActivity(request.activity());
                    entry.setAddress(request.address());
                    entry.setNotes(request.notes());
                    return entry;
                })
                .toList();
    }

    public void attachEntities(Event event, EventRequest request) {
        event.setOffer(offerService.getOrCreateEntity(request.offer()));

        event.setClientsList(request.clients().stream()
                .map(clientService::getOrCreateEntity)
                .collect(Collectors.toCollection(ArrayList::new)));

        if (request.staff() != null) {
            List<Staff> staffList = new ArrayList<>();
            for (var staffReq : request.staff()) {
                staffList.add(staffRepository.findById(staffReq.id()).orElseThrow(this::notFound));
            }
            event.setStaffList(staffList);
        }
    }

    private void validateAvailability(Event event) {
        for (Client client : event.getClientsList()) {
            eventRepository.findConflict(client.getId(), event.getDate())
                    .ifPresent(found -> {
                        if (event.getId() == null || !found.getId().equals(event.getId())) {
                            throw conflict();
                        }
                    });
        }

        if (event.getStaffList() != null) {
            for (Staff member : event.getStaffList()) {
                eventRepository.findStaffConflict(member.getId(), event.getDate(), event.getStartTime())
                        .ifPresent(found -> {
                            if (event.getId() == null || !found.getId().equals(event.getId())) {
                                throw conflict();
                            }
                        });
            }
        }
    }

    private void processComplexFields(Event event, EventRequest request) {
        event.setLocation(processLocation(request.location()));
        event.setDeposit(processDeposit(request.deposit()));
        event.setAdditionalContact(processAdditionalContact(request.additionalContact()));
        event.setTimeline(processTimeline(request.timeline()));
    }

    public List<EventResponse> findAll() {
        return eventRepository.findAll().stream().map(responseMapper::toResponse).toList();
    }

    public EventResponse findById(Integer id) {
        Event event = eventRepository.findById(id).orElseThrow(this::notFound);
        return responseMapper.toResponse(event);
    }

    public List<EventResponse> findByText(String text) {
        return eventRepository.searchByText(formatText(text)).stream().map(responseMapper::toResponse).toList();
    }

    public List<EventResponse> findByDate(LocalDate date) {
        return eventRepository.searchByDate(date).stream()
                .map(responseMapper::toResponse)
                .toList();
    }

    public List<EventResponse> findByDateBetween(LocalDate start, LocalDate end) {
        return eventRepository.searchByDateBetween(start, end).stream().map(responseMapper::toResponse).toList();
    }

    public List<EventResponse> findByDateAndStartTime(LocalDate date, LocalTime startTime) {
        return eventRepository.searchByDateAndStartTime(date, startTime).stream().map(responseMapper::toResponse)
                .toList();
    }

    public List<EventResponse> findByDueDate(LocalDate date) {
        return eventRepository.searchByDueDate(date).stream()
                .map(responseMapper::toResponse)
                .toList();
    }

    public List<EventResponse> findByDueDateBetween(LocalDate start, LocalDate end) {
        return eventRepository.searchByDueDateBetween(start, end).stream()
                .map(responseMapper::toResponse)
                .toList();
    }

    public List<EventResponse> findByStaffAndDateBetween(Integer staffId, LocalDate start, LocalDate end) {
        return eventRepository.findByStaffAndDateBetween(staffId, start, end).stream()
                .map(responseMapper::toResponse)
                .toList();
    }

    public Integer countByClientsListId(Integer id) {
        return eventRepository.countEventsByClientId(id);
    }

    public Integer countByStaffListId(Integer id) {
        return eventRepository.countEventsByStaffId(id);
    }

    public EventResponse save(EventRequest request) {
        checkMandatoryFields(request);

        Event event = new Event();
        attachEntities(event, request);

        event.fillDetails(request);
        processComplexFields(event, request);
        validateAvailability(event);

        event.setCreatedAt();
        return responseMapper.toResponse(eventRepository.save(event));
    }

    public EventResponse update(Integer id, EventRequest request) {

        checkMandatoryFields(request);
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(this::notFound);

        attachEntities(existingEvent, request);
        existingEvent.fillDetails(request);
        processComplexFields(existingEvent, request);
        validateAvailability(existingEvent);
        existingEvent.setUpdatedAt();
        return responseMapper.toResponse(eventRepository.save(existingEvent));
    }

    public EventResponse updateTimeLine(Integer id, EventRequest request) {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(this::notFound);
        existingEvent.getTimeline().clear();
        if (request.timeline() != null) {
            existingEvent.getTimeline().addAll(processTimeline(request.timeline()));
        }
        existingEvent.setUpdatedAt();
        return responseMapper.toResponse(eventRepository.save(existingEvent));
    }

    public void deleteById(Integer id) {
        Event event = eventRepository.findById(id).orElseThrow(this::notFound);
        List<Client> assignedClients = new ArrayList<>(event.getClientsList());

        eventRepository.delete(event);
        eventRepository.flush(); // Crucial para que el conteo posterior sea real

        for (Client client : assignedClients) {
            if (photoshootRepository.countTotalSessionsByClientId(client.getId()) == 0) {
                clientService.deleteById(client.getId());
            }
        }
    }

}