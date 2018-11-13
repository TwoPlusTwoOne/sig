package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A ProductInPurchaseOrder.
 */
@Entity
@Table(name = "product_in_purchase_order")
public class ProductInPurchaseOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "quantity")
    private Integer quantity;

    @ManyToOne
    @JsonIgnoreProperties("")
    private Locale locale;

    @ManyToOne
    @JsonIgnoreProperties("products")
    private PurchaseOrder purchaseOrder;

    @ManyToOne
    @JsonIgnoreProperties("purchaseOrders")
    private Product product;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public ProductInPurchaseOrder quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Locale getLocale() {
        return locale;
    }

    public ProductInPurchaseOrder locale(Locale locale) {
        this.locale = locale;
        return this;
    }

    public void setLocale(Locale locale) {
        this.locale = locale;
    }

    public PurchaseOrder getPurchaseOrder() {
        return purchaseOrder;
    }

    public ProductInPurchaseOrder purchaseOrder(PurchaseOrder purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
        return this;
    }

    public void setPurchaseOrder(PurchaseOrder purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
    }

    public Product getProduct() {
        return product;
    }

    public ProductInPurchaseOrder product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ProductInPurchaseOrder productInPurchaseOrder = (ProductInPurchaseOrder) o;
        if (productInPurchaseOrder.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productInPurchaseOrder.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProductInPurchaseOrder{" +
            "id=" + getId() +
            ", quantity=" + getQuantity() +
            "}";
    }
}
