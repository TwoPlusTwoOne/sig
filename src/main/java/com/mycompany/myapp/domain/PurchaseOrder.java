package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.mycompany.myapp.domain.enumeration.PurchaseOrderStatus;

/**
 * A PurchaseOrder.
 */
@Entity
@Table(name = "purchase_order")
public class PurchaseOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "jhi_date")
    private LocalDate date;

    @Column(name = "revision_attempts")
    private Integer revisionAttempts;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PurchaseOrderStatus status;

    @OneToMany(mappedBy = "purchaseOrder")
    private Set<ProductInPurchaseOrder> products = new HashSet<>();
    @ManyToOne
    @JsonIgnoreProperties("purchaseOrders")
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public PurchaseOrder date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getRevisionAttempts() {
        return revisionAttempts;
    }

    public PurchaseOrder revisionAttempts(Integer revisionAttempts) {
        this.revisionAttempts = revisionAttempts;
        return this;
    }

    public void setRevisionAttempts(Integer revisionAttempts) {
        this.revisionAttempts = revisionAttempts;
    }

    public PurchaseOrderStatus getStatus() {
        return status;
    }

    public PurchaseOrder status(PurchaseOrderStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(PurchaseOrderStatus status) {
        this.status = status;
    }

    public Set<ProductInPurchaseOrder> getProducts() {
        return products;
    }

    public PurchaseOrder products(Set<ProductInPurchaseOrder> productInPurchaseOrders) {
        this.products = productInPurchaseOrders;
        return this;
    }

    public PurchaseOrder addProduct(ProductInPurchaseOrder productInPurchaseOrder) {
        this.products.add(productInPurchaseOrder);
        productInPurchaseOrder.setPurchaseOrder(this);
        return this;
    }

    public PurchaseOrder removeProduct(ProductInPurchaseOrder productInPurchaseOrder) {
        this.products.remove(productInPurchaseOrder);
        productInPurchaseOrder.setPurchaseOrder(null);
        return this;
    }

    public void setProducts(Set<ProductInPurchaseOrder> productInPurchaseOrders) {
        this.products = productInPurchaseOrders;
    }

    public Client getClient() {
        return client;
    }

    public PurchaseOrder client(Client client) {
        this.client = client;
        return this;
    }

    public void setClient(Client client) {
        this.client = client;
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
        PurchaseOrder purchaseOrder = (PurchaseOrder) o;
        if (purchaseOrder.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), purchaseOrder.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PurchaseOrder{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", revisionAttempts=" + getRevisionAttempts() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
