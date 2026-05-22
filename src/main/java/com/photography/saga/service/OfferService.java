package com.photography.saga.service;


import com.photography.saga.dto.request.OfferRequest;
import com.photography.saga.dto.response.OfferResponse;
import com.photography.saga.exception.ErrorHandler;
import com.photography.saga.controller.ResponseMapper;
import com.photography.saga.model.Offer;
import com.photography.saga.repository.OfferRepository;
import com.photography.saga.util.TextFormatter;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Objects;


@Transactional
@Service
@RequiredArgsConstructor
public class OfferService implements ErrorHandler {

    private final OfferRepository offerRepository;
    private final ResponseMapper responseMapper;

    private void checkMandatoryFields(OfferRequest request) {
        if (request.category() == null || request.subCategory() == null || request.defaultTurnAround() == null || request.defaultTurnAround() <= 0) {
            throw badRequest();
        }
    }
    private void validateAvailability(Offer offer) {
        offerRepository.findByBoth(offer.getSearchCategory(), offer.getSearchSubCategory())
                .ifPresent(found -> {
                    if (!Objects.equals(found.getId(), offer.getId())) {
                        throw conflict();
                    }
                });
    }


    private String format(String text){
        return TextFormatter.textFormatter(text);
    }

    public List<OfferResponse> findAll() {
        return offerRepository.findAll().stream().map(responseMapper::toResponse).toList();
    }
    public OfferResponse findById(Integer id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(this::notFound);
        return responseMapper.toResponse(offer);
    }
    public List<OfferResponse> findByCategory(String category) {
        return offerRepository.findByCategory(format(category)).stream().map(responseMapper::toResponse).toList();
    }
    public List<OfferResponse> findBySubCategory(String subCategory) {
        return offerRepository.findBySubcategory(format(subCategory)).stream().map(responseMapper::toResponse).toList();
    }
    public OfferResponse findByBoth(String category, String subCategory) {
        return offerRepository.findByBoth(format(category), format(subCategory))
                .map(responseMapper::toResponse)
                .orElseThrow(this::notFound);
    }

    public OfferResponse save(OfferRequest request) {
        checkMandatoryFields(request);


        Offer offer = new Offer();
        offer.fillDetails(request);
        validateAvailability(offer);
        return responseMapper.toResponse(offerRepository.save(offer));
    }

    public OfferResponse update(Integer id, OfferRequest request) {
        checkMandatoryFields(request);

        Offer existingOffer = offerRepository.findById(id)
                .orElseThrow(this::notFound);


        existingOffer.fillDetails(request);
        validateAvailability(existingOffer);

        return responseMapper.toResponse(offerRepository.save(existingOffer));
    }

    public void deleteById(Integer id) {
        if (!offerRepository.existsById(id)) {
            throw notFound();
        }
        offerRepository.deleteById(id);
    }

    public Offer getOrCreateEntity(OfferRequest request) {
        if (request.id() != null) {
            return offerRepository.findById(request.id())
                    .orElseThrow(this::notFound);
        }
        return offerRepository.findByBoth(format(request.category()), format(request.subCategory()))
                .orElseGet(() -> {
                    Offer offer = new Offer();
                    offer.fillDetails(request);
                    return offerRepository.save(offer);
                });
    }
}


