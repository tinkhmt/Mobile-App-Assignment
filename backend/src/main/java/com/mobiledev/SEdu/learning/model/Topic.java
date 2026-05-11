package com.mobiledev.SEdu.learning.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "topics")
public class Topic {
    @Id
    private String id;
    private String languageId;
    private String name;
    private boolean isPremium;

    public Topic() {}
    public Topic(String languageId, String name) { this.languageId = languageId; this.name = name; this.isPremium = false; }
    public Topic(String languageId, String name, boolean isPremium) { this.languageId = languageId; this.name = name; this.isPremium = isPremium; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLanguageId() { return languageId; }
    public void setLanguageId(String languageId) { this.languageId = languageId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    @JsonProperty("isPremium")
    public boolean isPremium() { return isPremium; }
    public void setPremium(boolean premium) { isPremium = premium; }
}
