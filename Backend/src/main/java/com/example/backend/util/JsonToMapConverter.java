package com.example.backend.util;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.HashMap;
import java.util.Map;

@Converter
public class JsonToMapConverter implements AttributeConverter<Map<String, Object>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, Object> map) {
        if (map == null) return null;
        try {
            return objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Map<String, Object> convertToEntityAttribute(String json) {
        if (json == null) return null;
        try {
            return objectMapper.readValue(json, HashMap.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
