package com.example.backend.DTO.request;


public class ProductRequestDTO {
    private String query; // can be product name or product URL

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
}

