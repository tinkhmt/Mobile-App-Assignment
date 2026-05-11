package com.mobiledev.SEdu.subscription.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "subscriptions")
public class Subscription {
    @Id private String id;
    private String userId;
    private SubscriptionPlan plan;
    private PaymentMethod paymentMethod;
    private String transactionId;
    private double amountPaid;
    private Instant startDate;
    private Instant endDate;
    @JsonProperty("active")
    private boolean active;

    public Subscription() {}
    public Subscription(String userId, SubscriptionPlan plan, PaymentMethod paymentMethod,
                        String transactionId, double amountPaid, Instant startDate, Instant endDate) {
        this.userId = userId; this.plan = plan; this.paymentMethod = paymentMethod;
        this.transactionId = transactionId; this.amountPaid = amountPaid;
        this.startDate = startDate; this.endDate = endDate; this.active = true;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public SubscriptionPlan getPlan() { return plan; }
    public void setPlan(SubscriptionPlan plan) { this.plan = plan; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(double amountPaid) { this.amountPaid = amountPaid; }
    public Instant getStartDate() { return startDate; }
    public void setStartDate(Instant startDate) { this.startDate = startDate; }
    public Instant getEndDate() { return endDate; }
    public void setEndDate(Instant endDate) { this.endDate = endDate; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
