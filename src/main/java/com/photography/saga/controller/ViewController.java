package com.photography.saga.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/staff")
    public String staff() {
        return "staff";
    }

    @GetMapping("/clients")
    public String clients() {
        return "clients";
    }

    @GetMapping("/photoshoots")
    public String photoshoots() {
        return "photoshoots";
    }

    @GetMapping("/offer")
    public String offer() {
        return "offer";
    }

    @GetMapping("/appointments")
    public String appointments() {
        return "appointments";
    }

    @GetMapping("/events")
    public String events() {
        return "events";
    }

    @GetMapping("/calendar")
    public String calendar() {
        return "calendar";
    }
}
