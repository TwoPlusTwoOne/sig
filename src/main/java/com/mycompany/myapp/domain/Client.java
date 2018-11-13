package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Client.
 */
@Entity
@Table(name = "client")
public class Client implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "client")
    private Set<Locale> locales = new HashSet<>();
    @OneToMany(mappedBy = "client")
    private Set<PurchaseOrder> purchaseOrders = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Client name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Locale> getLocales() {
        return locales;
    }

    public Client locales(Set<Locale> locales) {
        this.locales = locales;
        return this;
    }

    public Client addLocales(Locale locale) {
        this.locales.add(locale);
        locale.setClient(this);
        return this;
    }

    public Client removeLocales(Locale locale) {
        this.locales.remove(locale);
        locale.setClient(null);
        return this;
    }

    public void setLocales(Set<Locale> locales) {
        this.locales = locales;
    }

    public Set<PurchaseOrder> getPurchaseOrders() {
        return purchaseOrders;
    }

    public Client purchaseOrders(Set<PurchaseOrder> purchaseOrders) {
        this.purchaseOrders = purchaseOrders;
        return this;
    }

    public Client addPurchaseOrders(PurchaseOrder purchaseOrder) {
        this.purchaseOrders.add(purchaseOrder);
        purchaseOrder.setClient(this);
        return this;
    }

    public Client removePurchaseOrders(PurchaseOrder purchaseOrder) {
        this.purchaseOrders.remove(purchaseOrder);
        purchaseOrder.setClient(null);
        return this;
    }

    public void setPurchaseOrders(Set<PurchaseOrder> purchaseOrders) {
        this.purchaseOrders = purchaseOrders;
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
        Client client = (Client) o;
        if (client.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), client.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Client{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
