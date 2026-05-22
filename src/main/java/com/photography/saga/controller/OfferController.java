package com.photography.saga.controller;

import com.photography.saga.dto.request.OfferRequest;
import com.photography.saga.dto.response.OfferResponse;
import com.photography.saga.service.OfferService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/offers")
@AllArgsConstructor
@CrossOrigin("*")
public class OfferController {

    private final OfferService offerService;

    @GetMapping
    public List<OfferResponse> getAll() {
        return offerService.findAll();
    }

    @GetMapping("/{id}")
    public OfferResponse getById(@PathVariable Integer id) {
        return offerService.findById(id);
    }

    @GetMapping("/search/category")
    public List<OfferResponse> getByCategory(@RequestParam String category) {
        return offerService.findByCategory(category);
    }

    @GetMapping("/search/subcategory")
    public List<OfferResponse> getBySubcategory(@RequestParam String subCategory) {
        return offerService.findBySubCategory(subCategory);
    }

    @GetMapping("/search/both")
    public OfferResponse getByBoth(@RequestParam String category, @RequestParam String subCategory) {
        return offerService.findByBoth(category, subCategory);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OfferResponse post(@Valid @RequestBody OfferRequest request) {
        return offerService.save(request);
    }

    @PutMapping("/{id}")
    public OfferResponse update(@PathVariable Integer id, @Valid @RequestBody OfferRequest request) {
        return offerService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        offerService.deleteById(id);
    }
}