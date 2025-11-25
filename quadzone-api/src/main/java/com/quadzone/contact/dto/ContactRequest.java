package com.quadzone.contact.dto;

import lombok.Data;

@Data
public class ContactRequest {
    private String name;
    private String email;
    private String subject;
    private String message;
}
