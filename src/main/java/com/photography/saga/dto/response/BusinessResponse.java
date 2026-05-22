package com.photography.saga.dto.response;

import java.util.List;

public record BusinessResponse(
        Integer id,
        String name,
        String taxId,
        String address,
        List<ScheduleResponse> schedules) {
}
