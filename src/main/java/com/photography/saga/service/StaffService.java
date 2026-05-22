package com.photography.saga.service;


import com.photography.saga.dto.request.StaffRequest;
import com.photography.saga.dto.response.StaffResponse;
import com.photography.saga.exception.ErrorHandler;
import com.photography.saga.model.Staff;
import com.photography.saga.repository.StaffRepository;
import com.photography.saga.controller.ResponseMapper;
import com.photography.saga.util.TextFormatter;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Objects;

@Transactional
@RequiredArgsConstructor
@Service
public class StaffService implements ErrorHandler {

    private final StaffRepository staffRepository;
    private final ResponseMapper responseMapper;

    private void checkMandatoryFields(StaffRequest request) {
        if (request.name() == null || request.phone() == null) {
            throw badRequest();
        }
    }
    private void validateAvailability(Staff staff) {
        staffRepository.findByPhone(formatPhone(staff.getPhone())).ifPresent(found -> {
            if (!Objects.equals(found.getId(),staff.getId())) {
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

    public List<StaffResponse> findAll() {
        return staffRepository.findAll().stream().map(responseMapper::toResponse).toList();
    }
    public StaffResponse findById(Integer id) {
        return staffRepository.findById(id).map(responseMapper::toResponse)
                .orElseThrow(this::notFound);
    }
    public List<StaffResponse> searchByFullName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return findAll();
        }

        return staffRepository.searchByFullName(format(fullName))
                .stream()
                .map(responseMapper::toResponse)
                .toList();
    }
    public List<StaffResponse> searchByPhone(String phone) {
        return staffRepository.searchByPhone(formatPhone(phone))
                .stream()
                .map(responseMapper::toResponse)
                .toList();
    }

    public StaffResponse save(StaffRequest request) {
        checkMandatoryFields(request);
        Staff staff = new Staff();
        staff.fillDetails(request);
        validateAvailability(staff);
        return responseMapper.toResponse(staffRepository.save(staff));
    }

    public StaffResponse update(Integer id, StaffRequest request) {
        checkMandatoryFields(request);
        Staff existingStaff = staffRepository.findById(id).orElseThrow(this::notFound);
        existingStaff.fillDetails(request);
        validateAvailability(existingStaff);
        return responseMapper.toResponse(staffRepository.save(existingStaff));
    }

    public void deleteById(Integer id) {
        if (!staffRepository.existsById(id)) throw notFound();
        staffRepository.deleteById(id);
    }

}